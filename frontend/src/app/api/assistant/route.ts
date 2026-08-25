import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface AssistantCustomer {
  id: string;
  name: string;
  age: number;
  monthlyIncome: number;
  balance: number;
  monthlySpending: number;
  engagement: number;
  riskScore: number;
  riskLevel: string;
  products: string[];
  segment: string;
  opportunityScore: number;
  healthScore: number;
  recentActivity: string[];
}

interface AssistantRequestBody {
  message: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  customer?: AssistantCustomer | null;
}

const DEFAULT_MODEL = 'openai/gpt-oss-20b';
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

const PLATFORM_STATS = [
  'Total customers: 24,820',
  'New customers (this period): 1,240',
  'KYC completion: 87%',
  'Digital adoption: 72%',
  'At-risk customers: 426',
  'Human escalations: 37',
  'Top AI opportunity segment: Young Digital Users',
].join('\n');

function buildSystemPrompt(customer: AssistantCustomer | null | undefined) {
  const customerBlock = customer
    ? [
        'SELECTED CUSTOMER (simulated demo profile, currently open in the dashboard)',
        `Name: ${customer.name}`,
        `Customer ID: ${customer.id}`,
        `Age: ${customer.age}`,
        `Monthly income: Rs. ${customer.monthlyIncome.toLocaleString('en-IN')}`,
        `Balance: Rs. ${customer.balance.toLocaleString('en-IN')}`,
        `Monthly spending (est.): Rs. ${customer.monthlySpending.toLocaleString('en-IN')}`,
        `Digital engagement: ${customer.engagement}/100`,
        `Risk score: ${customer.riskScore}/100 (${customer.riskLevel})`,
        `Products held: ${customer.products.join(', ')}`,
        `Segment: ${customer.segment}`,
        `AI opportunity score: ${customer.opportunityScore}/100`,
        `Customer health score: ${customer.healthScore}/100`,
        `Recent activity: ${customer.recentActivity.join('; ')}`,
      ].join('\n')
    : 'No specific customer is currently selected. Answer at the portfolio/platform level unless the user names a customer.';

  return `You are the Nexus AI Banking Assistant, an enterprise banking intelligence assistant embedded in a bank employee's internal dashboard. Your users are relationship managers and analysts, not end customers.

Your job: help staff understand customers, analyze banking behavior, explain AI-generated product recommendations, identify risk signals, and suggest appropriate next actions.

Hard rules:
- Everything you see below is simulated demo data for a hackathon prototype. Never claim to access a real, live core banking system, real account records, or real customer data.
- Clearly separate customer analytics/observations, product recommendations, general financial information, and actual financial/credit decisions. You must never make an actual financial or credit decision, and never claim a guaranteed approval or guaranteed outcome. Prefer phrasing like "appears potentially relevant based on the available demo data".
- For sensitive questions (credit approval, compliance, confirmed fraud, large risk calls), recommend human/relationship-manager review instead of deciding yourself.
- Be concise. Prefer short, scannable structure over long paragraphs.
- When your answer is an analysis or recommendation, format it using plain-text section labels, each on its own line, in this order, including only the sections that are relevant:
INSIGHT
KEY SIGNALS
RECOMMENDATION
CONFIDENCE
NEXT STEP
Under KEY SIGNALS use short bullet lines starting with "- ". Keep INSIGHT to 1-2 sentences. CONFIDENCE should be a percentage when you make a recommendation. Do not use markdown bold, asterisks, or "#" headers.
- If the question is a simple factual/platform question, just answer directly in 1-3 sentences without forcing every section.

PLATFORM STATISTICS (simulated)
${PLATFORM_STATS}

${customerBlock}`;
}

export async function POST(request: Request) {
  let body: AssistantRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  if (!body?.message || typeof body.message !== 'string' || !body.message.trim()) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }

  const messages = [
    { role: 'system', content: buildSystemPrompt(body.customer) },
    ...(Array.isArray(body.history) ? body.history : []).slice(-8).map((turn) => ({ role: turn.role, content: turn.content })),
    { role: 'user', content: body.message },
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const groqResponse = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || DEFAULT_MODEL,
        messages,
        temperature: 0.4,
        max_tokens: 700,
      }),
      signal: controller.signal,
    });

    if (!groqResponse.ok) {
      return NextResponse.json({ error: 'upstream_error' }, { status: 502 });
    }

    const data = await groqResponse.json();
    const reply: string | undefined = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return NextResponse.json({ error: 'empty_reply' }, { status: 502 });
    }
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: 'upstream_error' }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
