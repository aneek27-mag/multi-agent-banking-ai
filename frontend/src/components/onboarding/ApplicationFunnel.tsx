import { Lightbulb } from 'lucide-react';
import { DropOffInsight, FunnelStage } from '../../types/onboarding';

export function ApplicationFunnel({ stages, dropOff }: { stages: FunnelStage[]; dropOff: DropOffInsight }) {
  const max = stages[0]?.value ?? 1;

  return (
    <section className="dashboard-panel onb-funnel-panel">
      <div className="panel-heading">
        <div>
          <p>Customer acquisition</p>
          <h2>Application funnel</h2>
        </div>
      </div>
      <div className="onb-funnel">
        {stages.map((stage, index) => {
          const widthPct = Math.max(18, Math.round((stage.value / max) * 100));
          const previous = stages[index - 1];
          const conversion = previous ? Math.round((stage.value / previous.value) * 1000) / 10 : null;
          return (
            <div className="onb-funnel-row" key={stage.label}>
              {conversion !== null && <span className="onb-funnel-conversion">{conversion}% converted</span>}
              <div className="onb-funnel-bar-track">
                <div className="onb-funnel-bar" style={{ width: `${widthPct}%` }}>
                  <span>{stage.label}</span>
                  <strong>{stage.value.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="intelligence-strip onb-dropoff">
        <div className="intelligence-icon"><Lightbulb size={19} /></div>
        <div className="intelligence-copy">
          <p>AI insight</p>
          <h2>AI detected the largest drop-off during {dropOff.stage.toLowerCase()}.</h2>
          <span>{dropOff.stage} drop-off is {dropOff.dropOffPct}% — likely causes: {dropOff.reasons.join(', ')}.</span>
        </div>
        <div className="onb-dropoff-recommendation">
          <span>AI recommendation</span>
          <strong>{dropOff.recommendation}</strong>
        </div>
      </div>
    </section>
  );
}
