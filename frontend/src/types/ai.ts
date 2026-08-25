export type ChatRole = 'user' | 'assistant';
export type MessageStatus = 'complete' | 'loading' | 'error';
export type ReplySource = 'groq' | 'mock';

export interface AiAction {
  label: string;
  href: string;
}

export interface StructuredCustomerListItem {
  id?: string;
  name: string;
  metric: string;
  metricLabel: string;
  detail?: string;
}

export interface StructuredSummaryItem {
  label: string;
  value: string;
}

export interface StructuredReply {
  insight?: string;
  signals?: string[];
  recommendation?: string;
  confidence?: number;
  nextStep?: string;
  customerListTitle?: string;
  customerList?: StructuredCustomerListItem[];
  summary?: StructuredSummaryItem[];
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
  status: MessageStatus;
  structured?: StructuredReply;
  actions?: AiAction[];
  processingSteps?: string[];
  source?: ReplySource;
  failedPrompt?: string;
}

export interface SuggestedPrompt {
  id: string;
  label: string;
}

export interface PlatformSnapshot {
  totalCustomers: number;
  newCustomers: number;
  kycCompletion: number;
  digitalAdoption: number;
  atRiskCustomers: number;
  humanEscalations: number;
  topOpportunitySegment: string;
}

export interface AssistantCustomerContext {
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

export interface SendMessageInput {
  message: string;
  history: ChatMessage[];
  customer: AssistantCustomerContext | null;
}

export interface SendMessageResult {
  content: string;
  structured?: StructuredReply;
  actions?: AiAction[];
  source: ReplySource;
}
