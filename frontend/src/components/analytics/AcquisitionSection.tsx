import { Sparkles } from 'lucide-react';
import { FunnelStage } from '../../types/analytics';

interface AcquisitionProps {
  funnel: FunnelStage[];
  applicationCompletionRate: number;
  kycDropOffPct: number;
  avgOnboardingTime: string;
  aiAssistedConversionLift: number;
}

export function AcquisitionSection({ funnel, applicationCompletionRate, kycDropOffPct, avgOnboardingTime, aiAssistedConversionLift }: AcquisitionProps) {
  const max = funnel[0]?.value ?? 1;

  return (
    <section className="dashboard-panel analytics-section" id="acquisition">
      <div className="panel-heading">
        <div>
          <p>Customer acquisition</p>
          <h2>Acquisition funnel</h2>
        </div>
        <span className="panel-caption">Simulated demo data</span>
      </div>

      <div className="onb-funnel">
        {funnel.map((stage, index) => {
          const widthPct = Math.max(18, Math.round((stage.value / max) * 100));
          const previous = funnel[index - 1];
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

      <div className="analytics-stat-row">
        <div><span>Application completion rate</span><strong>{applicationCompletionRate}%</strong></div>
        <div><span>KYC drop-off</span><strong>{kycDropOffPct}%</strong></div>
        <div><span>Avg. onboarding time</span><strong>{avgOnboardingTime}</strong></div>
        <div className="analytics-stat-highlight"><span><Sparkles size={12} />AI-assisted conversion</span><strong>+{aiAssistedConversionLift}%</strong></div>
      </div>
    </section>
  );
}
