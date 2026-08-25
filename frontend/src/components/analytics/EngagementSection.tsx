import Link from 'next/link';
import { ArrowUpRight, MessageSquareText } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { EngagementData } from '../../types/analytics';

export function EngagementSection({ data }: { data: EngagementData }) {
  return (
    <section className="dashboard-panel analytics-section" id="engagement">
      <div className="panel-heading">
        <div>
          <p>Customer engagement</p>
          <h2>Average engagement {data.average}%</h2>
        </div>
        <Link href="/engagement">Open engagement <ArrowUpRight size={12} /></Link>
      </div>

      <div className="analytics-engagement-breakdown">
        {data.breakdown.map((item) => (
          <div className="analytics-engagement-item" key={item.label}>
            <span className={`segment-dot ${item.tone}`} />
            <span>{item.label}</span>
            <strong>{item.pct}%</strong>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data.trend} barGap={4}>
          <CartesianGrid vertical={false} stroke="#edf0f4" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8b96a6', fontSize: 10 }} />
          <YAxis hide domain={[70, 85]} />
          <Tooltip formatter={(value) => `${value}%`} cursor={{ fill: '#f5f8fa' }} />
          <Bar dataKey="value" fill="#9279b8" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="analytics-callout">
        <div className="analytics-callout-icon"><MessageSquareText size={16} /></div>
        <div>
          <p>AI re-engagement impact <small>(simulated demo metrics)</small></p>
          <div className="analytics-callout-grid">
            <div><strong>{data.reEngagement.targeted}</strong><span>Customers targeted</span></div>
            <div><strong>{data.reEngagement.messagesGenerated}</strong><span>Messages generated</span></div>
            <div><strong>{data.reEngagement.messagesOpened}</strong><span>Messages opened</span></div>
            <div><strong>{data.reEngagement.engagementImproved}</strong><span>Engagement improved</span></div>
            <div><strong>+{data.reEngagement.avgImprovementPoints}</strong><span>Avg. improvement</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
