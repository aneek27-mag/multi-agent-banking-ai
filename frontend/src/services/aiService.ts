import { getMockReply } from '../data/aiResponses';
import { AiAction, AssistantCustomerContext, ChatMessage, SendMessageInput, SendMessageResult, StructuredReply } from '../types/ai';

const SECTION_KEYS: { key: keyof Pick<StructuredReply, 'insight' | 'recommendation' | 'confidence' | 'nextStep'> | 'signals'; label: string }[] = [
  { key: 'insight', label: 'INSIGHT' },
  { key: 'signals', label: 'KEY SIGNALS' },
  { key: 'recommendation', label: 'RECOMMENDATION' },
  { key: 'confidence', label: 'CONFIDENCE' },
  { key: 'nextStep', label: 'NEXT STEP' },
];

function parseStructuredReply(text: string): StructuredReply | undefined {
  const lines = text.split('\n').map((line) => line.trim());
  const found: Record<string, string[]> = {};
  let current: string | null = null;
  let matchedAny = false;

  for (const line of lines) {
    const header = SECTION_KEYS.find((section) => line.toUpperCase() === section.label);
    if (header) {
      current = header.label;
      found[current] = [];
      matchedAny = true;
      continue;
    }
    if (current && line) found[current].push(line);
  }

  if (!matchedAny) return undefined;

  const structured: StructuredReply = {};
  if (found.INSIGHT?.length) structured.insight = found.INSIGHT.join(' ');
  if (found['KEY SIGNALS']?.length) structured.signals = found['KEY SIGNALS'].map((line) => line.replace(/^[-•]\s*/, ''));
  if (found.RECOMMENDATION?.length) structured.recommendation = found.RECOMMENDATION.join(' ');
  if (found.CONFIDENCE?.length) {
    const match = found.CONFIDENCE.join(' ').match(/\d+/);
    if (match) structured.confidence = Number(match[0]);
  }
  if (found['NEXT STEP']?.length) structured.nextStep = found['NEXT STEP'].join(' ');

  return structured;
}

function deriveActions(message: string, reply: string, customer: AssistantCustomerContext | null): AiAction[] {
  const actions: AiAction[] = [];
  const context = `${message} ${reply}`.toLowerCase();
  if (customer) actions.push({ label: 'Open Customer 360', href: `/customers/${customer.id}` });
  if (/declin|risk|attention|kyc|escalat/.test(context)) actions.push({ label: 'View Customers', href: '/customers' });
  if (/workflow|agent/.test(context)) actions.push({ label: 'Open Agent Workflow', href: '/agents' });
  const seen = new Set<string>();
  return actions.filter((action) => (seen.has(action.href) ? false : (seen.add(action.href), true))).slice(0, 3);
}

export async function sendMessage(input: SendMessageInput): Promise<SendMessageResult> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const response = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: input.message,
        history: toHistoryPayload(input.history),
        customer: input.customer,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) throw new Error('assistant_unavailable');
    const data = await response.json();
    if (!data?.reply) throw new Error('empty_reply');

    return {
      content: data.reply as string,
      structured: parseStructuredReply(data.reply),
      actions: deriveActions(input.message, data.reply, input.customer),
      source: 'groq',
    };
  } catch {
    return getMockReply(input.message, input.customer);
  }
}

function toHistoryPayload(history: ChatMessage[]) {
  return history
    .filter((message) => message.status === 'complete')
    .slice(-8)
    .map((message) => ({ role: message.role, content: message.content }));
}
