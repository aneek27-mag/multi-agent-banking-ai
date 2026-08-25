import Link from 'next/link';
import { ChevronRight, Lightbulb } from 'lucide-react';
import { AiInsight } from '../../types/analytics';

export function InsightsFeed({ insights }: { insights: AiInsight[] }) {
  return (
    <section className="dashboard-panel analytics-section" id="insights">
      <div className="panel-heading">
        <div>
          <p>AI-generated insights</p>
          <h2>What the data is telling us</h2>
        </div>
      </div>

      <div className="recommendation-grid analytics-insight-grid">
        {insights.map((insight, index) => (
          <div className="recommendation-card analytics-insight-card" key={insight.id}>
            <div><Lightbulb size={15} /><strong>Insight {String(index + 1).padStart(2, '0')}</strong></div>
            <span className={`risk-pill ${insight.impact.toLowerCase()}`}>{insight.impact} impact</span>
            <p>{insight.title}</p>
            <small>Confidence {insight.confidence}% · {insight.module}</small>
            <Link href={insight.actionHref}>{insight.actionLabel}<ChevronRight size={13} /></Link>
          </div>
        ))}
      </div>
    </section>
  );
}
