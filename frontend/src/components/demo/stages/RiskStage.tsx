import { ArrowRight, ShieldAlert } from 'lucide-react';
import { DEMO_RISK_CASE } from '../../../data/demoScript';

export function RiskStage({ onNext }: { onNext: () => void }) {
  return (
    <div className="demo-stage-body">
      <p className="demo-scenario-note">A separate, unusual transaction is introduced here as a contrasting scenario — this is not a change to Rahul&apos;s normal profile.</p>

      <section className="detail-panel">
        <div className="detail-heading"><div><p>Simulated transaction</p><h2>Transaction under review</h2></div></div>
        <div className="finance-metrics">
          <div className="metric-item"><span>Amount</span><strong>₹{DEMO_RISK_CASE.amount.toLocaleString('en-IN')}</strong></div>
          <div className="metric-item"><span>Time</span><strong>{DEMO_RISK_CASE.time}</strong></div>
          <div className="metric-item"><span>Location</span><strong>{DEMO_RISK_CASE.location}</strong></div>
          <div className="metric-item"><span>Typical transaction</span><strong>{DEMO_RISK_CASE.typicalRange}</strong></div>
          <div className="metric-item"><span>AI risk score</span><strong>{DEMO_RISK_CASE.aiRiskScore}/100</strong></div>
        </div>
      </section>

      <section className="risk-panel risk-high">
        <div className="risk-icon"><ShieldAlert size={20} /></div>
        <div>
          <p>Suspicious activity detected</p>
          <h2>Human review required</h2>
          <span>{DEMO_RISK_CASE.signals.join(' · ')}</span>
        </div>
      </section>

      <button type="button" className="primary-action demo-continue-button" onClick={onNext}>Send to Human Review<ArrowRight size={14} /></button>
    </div>
  );
}
