const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface SystemStatus {
  health_score: number;
  status: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL';
  active_agents: number;
}

export interface MetricData {
  title: string;
  value: string;
  insight: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: string;
  amount: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
}

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export const NexusAPI = {
  // Fetch system health
  async getSystemStatus(): Promise<SystemStatus> {
    const response = await fetch(`${API_BASE_URL}/status`);
    if (!response.ok) throw new Error('Failed to fetch system status');
    return response.json();
  },

  // Fetch financial insights
  async getInsights(): Promise<MetricData[]> {
    const response = await fetch(`${API_BASE_URL}/insights`);
    if (!response.ok) throw new Error('Failed to fetch insights');
    return response.json();
  },
  
  // Trigger an orchestration protocol
  async executeProtocol(command: string): Promise<void> {
    await fetch(`${API_BASE_URL}/orchestrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command })
    });
  },

  // Fetch transaction history
  async getTransactions(): Promise<Transaction[]> {
    const response = await fetch(`${API_BASE_URL}/transactions`);
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return response.json();
  },

  // Send a message to the AI Chatbot
  async sendMessage(message: string): Promise<{ reply: string }> {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    if (!response.ok) throw new Error('Failed to send message to AI');
    return response.json();
  }
};