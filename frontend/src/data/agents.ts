import { AgentActivityRecord, AgentRecord, EscalationCase } from '../types/agent';

export const agentRecords: AgentRecord[] = [
  { id: 'acquisition', name: 'Customer Acquisition Agent', purpose: 'Finds high-intent prospects and prioritizes the next conversation.', icon: 'target', status: 'ONLINE', currentTask: 'Scoring 24 campaign leads', tasksToday: 168, successRate: 94.8, confidence: 92, lastActivity: '2 min ago', capabilities: ['Score acquisition intent', 'Prioritize prospects', 'Match campaign offers', 'Explain opportunity signals'] },
  { id: 'kyc', name: 'KYC Verification Agent', purpose: 'Checks onboarding documents and routes uncertain cases to a human.', icon: 'file-check', status: 'PROCESSING', currentTask: 'Reviewing 17 document cases', tasksToday: 212, successRate: 98.1, confidence: 96, lastActivity: '34 sec ago', capabilities: ['Extract document fields', 'Compare identity signals', 'Detect mismatches', 'Request human review'] },
  { id: 'intelligence', name: 'Customer Intelligence Agent', purpose: 'Builds a living view of customer behavior, needs, and intent.', icon: 'brain', status: 'ONLINE', currentTask: 'Updating 1,842 customer profiles', tasksToday: 486, successRate: 96.4, confidence: 94, lastActivity: '1 min ago', capabilities: ['Analyze transactions', 'Score digital adoption', 'Identify segments', 'Surface behavior shifts'] },
  { id: 'recommendation', name: 'Recommendation Agent', purpose: 'Matches customer behavior to potentially relevant banking products.', icon: 'sparkles', status: 'PROCESSING', currentTask: 'Analyzing customer CUS-20481', tasksToday: 328, successRate: 97.2, confidence: 94, lastActivity: '12 sec ago', capabilities: ['Compare product catalog', 'Generate recommendations', 'Explain relevance', 'Prepare personalized offers'] },
  { id: 'assistant', name: 'Financial Assistant Agent', purpose: 'Answers employee questions using the bank intelligence context.', icon: 'bot', status: 'ONLINE', currentTask: 'Waiting for a banking query', tasksToday: 74, successRate: 95.6, confidence: 91, lastActivity: '4 min ago', capabilities: ['Answer portfolio questions', 'Summarize activity', 'Find customer cohorts', 'Draft next actions'] },
  { id: 'engagement', name: 'Engagement Agent', purpose: 'Creates timely, permission-aware journeys for customer adoption.', icon: 'message', status: 'WAITING', currentTask: 'Waiting for approved outreach', tasksToday: 96, successRate: 92.7, confidence: 89, lastActivity: '6 min ago', capabilities: ['Detect engagement decline', 'Draft messages', 'Schedule journeys', 'Measure response'] },
  { id: 'risk', name: 'Risk & Fraud Agent', purpose: 'Screens behavioral signals and protects sensitive decisions with guardrails.', icon: 'shield', status: 'ONLINE', currentTask: 'Monitoring transaction anomalies', tasksToday: 547, successRate: 99.1, confidence: 97, lastActivity: '8 sec ago', capabilities: ['Check transaction patterns', 'Flag anomalies', 'Set risk context', 'Escalate sensitive cases'] },
  { id: 'human', name: 'Human Escalation Agent', purpose: 'Coordinates human review when confidence or policy requires it.', icon: 'user-check', status: 'ESCALATED', currentTask: 'Routing 3 cases to relationship managers', tasksToday: 37, successRate: 100, confidence: 100, lastActivity: '3 min ago', capabilities: ['Route sensitive cases', 'Collect reviewer decisions', 'Track approvals', 'Log audit events'] },
];

export const initialAgentActivity: AgentActivityRecord[] = [
  { id: 'activity-1', time: '02:14:32', agent: 'Recommendation Agent', customer: 'CUS-20481 · Rahul Sharma', task: 'Analyzed customer profile', result: 'Premium Credit Card identified', confidence: 93, duration: '1.8s', status: 'Completed' },
  { id: 'activity-2', time: '02:14:29', agent: 'Customer Intelligence Agent', customer: 'CUS-20481 · Rahul Sharma', task: 'Updated customer profile', result: 'Digital engagement at 91', confidence: 96, duration: '1.2s', status: 'Completed' },
  { id: 'activity-3', time: '02:14:21', agent: 'Risk & Fraud Agent', customer: 'CUS-20462 · Vikram Malhotra', task: 'Completed anomaly check', result: 'Medium risk context retained', confidence: 88, duration: '2.4s', status: 'Escalated' },
  { id: 'activity-4', time: '02:13:58', agent: 'KYC Verification Agent', customer: 'CUS-20455 · Meera Nair', task: 'Verified submitted PAN', result: 'PAN verification successful', confidence: 98, duration: '1.1s', status: 'Completed' },
];

export const initialEscalations: EscalationCase[] = [
  { id: 'ESC-081', title: 'KYC name mismatch', customer: 'Aarav Mehta · CUS-20388', issue: 'Name differs between submitted identity documents.', confidence: 72, status: 'Awaiting review' },
  { id: 'ESC-079', title: 'Suspicious transaction', customer: 'Arjun Kapoor · CUS-20439', issue: '₹95,000 transaction from a new location at an unusual time.', confidence: 82, status: 'Awaiting review' },
  { id: 'ESC-076', title: 'Low-confidence recommendation', customer: 'Kavya Reddy · CUS-20414', issue: 'Product fit is ambiguous due to limited digital activity.', confidence: 64, status: 'Awaiting review' },
];

export const workflowSteps = ['Customer event', 'Intent detection', 'Customer intelligence', 'Recommendation', 'Risk check', 'Decision', 'Action'];
