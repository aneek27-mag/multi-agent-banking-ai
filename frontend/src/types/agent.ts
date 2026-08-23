export type AgentState = 'ONLINE' | 'PROCESSING' | 'WAITING' | 'ESCALATED';
export type TaskState = 'Completed' | 'In progress' | 'Escalated';

export interface AgentRecord {
  id: string;
  name: string;
  purpose: string;
  icon: string;
  status: AgentState;
  currentTask: string;
  tasksToday: number;
  successRate: number;
  confidence: number;
  lastActivity: string;
  capabilities: string[];
}

export interface AgentActivityRecord {
  id: string;
  time: string;
  agent: string;
  customer: string;
  task: string;
  result: string;
  confidence: number;
  duration: string;
  status: TaskState;
}

export interface EscalationCase {
  id: string;
  title: string;
  customer: string;
  issue: string;
  confidence: number;
  status: 'Awaiting review' | 'Approved' | 'Rejected' | 'More information requested';
}
