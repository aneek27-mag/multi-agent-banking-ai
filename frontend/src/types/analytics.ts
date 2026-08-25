export type TimeRange = 'today' | '7d' | '30d' | '90d' | '6m' | '1y';

export type TrendDirection = 'up' | 'down';

export interface ExecutiveKpi {
  id: string;
  label: string;
  value: string;
  changeLabel: string;
  direction: TrendDirection;
  comparisonLabel: string;
  icon: string;
  tone: 'lime' | 'blue' | 'violet' | 'amber' | 'red' | 'default';
}

export interface FunnelStage {
  label: string;
  value: number;
}

export interface AcquisitionStats {
  funnel: FunnelStage[];
  applicationCompletionRate: number;
  kycDropOffPct: number;
  avgOnboardingTime: string;
  aiAssistedConversionLift: number;
}

export interface MonthPoint {
  month: string;
  value: number;
}

export interface DigitalAdoptionData {
  score: number;
  trend: MonthPoint[];
  channelUsage: { channel: string; value: number }[];
  featureAdoption: { feature: string; value: number }[];
  monthlyActiveCustomers: MonthPoint[];
}

export interface SegmentShare {
  id: string;
  label: string;
  pct: number;
  color: string;
  filterKey: string;
  filterValue: string;
}

export interface ProductOpportunity {
  product: string;
  potentialCustomers: number;
  avgConfidence: number;
  conversionPotential: number;
  segment: string;
}

export interface EngagementBreakdown {
  label: string;
  pct: number;
  tone: 'green' | 'blue' | 'amber' | 'red';
}

export interface ReEngagementImpact {
  targeted: number;
  messagesGenerated: number;
  messagesOpened: number;
  engagementImproved: number;
  avgImprovementPoints: number;
}

export interface EngagementData {
  average: number;
  breakdown: EngagementBreakdown[];
  trend: MonthPoint[];
  reEngagement: ReEngagementImpact;
}

export interface RiskSummary {
  totalAlerts: number;
  high: number;
  medium: number;
  low: number;
  escalated: number;
  resolved: number;
  trend: MonthPoint[];
}

export interface AnomalyType {
  label: string;
  pct: number;
  filterValue: string;
}

export interface AgentPerformance {
  id: string;
  name: string;
  tasks: number;
  successRate?: number;
  avgConfidence?: number;
  escalations?: number;
  icon: string;
}

export interface AutomationBenchmark {
  process: string;
  manual: string;
  ai: string;
  improvementPct: number;
}

export interface AiInsight {
  id: string;
  title: string;
  impact: 'High' | 'Medium' | 'Low';
  confidence: number;
  module: string;
  actionLabel: string;
  actionHref: string;
}

export interface ExecutiveBriefContent {
  summary: string;
  opportunities: string[];
}

export interface CrossModuleLink {
  label: string;
  description: string;
  href: string;
  icon: string;
}
