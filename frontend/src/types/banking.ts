export type KycStatus = 'Verified' | 'In review' | 'Needs attention';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type AgentStatus = 'Working' | 'Ready' | 'Review';

export interface Customer {
  id: string;
  name: string;
  initials: string;
  segment: string;
  accountType: string;
  balance: number;
  adoption: number;
  risk: RiskLevel;
  kyc: KycStatus;
  recommendation: string;
  lastActive: string;
}

export interface AgentActivity {
  agent: string;
  action: string;
  customer: string;
  time: string;
  status: 'Completed' | 'In progress' | 'Escalated';
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}
