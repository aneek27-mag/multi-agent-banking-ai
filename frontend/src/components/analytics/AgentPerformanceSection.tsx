import Link from 'next/link';
import { ArrowUpRight, Bot, FileCheck2, MessageSquareText, Shield, Sparkles, Target, UserCheck } from 'lucide-react';
import { AgentPerformance } from '../../types/analytics';

const ICONS: Record<string, typeof Bot> = { target: Target, 'file-check': FileCheck2, sparkles: Sparkles, message: MessageSquareText, shield: Shield, 'user-check': UserCheck };

export function AgentPerformanceSection({ agents }: { agents: AgentPerformance[] }) {
  return (
    <section className="dashboard-panel analytics-section" id="agent-performance">
      <div className="panel-heading">
        <div>
          <p>Agentic AI</p>
          <h2>Agent performance</h2>
        </div>
        <Link href="/agents">Open agent workflow <ArrowUpRight size={12} /></Link>
      </div>

      <div className="analytics-agent-grid">
        {agents.map((agent) => {
          const Icon = ICONS[agent.icon] ?? Bot;
          return (
            <div className="analytics-agent-card" key={agent.id}>
              <span className="analytics-agent-icon"><Icon size={15} /></span>
              <strong>{agent.name}</strong>
              <div className="analytics-agent-metrics">
                <span>Tasks<b>{agent.tasks}</b></span>
                {agent.successRate !== undefined && <span>Success<b>{agent.successRate}%</b></span>}
                {agent.avgConfidence !== undefined && <span>Avg confidence<b>{agent.avgConfidence}%</b></span>}
                {agent.escalations !== undefined && <span>Escalations<b>{agent.escalations}</b></span>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
