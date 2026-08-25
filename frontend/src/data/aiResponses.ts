import { customerRecords } from './customers';
import { CustomerRecord } from '../types/customer';
import { AssistantCustomerContext, PlatformSnapshot, SendMessageResult, SuggestedPrompt } from '../types/ai';

export const PLATFORM_SNAPSHOT: PlatformSnapshot = {
  totalCustomers: 24820,
  newCustomers: 1240,
  kycCompletion: 87,
  digitalAdoption: 72,
  atRiskCustomers: 426,
  humanEscalations: 37,
  topOpportunitySegment: 'Young Digital Users',
};

export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  { id: 'adopt-card', label: 'Which customers are likely to adopt a credit card?' },
  { id: 'why-rahul', label: 'Why was Rahul Sharma recommended a premium credit card?' },
  { id: 'declining', label: 'Show customers with declining digital engagement.' },
  { id: 'priority-risk', label: "What are today's highest priority customer risks?" },
  { id: 'summary', label: "Summarize today's customer activity." },
  { id: 'human-review', label: 'Which customers need human intervention?' },
  { id: 'under-engaged', label: 'Find high-value customers who are under-engaged.' },
];

function activityFor(record: CustomerRecord): string[] {
  const activity: string[] = [];
  if (record.engagement >= 85) activity.push('High UPI usage', 'Frequent mobile banking logins');
  else if (record.engagement < 55) activity.push('Declining app usage this month');
  if (record.segment.toLowerCase().includes('affluent') || record.balance > 800000) activity.push('Frequent travel spending');
  if (record.riskLevel === 'High') activity.push('Unusual transaction flagged for review');
  else activity.push('Consistent salary credits');
  if (record.kycStatus !== 'Verified') activity.push('KYC document review pending');
  return activity.length ? activity : ['Stable, low-frequency account activity'];
}

export function toAssistantCustomer(record: CustomerRecord): AssistantCustomerContext {
  return {
    id: record.id,
    name: record.name,
    age: record.age,
    monthlyIncome: record.monthlyIncome,
    balance: record.balance,
    monthlySpending: Math.round(record.monthlyIncome * 0.48),
    engagement: record.engagement,
    riskScore: record.riskScore,
    riskLevel: record.riskLevel,
    products: record.products,
    segment: record.segment,
    opportunityScore: record.opportunityScore,
    healthScore: record.healthScore,
    recentActivity: activityFor(record),
  };
}

export function findCustomerRecord(id: string): CustomerRecord | undefined {
  return customerRecords.find((record) => record.id === id);
}

const DECLINING_ENGAGEMENT_DEMO = [
  { name: 'Aarav Mehta', engagement: 42, change: '18% this month' },
  { name: 'Priya Sharma', engagement: 51, change: '14% this month' },
  { name: 'Rohan Gupta', engagement: 38, change: '23% this month' },
];

function rahulExplanationReply(): SendMessageResult {
  const rahul = findCustomerRecord('CUS-20481');
  return {
    content: 'Rahul shows strong digital engagement and high discretionary spending, which is a strong fit for a premium travel credit card.',
    structured: {
      signals: [
        '124 digital transactions/month',
        '₹12,400 travel spending/month',
        `${rahul?.engagement ?? 91}/100 digital engagement`,
        'Consistent salary credits and strong repayment behavior',
      ],
      recommendation: 'Premium Travel Credit Card',
      confidence: 91,
      nextStep: 'Relationship manager review before customer contact',
    },
    actions: [
      { label: 'Open Customer 360', href: '/customers/CUS-20481' },
      { label: 'Generate Offer', href: '/customers/CUS-20481' },
    ],
    source: 'mock',
  };
}

function premiumCardCandidatesReply(): SendMessageResult {
  const ranked = [...customerRecords].sort((a, b) => b.opportunityScore - a.opportunityScore).slice(0, 5);
  return {
    content: `${ranked.length} customers show strong signals for premium credit card adoption, ranked by AI opportunity score.`,
    structured: {
      customerListTitle: 'Likely premium credit card adopters',
      customerList: ranked.map((c) => ({ id: c.id, name: c.name, metric: `${c.opportunityScore}`, metricLabel: 'AI opportunity', detail: c.segment })),
      nextStep: 'Human-reviewed outreach is recommended before any offer is sent.',
    },
    actions: [
      { label: 'View Customers', href: '/customers' },
      { label: 'Open Customer 360', href: `/customers/${ranked[0]?.id ?? ''}` },
    ],
    source: 'mock',
  };
}

function decliningEngagementReply(): SendMessageResult {
  return {
    content: `${DECLINING_ENGAGEMENT_DEMO.length} customers show meaningfully declining digital engagement this month.`,
    structured: {
      customerListTitle: 'Customers with declining engagement',
      customerList: DECLINING_ENGAGEMENT_DEMO.map((c) => ({ name: c.name, metric: `${c.engagement}`, metricLabel: 'Engagement', detail: `↓ ${c.change}` })),
      recommendation: 'Proactive, human-reviewed outreach for this cohort',
    },
    actions: [{ label: 'View Customers', href: '/customers' }],
    source: 'mock',
  };
}

function needsAttentionReply(): SendMessageResult {
  const riskAlerts = customerRecords.filter((c) => c.riskLevel === 'High');
  const kycIssues = customerRecords.filter((c) => c.kycStatus !== 'Verified');
  const declining = customerRecords.filter((c) => c.engagement < 55);
  const highValueUnderEngaged = customerRecords.filter((c) => c.balance > 900000 && c.engagement < 70);
  return {
    content: 'Here is a prioritized view of customers who need attention today.',
    structured: {
      insight: 'Risk alerts and pending KYC cases carry the most urgency; declining engagement and under-engaged high-value customers can follow.',
      signals: [
        `${riskAlerts.length} risk alerts${riskAlerts[0] ? ` (e.g. ${riskAlerts[0].name})` : ''}`,
        `${kycIssues.length} KYC cases requiring review`,
        `${declining.length} customers with declining digital engagement`,
        `${highValueUnderEngaged.length} high-value customers under-engaged`,
      ],
      recommendation: 'Route risk alerts and KYC cases to a human reviewer first, then schedule engagement outreach for the rest.',
    },
    actions: [
      { label: 'View Customers', href: '/customers' },
      { label: 'Open Agent Workflow', href: '/agents' },
    ],
    source: 'mock',
  };
}

function dailySummaryReply(): SendMessageResult {
  return {
    content: "Here is today's banking intelligence summary.",
    structured: {
      summary: [
        { label: 'Customer acquisition', value: '+124 new customers' },
        { label: 'KYC', value: '17 cases require review' },
        { label: 'Digital adoption', value: '72%' },
        { label: 'Risk', value: '12 new alerts' },
        { label: 'AI opportunities', value: '184 high-potential customers' },
        { label: 'Next priority', value: 'Re-engage 42 declining digital users' },
      ],
    },
    actions: [
      { label: 'Open Agent Workflow', href: '/agents' },
      { label: 'View Customers', href: '/customers' },
    ],
    source: 'mock',
  };
}

function highValueUnderEngagedReply(): SendMessageResult {
  const matches = customerRecords.filter((c) => c.balance > 900000 && c.engagement < 70).sort((a, b) => b.balance - a.balance);
  return {
    content: `${matches.length} high-value customers currently show below-average digital engagement.`,
    structured: {
      customerListTitle: 'High value, under-engaged',
      customerList: matches.map((c) => ({ id: c.id, name: c.name, metric: `${c.engagement}`, metricLabel: 'Engagement', detail: c.segment })),
      recommendation: 'These customers carry high balances but low digital touchpoints — a relationship-manager check-in may be more effective than a digital nudge.',
    },
    actions: [{ label: 'View Customers', href: '/customers' }],
    source: 'mock',
  };
}

function genericReply(message: string, customer: AssistantCustomerContext | null): SendMessageResult {
  const lower = message.toLowerCase();
  if (customer) {
    return {
      content: `${customer.name} has a customer health score of ${customer.healthScore}/100, digital engagement of ${customer.engagement}/100, and an AI opportunity score of ${customer.opportunityScore}/100.`,
      structured: {
        insight: `${customer.name} appears potentially relevant for further review based on the available demo data.`,
        signals: [
          `Balance ₹${customer.balance.toLocaleString('en-IN')}`,
          `Risk ${customer.riskScore}/100 (${customer.riskLevel})`,
          `Products: ${customer.products.join(', ')}`,
        ],
        nextStep: 'Open Customer 360 for the full profile and explainable recommendation trail.',
      },
      actions: [{ label: 'Open Customer 360', href: `/customers/${customer.id}` }],
      source: 'mock',
    };
  }
  if (lower.includes('risk')) {
    return {
      content: `${PLATFORM_SNAPSHOT.atRiskCustomers} customers are currently showing elevated risk signals across the portfolio.`,
      structured: { insight: `${PLATFORM_SNAPSHOT.atRiskCustomers} customers show elevated risk signals. Human-reviewed outreach is recommended over an automated offer.` },
      actions: [{ label: 'View Customers', href: '/customers' }],
      source: 'mock',
    };
  }
  if (lower.includes('digital') || lower.includes('adoption')) {
    return {
      content: `Digital adoption across the portfolio is currently at ${PLATFORM_SNAPSHOT.digitalAdoption}%.`,
      source: 'mock',
    };
  }
  if (lower.includes('kyc')) {
    return {
      content: `KYC completion is at ${PLATFORM_SNAPSHOT.kycCompletion}% across the portfolio, with a number of cases in the human review queue.`,
      source: 'mock',
    };
  }
  return {
    content: `I can help analyze customers, explain AI recommendations, and surface risk or engagement signals across ${PLATFORM_SNAPSHOT.totalCustomers.toLocaleString('en-IN')} customers. Try asking about a specific customer or one of the suggested prompts above.`,
    source: 'mock',
  };
}

export function getMockReply(message: string, customer: AssistantCustomerContext | null): SendMessageResult {
  const lower = message.toLowerCase();
  if (lower.includes('rahul') && (lower.includes('why') || lower.includes('recommend') || lower.includes('card'))) return rahulExplanationReply();
  if (lower.includes('declin') && lower.includes('engag')) return decliningEngagementReply();
  if (lower.includes('high') && lower.includes('value') && (lower.includes('under-engaged') || lower.includes('under engaged') || lower.includes('engag'))) return highValueUnderEngagedReply();
  if ((lower.includes('summar') || lower.includes('intelligence summary')) && (lower.includes('today') || lower.includes('activity') || lower.includes('summar'))) return dailySummaryReply();
  if (lower.includes('attention') || lower.includes('human intervention') || (lower.includes('priority') && lower.includes('risk'))) return needsAttentionReply();
  if ((lower.includes('credit card') || lower.includes('adopt')) && !customer) return premiumCardCandidatesReply();
  return genericReply(message, customer);
}

export function getProcessingSteps(message: string): string[] {
  const lower = message.toLowerCase();
  if (lower.includes('why') || lower.includes('recommend') || lower.includes('opportunity') || lower.includes('card')) {
    return ['Customer Intelligence Agent', 'Recommendation Agent', 'Risk & Fraud Agent', 'Banking Assistant'];
  }
  if (lower.includes('declin') || lower.includes('risk') || lower.includes('attention')) {
    return ['Searching customer intelligence', 'Analyzing engagement signals', 'Compiling results'];
  }
  return ['Understanding request', 'Retrieving platform context', 'Analyzing banking data', 'Generating response'];
}
