import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AnomalyType, RiskSummary } from '../../types/analytics';

export function RiskSection({ risk, anomalies }: { risk: RiskSummary; anomalies: AnomalyType[] }) {
  return (
    <section className="dashboard-panel analytics-section" id="risk">
      <div className="panel-heading">
        <div>
          <p>Risk intelligence</p>
          <h2>{risk.totalAlerts} total alerts</h2>
        </div>
        <Link href="/risk">Open risk & fraud <ArrowUpRight size={12} /></Link>
      </div>

      <div className="analytics-stat-row">
        <div><span>High risk</span><strong className="analytics-stat-red">{risk.high}</strong></div>
        <div><span>Medium risk</span><strong>{risk.medium}</strong></div>
        <div><span>Low risk</span><strong>{risk.low}</strong></div>
        <div><span>Escalated</span><strong>{risk.escalated}</strong></div>
        <div><span>Resolved</span><strong className="positive-text">{risk.resolved}</strong></div>
      </div>

      <ResponsiveContainer width="100%" height={130}>
        <BarChart data={risk.trend} barGap={4}>
          <CartesianGrid vertical={false} stroke="#edf0f4" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8b96a6', fontSize: 10 }} />
          <YAxis hide />
          <Tooltip cursor={{ fill: '#f5f8fa' }} />
          <Bar dataKey="value" fill="#ba3f47" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="detail-heading analytics-subheading"><div><p>Top anomaly types</p></div></div>
      <div className="analytics-anomaly-list">
        {anomalies.map((anomaly) => (
          <Link className="analytics-anomaly-row" href={`/risk?type=${anomaly.filterValue}`} key={anomaly.label}>
            <span>{anomaly.label}</span>
            <div className="table-progress"><i style={{ width: `${anomaly.pct}%` }} /></div>
            <strong>{anomaly.pct}%</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}
