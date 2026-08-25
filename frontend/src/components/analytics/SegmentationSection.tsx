import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { SegmentShare } from '../../types/analytics';

export function SegmentationSection({ segments }: { segments: SegmentShare[] }) {
  return (
    <section className="dashboard-panel analytics-section" id="segmentation">
      <div className="panel-heading">
        <div>
          <p>Customer portfolio</p>
          <h2>Customer segmentation</h2>
        </div>
        <span className="panel-caption">Click a segment to view customers</span>
      </div>

      <div className="analytics-segment-layout">
        <div className="analytics-donut">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={segments} dataKey="pct" nameKey="label" innerRadius={58} outerRadius={86} paddingAngle={2}>
                {segments.map((segment) => <Cell key={segment.id} fill={segment.color} />)}
              </Pie>
              <Tooltip formatter={(value, name) => [`${Number(value)}%`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="analytics-segment-list">
          {segments.map((segment) => (
            <Link className="analytics-segment-row" href={`/customers?${segment.filterKey}=${encodeURIComponent(segment.filterValue)}`} key={segment.id}>
              <i style={{ background: segment.color }} />
              <span>{segment.label}</span>
              <strong>{segment.pct}%</strong>
              <ChevronRight size={14} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
