import {
  AgentPerformance,
  AiInsight,
  AnomalyType,
  AutomationBenchmark,
  CrossModuleLink,
  DigitalAdoptionData,
  EngagementData,
  ExecutiveBriefContent,
  ExecutiveKpi,
  FunnelStage,
  ProductOpportunity,
  RiskSummary,
  SegmentShare,
  TimeRange,
} from '../types/analytics';

export const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: '6m', label: '6 Months' },
  { value: '1y', label: '1 Year' },
];

/** A demo-only multiplier so charts visibly respond to the time-range filter without a real backend. */
export const RANGE_SCALE: Record<TimeRange, number> = {
  today: 0.05,
  '7d': 0.22,
  '30d': 1,
  '90d': 2.85,
  '6m': 5.4,
  '1y': 10.6,
};

export const EXECUTIVE_KPIS: ExecutiveKpi[] = [
  { id: 'total-customers', label: 'Total customers', value: '24,820', changeLabel: '+4.8%', direction: 'up', comparisonLabel: 'vs previous month', icon: 'users', tone: 'default' },
  { id: 'new-customers', label: 'New customers', value: '+1,240', changeLabel: '+18.2%', direction: 'up', comparisonLabel: 'vs previous month', icon: 'user-plus', tone: 'lime' },
  { id: 'digital-adoption', label: 'Digital adoption', value: '72.4%', changeLabel: '+8.7%', direction: 'up', comparisonLabel: 'vs previous month', icon: 'smartphone', tone: 'blue' },
  { id: 'kyc-completion', label: 'KYC completion', value: '87.2%', changeLabel: '+2.4%', direction: 'up', comparisonLabel: 'vs previous month', icon: 'file-check', tone: 'default' },
  { id: 'customer-engagement', label: 'Customer engagement', value: '81.6%', changeLabel: '+5.2%', direction: 'up', comparisonLabel: 'vs previous month', icon: 'activity', tone: 'violet' },
  { id: 'ai-automation', label: 'AI automation', value: '91.4%', changeLabel: '+3.6%', direction: 'up', comparisonLabel: 'vs previous month', icon: 'sparkles', tone: 'violet' },
  { id: 'risk-alerts', label: 'Risk alerts', value: '42', changeLabel: '-3.1%', direction: 'down', comparisonLabel: 'vs previous month', icon: 'shield-alert', tone: 'amber' },
  { id: 'human-escalations', label: 'Human escalations', value: '37', changeLabel: '-6.4%', direction: 'down', comparisonLabel: 'vs previous month', icon: 'user-check', tone: 'red' },
];

export const ACQUISITION_FUNNEL: FunnelStage[] = [
  { label: 'Website Visitors', value: 12480 },
  { label: 'Applications Started', value: 3842 },
  { label: 'Documents Uploaded', value: 2914 },
  { label: 'KYC Completed', value: 2481 },
  { label: 'Accounts Created', value: 2210 },
];

export const ACQUISITION_STATS = {
  applicationCompletionRate: 57.5,
  kycDropOffPct: 14.9,
  avgOnboardingTime: '2m 14s',
  aiAssistedConversionLift: 18.4,
};

export const DIGITAL_ADOPTION: DigitalAdoptionData = {
  score: 72.4,
  trend: [
    { month: 'Mar', value: 61 },
    { month: 'Apr', value: 64 },
    { month: 'May', value: 66 },
    { month: 'Jun', value: 69 },
    { month: 'Jul', value: 71 },
    { month: 'Aug', value: 72.4 },
  ],
  channelUsage: [
    { channel: 'Mobile banking', value: 86 },
    { channel: 'UPI', value: 92 },
    { channel: 'Net banking', value: 58 },
    { channel: 'Card usage', value: 74 },
  ],
  featureAdoption: [
    { feature: 'Bill payments', value: 81 },
    { feature: 'Fund transfers', value: 88 },
    { feature: 'Statements', value: 64 },
    { feature: 'Investments', value: 41 },
    { feature: 'Support chat', value: 55 },
  ],
  monthlyActiveCustomers: [
    { month: 'Mar', value: 15840 },
    { month: 'Apr', value: 16920 },
    { month: 'May', value: 17510 },
    { month: 'Jun', value: 18240 },
    { month: 'Jul', value: 18990 },
    { month: 'Aug', value: 19680 },
  ],
};

export const SEGMENTS: SegmentShare[] = [
  { id: 'young-digital', label: 'Young Digital Users', pct: 32, color: '#328e72', filterKey: 'segment', filterValue: 'Young Digital User' },
  { id: 'high-value', label: 'High Value', pct: 18, color: '#9279b8', filterKey: 'segment', filterValue: 'High Value Customer' },
  { id: 'emerging-affluent', label: 'Emerging Affluent', pct: 21, color: '#5a9bb7', filterKey: 'segment', filterValue: 'Emerging Affluent' },
  { id: 'traditional', label: 'Traditional Banking', pct: 17, color: '#dda04a', filterKey: 'segment', filterValue: 'Traditional Banking User' },
  { id: 'at-risk', label: 'At Risk', pct: 12, color: '#cb6269', filterKey: 'segment', filterValue: 'At Risk' },
];

export const PRODUCT_OPPORTUNITIES: ProductOpportunity[] = [
  { product: 'Premium Credit Card', potentialCustomers: 1842, avgConfidence: 91, conversionPotential: 34, segment: 'Emerging Affluent' },
  { product: 'FD / Savings', potentialCustomers: 1482, avgConfidence: 84, conversionPotential: 41, segment: 'Traditional Banking' },
  { product: 'Investment Products', potentialCustomers: 1284, avgConfidence: 79, conversionPotential: 27, segment: 'High Value' },
  { product: 'Travel Card', potentialCustomers: 942, avgConfidence: 82, conversionPotential: 29, segment: 'Young Digital Users' },
  { product: 'Personal Loan', potentialCustomers: 721, avgConfidence: 74, conversionPotential: 22, segment: 'Credit Seeker' },
];

export const ENGAGEMENT: EngagementData = {
  average: 81.6,
  breakdown: [
    { label: 'Highly engaged', pct: 58, tone: 'green' },
    { label: 'Stable', pct: 29, tone: 'blue' },
    { label: 'Declining', pct: 11, tone: 'amber' },
    { label: 'Dormant', pct: 2, tone: 'red' },
  ],
  trend: [
    { month: 'Mar', value: 74.1 },
    { month: 'Apr', value: 76.4 },
    { month: 'May', value: 77.9 },
    { month: 'Jun', value: 79.2 },
    { month: 'Jul', value: 80.5 },
    { month: 'Aug', value: 81.6 },
  ],
  reEngagement: { targeted: 426, messagesGenerated: 401, messagesOpened: 312, engagementImproved: 248, avgImprovementPoints: 16 },
};

export const RISK_SUMMARY: RiskSummary = {
  totalAlerts: 42,
  high: 8,
  medium: 21,
  low: 13,
  escalated: 6,
  resolved: 18,
  trend: [
    { month: 'Mar', value: 51 },
    { month: 'Apr', value: 47 },
    { month: 'May', value: 45 },
    { month: 'Jun', value: 44 },
    { month: 'Jul', value: 43 },
    { month: 'Aug', value: 42 },
  ],
};

export const ANOMALY_TYPES: AnomalyType[] = [
  { label: 'Unusual transaction amount', pct: 38, filterValue: 'amount' },
  { label: 'New location', pct: 27, filterValue: 'location' },
  { label: 'Unusual transaction time', pct: 19, filterValue: 'time' },
  { label: 'Merchant anomaly', pct: 16, filterValue: 'merchant' },
];

export const AGENT_PERFORMANCE: AgentPerformance[] = [
  { id: 'acquisition', name: 'Customer Acquisition Agent', tasks: 284, successRate: 96.8, avgConfidence: 93, icon: 'target' },
  { id: 'kyc', name: 'KYC Agent', tasks: 642, successRate: 98.1, avgConfidence: 96, icon: 'file-check' },
  { id: 'recommendation', name: 'Recommendation Agent', tasks: 328, successRate: 97.2, avgConfidence: 91, icon: 'sparkles' },
  { id: 'engagement', name: 'Engagement Agent', tasks: 412, successRate: 95.8, avgConfidence: 89, icon: 'message' },
  { id: 'risk', name: 'Risk Agent', tasks: 842, successRate: 94.4, avgConfidence: 93, icon: 'shield' },
  { id: 'human', name: 'Human Escalation Agent', tasks: 37, escalations: 37, icon: 'user-check' },
];

export const AUTOMATION_BENCHMARKS: AutomationBenchmark[] = [
  { process: 'KYC Processing', manual: '18 min', ai: '2.4 min', improvementPct: 86.7 },
  { process: 'Customer Recommendation', manual: '12 min', ai: '3 sec', improvementPct: 99.6 },
  { process: 'Engagement Campaign Creation', manual: '45 min', ai: '30 sec', improvementPct: 98.9 },
  { process: 'Risk Screening', manual: '8 min', ai: '2 sec', improvementPct: 99.6 },
];

export const EXECUTIVE_BRIEF: ExecutiveBriefContent = {
  summary: 'Customer acquisition is trending positively, with onboarding completion increasing 8.7% this period. Digital engagement remains strong, but 426 customers show declining activity. AI identified 1,842 customers with potential premium credit product interest. 42 transaction anomalies were detected, with 6 cases requiring human review.',
  opportunities: [
    'Re-engage declining digital users',
    'Target high-value customers with relevant products',
    'Reduce onboarding document drop-off',
    'Review high-risk transaction anomalies',
  ],
};

export const AI_INSIGHTS: AiInsight[] = [
  { id: 'insight-1', title: 'Customers aged 21-30 show the highest digital banking adoption.', impact: 'High', confidence: 92, module: 'Digital Adoption', actionLabel: 'View Customers', actionHref: '/customers' },
  { id: 'insight-2', title: 'KYC document upload is the largest onboarding drop-off point.', impact: 'High', confidence: 88, module: 'Onboarding', actionLabel: 'Review Onboarding', actionHref: '/onboarding' },
  { id: 'insight-3', title: 'Travel-related spending is strongly correlated with premium card opportunity.', impact: 'Medium', confidence: 85, module: 'Product Opportunity', actionLabel: 'View Customers', actionHref: '/customers' },
  { id: 'insight-4', title: 'Customers with declining app usage have a higher probability of becoming dormant.', impact: 'Medium', confidence: 81, module: 'Engagement', actionLabel: 'Re-engage Customers', actionHref: '/engagement' },
];

export const CROSS_MODULE_LINKS: CrossModuleLink[] = [
  { label: 'View 426 declining customers', description: 'Customers', href: '/customers', icon: 'users' },
  { label: 'Review 42 alerts', description: 'Risk', href: '/risk', icon: 'shield-alert' },
  { label: 'Re-engage 426 customers', description: 'Engagement', href: '/engagement', icon: 'message' },
  { label: 'View 1,284 AI actions', description: 'Agents', href: '/agents', icon: 'network' },
  { label: 'Review 17 KYC cases', description: 'Onboarding', href: '/onboarding', icon: 'file-check' },
  { label: 'Ask AI about this report', description: 'AI Assistant', href: '/assistant', icon: 'bot' },
];
