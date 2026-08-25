import Link from 'next/link';
import { ArrowRight, Check, RotateCcw, Sparkles } from 'lucide-react';
import { EXECUTIVE_BRIEF, EXECUTIVE_KPIS } from '../../../data/analytics';
import { KpiCards } from '../../analytics/KpiCards';

const KPI_IDS = ['new-customers', 'kyc-completion', 'digital-adoption', 'ai-automation', 'customer-engagement', 'risk-alerts'];
const LIFECYCLE = ['Acquire', 'Onboard', 'Understand', 'Recommend', 'Engage', 'Monitor', 'Escalate', 'Optimize'];

export function ExecutiveStage({ onRestart }: { onRestart: () => void }) {
  const kpis = KPI_IDS.map((id) => EXECUTIVE_KPIS.find((kpi) => kpi.id === id)).filter((kpi): kpi is (typeof EXECUTIVE_KPIS)[number] => Boolean(kpi));

  return (
    <div className="demo-stage-body">
      <KpiCards kpis={kpis} />

      <section className="insight-panel">
        <div className="insight-title"><Sparkles size={17} /><h2>AI Executive Brief</h2></div>
        <p>{EXECUTIVE_BRIEF.summary}</p>
        <strong>Key opportunities</strong>
        <ul className="analytics-opportunity-arrows">
          {EXECUTIVE_BRIEF.opportunities.map((item) => <li key={item}><ArrowRight size={13} />{item}</li>)}
        </ul>
      </section>

      <section className="dashboard-panel demo-summary-panel">
        <div className="panel-heading"><div><p>Demo summary</p><h2>The complete customer lifecycle</h2></div></div>
        <div className="demo-lifecycle-grid">
          {LIFECYCLE.map((stage) => (
            <div className="demo-lifecycle-item" key={stage}>
              <span className="demo-lifecycle-check"><Check size={12} /></span>
              {stage}
            </div>
          ))}
        </div>
        <p className="demo-summary-tagline">One intelligent platform. One connected customer lifecycle.</p>
        <div className="demo-controls-group">
          <button type="button" className="outline-action" onClick={onRestart}><RotateCcw size={14} />Restart Demo</button>
          <Link href="/" className="primary-action">Exit Demo</Link>
        </div>
      </section>
    </div>
  );
}
