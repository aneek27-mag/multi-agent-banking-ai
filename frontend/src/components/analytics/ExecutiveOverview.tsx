import Link from 'next/link';
import { Activity, ArrowUpRight, Bot, ChevronRight, ShieldAlert, Smartphone, Sparkles, TrendingUp } from 'lucide-react';
import { AI_INSIGHTS } from '../../data/analytics';

const OVERVIEW_STATS = [
  { label: 'Customer growth', value: '+12.4%', icon: TrendingUp },
  { label: 'Digital adoption', value: '+8.7%', icon: Smartphone },
  { label: 'Engagement', value: '+5.2%', icon: Activity },
  { label: 'Risk alerts', value: '-3.1%', icon: ShieldAlert },
  { label: 'AI automation', value: '91.4%', icon: Bot },
];

export function ExecutiveOverview() {
  const topInsights = AI_INSIGHTS.slice(0, 3);

  return (
    <section className="dashboard-panel analytics-overview-panel">
      <div className="panel-heading">
        <div>
          <p>AI executive overview</p>
          <h2>Where the bank stands today</h2>
        </div>
        <Link href="/analytics" className="primary-action">View Banking Intelligence <ArrowUpRight size={14} /></Link>
      </div>

      <div className="agent-stat-grid analytics-overview-stats">
        {OVERVIEW_STATS.map((stat) => (
          <article className="agent-stat" key={stat.label}>
            <span className="agent-stat-icon"><stat.icon size={16} /></span>
            <div><span>{stat.label}</span><strong>{stat.value}</strong></div>
          </article>
        ))}
      </div>

      <div className="attention-list analytics-overview-insights">
        {topInsights.map((insight) => (
          <Link href={insight.actionHref} key={insight.id}>
            <span className="attention-mark blue"><Sparkles size={15} /></span>
            <p><strong>{insight.title}</strong><small>{insight.module} · {insight.confidence}% confidence</small></p>
            <ChevronRight size={15} />
          </Link>
        ))}
      </div>
    </section>
  );
}
