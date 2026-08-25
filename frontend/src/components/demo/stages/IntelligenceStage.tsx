import { ArrowRight, Lightbulb } from 'lucide-react';
import { DEMO_CUSTOMER, DEMO_FINANCIALS } from '../../../data/demoScript';

const formatINR = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export function IntelligenceStage({ onNext }: { onNext: () => void }) {
  const customer = DEMO_CUSTOMER;

  return (
    <div className="demo-stage-body">
      <section className="health-grid">
        <ScoreCard label="Customer health" score={customer.healthScore} tone="teal" />
        <ScoreCard label="Digital engagement" score={customer.engagement} tone="blue" />
        <ScoreCard label="Risk" score={customer.riskScore} tone="amber" inverse />
        <ScoreCard label="AI opportunity" score={customer.opportunityScore} tone="violet" />
      </section>

      <section className="detail-panel">
        <div className="detail-heading"><div><p>Behavioral signals</p><h2>Financial signals</h2></div></div>
        <div className="finance-metrics">
          <div className="metric-item"><span>Monthly income</span><strong>{formatINR(customer.monthlyIncome)}</strong></div>
          <div className="metric-item"><span>Monthly spending</span><strong>{formatINR(DEMO_FINANCIALS.monthlySpending)}</strong></div>
          <div className="metric-item"><span>Average balance</span><strong>{formatINR(customer.balance)}</strong></div>
          <div className="metric-item"><span>Travel spending</span><strong>{formatINR(DEMO_FINANCIALS.travelSpending)}</strong></div>
          <div className="metric-item"><span>Digital transactions</span><strong>{DEMO_FINANCIALS.digitalTransactionsPerMonth}/month</strong></div>
        </div>
      </section>

      <section className="insight-panel">
        <div className="insight-title"><Lightbulb size={17} /><h2>AI insight</h2></div>
        <p>Strong digital engagement, healthy savings behavior and significant travel-related spending indicate potential interest in premium travel-focused banking products.</p>
        <button type="button" className="primary-action demo-continue-button" onClick={onNext}>Find Next Best Action<ArrowRight size={14} /></button>
      </section>
    </div>
  );
}

function ScoreCard({ label, score, tone, inverse = false }: { label: string; score: number; tone: string; inverse?: boolean }) {
  return (
    <div className={`health-card ${tone}`}>
      <div><span>{label}</span><strong>{score}<small>/100</small></strong></div>
      <div className="health-ring" style={{ '--score': `${score}%` } as React.CSSProperties}><span>{inverse ? (score < 30 ? 'Low' : 'High') : score >= 80 ? 'Strong' : 'Watch'}</span></div>
    </div>
  );
}
