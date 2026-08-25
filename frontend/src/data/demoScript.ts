import { customerRecords } from './customers';
import { DemoStageMeta } from '../types/demo';

/** The one demo customer used throughout the whole walkthrough — sourced from the real customer record so nothing conflicts with the live app. */
export const DEMO_CUSTOMER = customerRecords.find((customer) => customer.id === 'CUS-20481')!;

/** Narrative figures already established as canon elsewhere in the app (Customer 360 reasoning panel, AI Assistant mock replies) — reused here rather than re-invented, to guarantee consistency. */
export const DEMO_FINANCIALS = {
  monthlySpending: 36100,
  travelSpending: 12400,
  digitalTransactionsPerMonth: 124,
};

export const DEMO_STAGES: DemoStageMeta[] = [
  { index: 0, id: 'acquisition', shortLabel: 'Acquisition', title: '01 · Intelligent Acquisition', subtitle: 'A prospective customer begins an account application. AI analyzes their requirements and identifies the most relevant account type.', autoPlaySeconds: 4, presenterHint: 'Show how AI reads customer requirements and recommends an account type — not just a form.' },
  { index: 1, id: 'onboarding', shortLabel: 'KYC', title: '02 · Intelligent Onboarding', subtitle: 'Simulated documents are processed and cross-checked before the account is activated.', autoPlaySeconds: 5, presenterHint: 'Highlight that this is a demo verification, not a live KYC integration — say so explicitly if asked.' },
  { index: 2, id: 'intelligence', shortLabel: 'Intelligence', title: '03 · Customer Intelligence', subtitle: 'Nexus builds a living profile of the customer from behavior, not just static account data.', autoPlaySeconds: 5, presenterHint: 'Point out that health, engagement, risk and opportunity update from the same signals a human relationship manager would look at.' },
  { index: 3, id: 'decision', shortLabel: 'Recommendation', title: '04 · Multi-Agent Decision', subtitle: 'Multiple specialized agents collaborate to reach one explainable recommendation.', autoPlaySeconds: 7, presenterHint: 'This is the strongest moment — pause on the agent handoff and the confidence + evidence list.' },
  { index: 4, id: 'engagement', shortLabel: 'Engagement', title: '05 · Personalized Engagement', subtitle: 'The bank proactively reaches out — the customer never has to ask.', autoPlaySeconds: 5, presenterHint: 'Emphasize this is a simulated message — no real email or SMS is sent.' },
  { index: 5, id: 'risk', shortLabel: 'Risk', title: '06 · Risk Intelligence', subtitle: 'A separate, unusual transaction is introduced to show how Nexus reacts to anomalies — not a change to Rahul’s normal profile.', autoPlaySeconds: 7, presenterHint: 'Be clear this is a contrasting scenario, not a claim that Rahul himself is risky.' },
  { index: 6, id: 'human-review', shortLabel: 'Human Review', title: '07 · Human Oversight', subtitle: 'Sensitive decisions are never fully automated — a human makes the final call.', autoPlaySeconds: 5, presenterHint: 'Emphasize human approval for sensitive decisions — this is the responsible-AI moment.' },
  { index: 7, id: 'executive', shortLabel: 'Executive', title: '08 · Executive Intelligence', subtitle: 'The same intelligence rolls up into a portfolio-level view for decision-makers.', autoPlaySeconds: 6, presenterHint: 'Close on the lifecycle summary — one platform, one connected customer journey.' },
];

export const DEMO_RISK_CASE = {
  amount: 95000,
  time: '03:12 AM',
  location: 'Mumbai',
  typicalRange: '₹2,000–₹8,000',
  aiRiskScore: 91,
  aiConfidence: 93,
  signals: ['Unusual transaction amount', 'New location', 'Unusual transaction time', 'New merchant', 'Historical behavior deviation'],
};
