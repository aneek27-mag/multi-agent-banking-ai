import {
  ACQUISITION_FUNNEL,
  ACQUISITION_STATS,
  AGENT_PERFORMANCE,
  AI_INSIGHTS,
  DIGITAL_ADOPTION,
  ENGAGEMENT,
  EXECUTIVE_BRIEF,
  EXECUTIVE_KPIS,
  PRODUCT_OPPORTUNITIES,
  RANGE_SCALE,
  RISK_SUMMARY,
} from '../data/analytics';
import { AgentPerformance, AiInsight, DigitalAdoptionData, EngagementData, ExecutiveKpi, FunnelStage, ProductOpportunity, RiskSummary, TimeRange } from '../types/analytics';
import { applyIntelligenceScanResult, pushActivity } from '../state/demoStore';
import { sendMessage } from './aiService';

const SCALED_KPI_IDS = new Set(['new-customers', 'risk-alerts', 'human-escalations']);

function scale(value: number, range: TimeRange) {
  return Math.max(1, Math.round(value * RANGE_SCALE[range]));
}

export function getKPIs(range: TimeRange): ExecutiveKpi[] {
  return EXECUTIVE_KPIS.map((kpi) => {
    if (!SCALED_KPI_IDS.has(kpi.id)) return kpi;
    const numeric = Number(kpi.value.replace(/[^0-9.-]/g, ''));
    const scaled = scale(numeric, range);
    const formatted = kpi.value.trim().startsWith('+') ? `+${scaled.toLocaleString('en-IN')}` : scaled.toLocaleString('en-IN');
    return { ...kpi, value: formatted };
  });
}

export function getAcquisitionData(range: TimeRange): { funnel: FunnelStage[]; applicationCompletionRate: number; kycDropOffPct: number; avgOnboardingTime: string; aiAssistedConversionLift: number } {
  return {
    funnel: ACQUISITION_FUNNEL.map((stage) => ({ ...stage, value: scale(stage.value, range) })),
    ...ACQUISITION_STATS,
  };
}

/** The trend charts are inherently a fixed "last 6 months" historical view, independent of the time-range filter. */
export function getDigitalAdoptionData(): DigitalAdoptionData {
  return DIGITAL_ADOPTION;
}

export function getEngagementData(range: TimeRange): EngagementData {
  return {
    ...ENGAGEMENT,
    reEngagement: {
      targeted: scale(ENGAGEMENT.reEngagement.targeted, range),
      messagesGenerated: scale(ENGAGEMENT.reEngagement.messagesGenerated, range),
      messagesOpened: scale(ENGAGEMENT.reEngagement.messagesOpened, range),
      engagementImproved: scale(ENGAGEMENT.reEngagement.engagementImproved, range),
      avgImprovementPoints: ENGAGEMENT.reEngagement.avgImprovementPoints,
    },
  };
}

export function getRiskData(range: TimeRange): RiskSummary {
  return {
    totalAlerts: scale(RISK_SUMMARY.totalAlerts, range),
    high: scale(RISK_SUMMARY.high, range),
    medium: scale(RISK_SUMMARY.medium, range),
    low: scale(RISK_SUMMARY.low, range),
    escalated: scale(RISK_SUMMARY.escalated, range),
    resolved: scale(RISK_SUMMARY.resolved, range),
    trend: RISK_SUMMARY.trend,
  };
}

export function getAgentPerformance(): AgentPerformance[] {
  return AGENT_PERFORMANCE;
}

export function getProductOpportunities(): ProductOpportunity[] {
  return PRODUCT_OPPORTUNITIES;
}

export function getAiInsights(): AiInsight[] {
  return AI_INSIGHTS;
}

export interface ExecutiveBriefResult {
  summary: string;
  opportunities: string[];
  source: 'groq' | 'mock';
}

/** Reuses the existing aiService abstraction — never talks to Groq directly, and always has a reliable fallback. */
export async function generateExecutiveBrief(range: TimeRange): Promise<ExecutiveBriefResult> {
  const kpis = getKPIs(range);
  const risk = getRiskData(range);
  const engagement = getEngagementData(range);
  const kpiLine = kpis.map((kpi) => `${kpi.label}: ${kpi.value} (${kpi.changeLabel})`).join('; ');

  const question = `Write a 2-3 sentence executive banking intelligence brief for a bank manager, based on this simulated demo data for the "${range}" time range. KPIs: ${kpiLine}. Risk alerts: ${risk.totalAlerts} total, ${risk.escalated} escalated. Engagement re-engagement: ${engagement.reEngagement.targeted} customers targeted, average improvement +${engagement.reEngagement.avgImprovementPoints} points. Keep it factual and concise, no bullet points, no markdown.`;

  try {
    const result = await sendMessage({ message: question, history: [], customer: null });
    if (result.source === 'groq' && result.content) {
      return { summary: result.content, opportunities: EXECUTIVE_BRIEF.opportunities, source: 'groq' };
    }
  } catch {
    // fall through to the static brief
  }
  return { summary: EXECUTIVE_BRIEF.summary, opportunities: EXECUTIVE_BRIEF.opportunities, source: 'mock' };
}

export interface IntelligenceScanStep {
  label: string;
}

export const INTELLIGENCE_SCAN_STEPS: IntelligenceScanStep[] = [
  { label: 'Analyzing customer behavior…' },
  { label: 'Analyzing digital engagement…' },
  { label: 'Identifying product opportunities…' },
  { label: 'Reviewing risk signals…' },
  { label: 'Generating AI insights…' },
];

export interface IntelligenceScanResult {
  customersAnalyzed: number;
  engagementSignals: number;
  productOpportunities: number;
  riskSignals: number;
  highIntent: number;
  decliningEngagement: number;
  humanReview: number;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Simulated end-to-end portfolio intelligence scan: runs the 5-stage pipeline, refreshes the shared dashboard insight state, and logs an activity feed entry. Never calls a real banking system. */
export async function runIntelligenceScan(onStep?: (index: number, total: number, step: IntelligenceScanStep) => void): Promise<IntelligenceScanResult> {
  for (let index = 0; index < INTELLIGENCE_SCAN_STEPS.length; index += 1) {
    onStep?.(index, INTELLIGENCE_SCAN_STEPS.length, INTELLIGENCE_SCAN_STEPS[index]);
    await wait(600);
  }

  const result: IntelligenceScanResult = {
    customersAnalyzed: 24820,
    engagementSignals: 426,
    productOpportunities: 184,
    riskSignals: 42,
    highIntent: 184,
    decliningEngagement: 42,
    humanReview: 17,
  };

  applyIntelligenceScanResult(result);
  pushActivity({ agent: 'Customer Intelligence Agent', action: 'Completed AI intelligence scan across the portfolio', customer: 'Full portfolio', time: 'Just now', status: 'Completed' });

  return result;
}

function csvEscape(value: string | number) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function csvSection(title: string, rows: (string | number)[][]) {
  return [title, ...rows.map((row) => row.map(csvEscape).join(','))].join('\n');
}

export function buildReportCsv(range: TimeRange): string {
  const kpis = getKPIs(range);
  const acquisition = getAcquisitionData(range);
  const digital = getDigitalAdoptionData();
  const engagement = getEngagementData(range);
  const risk = getRiskData(range);
  const agents = getAgentPerformance();
  const opportunities = getProductOpportunities();

  const sections = [
    csvSection('Executive KPIs', [['Metric', 'Value', 'Change'], ...kpis.map((kpi) => [kpi.label, kpi.value, kpi.changeLabel])]),
    csvSection('Acquisition Funnel', [['Stage', 'Value'], ...acquisition.funnel.map((stage) => [stage.label, stage.value])]),
    csvSection('Digital Adoption Trend', [['Month', 'Score'], ...digital.trend.map((point) => [point.month, point.value])]),
    csvSection('Engagement', [['Segment', 'Percent'], ...engagement.breakdown.map((item) => [item.label, item.pct])]),
    csvSection('Risk Summary', [['Metric', 'Value'], ['Total alerts', risk.totalAlerts], ['High', risk.high], ['Medium', risk.medium], ['Low', risk.low], ['Escalated', risk.escalated], ['Resolved', risk.resolved]]),
    csvSection('Agent Performance', [['Agent', 'Tasks', 'Success rate', 'Avg confidence'], ...agents.map((agent) => [agent.name, agent.tasks, agent.successRate ?? '—', agent.avgConfidence ?? '—'])]),
    csvSection('AI Product Opportunities', [['Product', 'Potential customers', 'Avg confidence', 'Segment'], ...opportunities.map((item) => [item.product, item.potentialCustomers, `${item.avgConfidence}%`, item.segment])]),
  ];

  return sections.join('\n\n');
}

/** Client-only: builds the CSV report and triggers a browser download. */
export function downloadReport(range: TimeRange = '30d') {
  if (typeof window === 'undefined') return;
  const csv = buildReportCsv(range);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `nexus-banking-intelligence-${range}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
