import { AgentActivity, Customer } from '../types/banking';

export const customers: Customer[] = [
  { id: 'CUS-20481', name: 'Rahul Sharma', initials: 'RS', segment: 'Emerging affluent', accountType: 'Savings + Salary', balance: 842500, adoption: 84, risk: 'Low', kyc: 'Needs attention', recommendation: 'Premium credit card', lastActive: '12 min ago' },
  { id: 'CUS-20477', name: 'Ananya Iyer', initials: 'AI', segment: 'High value', accountType: 'Private banking', balance: 4250000, adoption: 96, risk: 'Low', kyc: 'Verified', recommendation: 'Wealth advisory', lastActive: '26 min ago' },
  { id: 'CUS-20462', name: 'Vikram Malhotra', initials: 'VM', segment: 'Mass affluent', accountType: 'Savings + Investments', balance: 1278400, adoption: 72, risk: 'Medium', kyc: 'Verified', recommendation: 'Term deposit', lastActive: '1 hr ago' },
  { id: 'CUS-20455', name: 'Meera Nair', initials: 'MN', segment: 'New to bank', accountType: 'Digital savings', balance: 184200, adoption: 61, risk: 'Low', kyc: 'In review', recommendation: 'Recurring deposit', lastActive: '3 hrs ago' },
  { id: 'CUS-20439', name: 'Arjun Kapoor', initials: 'AK', segment: 'At risk', accountType: 'Savings + Credit', balance: 294800, adoption: 38, risk: 'High', kyc: 'Verified', recommendation: 'Engagement outreach', lastActive: '2 days ago' },
];

export const agentActivity: AgentActivity[] = [
  { agent: 'Recommendation Agent', action: 'Prepared a tailored offer', customer: 'Rahul Sharma', time: '2 min ago', status: 'Completed' },
  { agent: 'KYC Agent', action: 'Flagged address mismatch', customer: 'Meera Nair', time: '8 min ago', status: 'Escalated' },
  { agent: 'Engagement Agent', action: 'Started reactivation journey', customer: 'Arjun Kapoor', time: '14 min ago', status: 'In progress' },
  { agent: 'Acquisition Agent', action: 'Scored 24 new leads', customer: 'Digital campaign', time: '31 min ago', status: 'Completed' },
];

export const kpis = [
  { label: 'Total customers', value: '248,392', delta: '+4.8%', tone: 'green' },
  { label: 'New customers', value: '1,284', delta: '+18.2%', tone: 'lime' },
  { label: 'KYC completion', value: '91.6%', delta: '+2.4%', tone: 'blue' },
  { label: 'Digital adoption', value: '76.4%', delta: '+6.7%', tone: 'violet' },
  { label: 'Engagement score', value: '82.1', delta: '+3.1%', tone: 'amber' },
  { label: 'At-risk customers', value: '1,842', delta: '-8.4%', tone: 'red' },
];
