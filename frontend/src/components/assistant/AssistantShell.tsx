'use client';

import { useState } from 'react';
import { Bot, RefreshCcw } from 'lucide-react';
import { ChatInput } from './ChatInput';
import { ConversationHistory } from './ConversationHistory';
import { SuggestedPrompts } from './SuggestedPrompts';
import { CustomerContext } from './CustomerContext';
import { useAllCustomers } from '../../state/demoStore';
import { getProcessingSteps, toAssistantCustomer } from '../../data/aiResponses';
import { sendMessage } from '../../services/aiService';
import { ChatMessage as ChatMessageType } from '../../types/ai';

function timestamp() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function AssistantShell({ initialCustomerId = null }: { initialCustomerId?: string | null }) {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [customerId, setCustomerId] = useState<string | null>(initialCustomerId);
  const [loading, setLoading] = useState(false);
  const [syncedCustomerId, setSyncedCustomerId] = useState(initialCustomerId);

  if (initialCustomerId !== syncedCustomerId) {
    setSyncedCustomerId(initialCustomerId);
    if (initialCustomerId) setCustomerId(initialCustomerId);
  }

  const customerRecords = useAllCustomers();
  const customerRecord = customerId ? customerRecords.find((record) => record.id === customerId) ?? null : null;
  const customerContext = customerRecord ? toAssistantCustomer(customerRecord) : null;

  async function runPrompt(prompt: string) {
    const text = prompt.trim();
    if (!text || loading) return;

    const userMessage: ChatMessageType = { id: makeId('user'), role: 'user', content: text, timestamp: timestamp(), status: 'complete' };
    const loadingId = makeId('assistant');
    const loadingMessage: ChatMessageType = { id: loadingId, role: 'assistant', content: '', timestamp: timestamp(), status: 'loading', processingSteps: getProcessingSteps(text) };
    const historySnapshot = [...messages, userMessage];

    setMessages((current) => [...current, userMessage, loadingMessage]);
    setInput('');
    setLoading(true);

    try {
      const result = await sendMessage({ message: text, history: historySnapshot, customer: customerContext });
      setMessages((current) => current.map((message) => message.id === loadingId
        ? { ...message, status: 'complete' as const, content: result.content, structured: result.structured, actions: result.actions, source: result.source }
        : message));
    } catch {
      setMessages((current) => current.map((message) => message.id === loadingId
        ? { ...message, status: 'error' as const, failedPrompt: text }
        : message));
    } finally {
      setLoading(false);
    }
  }

  function newConversation() {
    setMessages([]);
    setInput('');
  }

  return (
    <div className="ai-page">
      <div className="ai-page-heading">
        <div>
          <p className="dashboard-eyebrow"><span className="status-pulse" />Nexus intelligence / simulated environment</p>
          <h1>AI Banking Intelligence</h1>
          <p>Ask questions, analyze customers, and take intelligent banking actions.</p>
        </div>
        <button type="button" className="outline-action" onClick={newConversation} disabled={messages.length === 0}><RefreshCcw size={14} />New conversation</button>
      </div>

      <div className="ai-layout">
        <section className="ai-chat">
          {messages.length === 0 ? (
            <div className="ai-empty-state">
              <span className="ai-empty-icon"><Bot size={22} /></span>
              <h2>Ask the Nexus banking assistant</h2>
              <p>Query customer intelligence, explain AI recommendations, and surface risk or engagement signals across the portfolio.</p>
              <SuggestedPrompts onSelect={runPrompt} />
            </div>
          ) : (
            <ConversationHistory messages={messages} onRetry={runPrompt} />
          )}
          <ChatInput value={input} onChange={setInput} onSubmit={() => runPrompt(input)} disabled={loading} />
        </section>

        <CustomerContext customer={customerContext} customerId={customerId} onSelectCustomer={setCustomerId} />
      </div>
    </div>
  );
}
