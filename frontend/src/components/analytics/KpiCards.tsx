import { Activity, ArrowDownRight, ArrowUpRight, FileCheck2, ShieldAlert, Smartphone, Sparkles, UserCheck, UserPlus, Users } from 'lucide-react';
import { ExecutiveKpi } from '../../types/analytics';

const ICONS: Record<string, typeof Users> = {
  users: Users,
  'user-plus': UserPlus,
  smartphone: Smartphone,
  'file-check': FileCheck2,
  activity: Activity,
  sparkles: Sparkles,
  'shield-alert': ShieldAlert,
  'user-check': UserCheck,
};

export function KpiCards({ kpis }: { kpis: ExecutiveKpi[] }) {
  return (
    <section className="analytics-kpi-grid" aria-label="Executive KPIs">
      {kpis.map((kpi) => {
        const Icon = ICONS[kpi.icon] ?? Activity;
        const TrendIcon = kpi.direction === 'up' ? ArrowUpRight : ArrowDownRight;
        return (
          <article className={`kpi-card ${kpi.tone !== 'default' ? kpi.tone : ''}`} key={kpi.id}>
            <span className="analytics-kpi-icon"><Icon size={13} /></span>
            <span>{kpi.label}</span>
            <strong>{kpi.value}</strong>
            <small className="positive-text"><TrendIcon size={12} />{kpi.changeLabel}</small>
            <em>{kpi.comparisonLabel}</em>
          </article>
        );
      })}
    </section>
  );
}
