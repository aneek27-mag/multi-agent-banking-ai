import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { recommendAccount } from '../../../services/onboardingService';

const REQUIREMENTS = {
  income: 85000,
  primaryUsage: 'Digital payments',
  expectedTransactions: 40,
  goal: 'Savings + digital banking',
};

export function AcquisitionStage({ onNext }: { onNext: () => void }) {
  const recommendation = recommendAccount({ monthlyIncome: REQUIREMENTS.income, expectedMonthlyTransactions: REQUIREMENTS.expectedTransactions, primaryUsage: REQUIREMENTS.primaryUsage });

  return (
    <div className="demo-stage-body">
      <section className="detail-panel">
        <div className="detail-heading"><div><p>Application intake</p><h2>Customer requirements</h2></div></div>
        <div className="finance-metrics">
          <div className="metric-item"><span>Income</span><strong>₹{REQUIREMENTS.income.toLocaleString('en-IN')}</strong></div>
          <div className="metric-item"><span>Primary usage</span><strong>{REQUIREMENTS.primaryUsage}</strong></div>
          <div className="metric-item"><span>Expected transactions</span><strong>{REQUIREMENTS.expectedTransactions}/month</strong></div>
          <div className="metric-item"><span>Goal</span><strong>{REQUIREMENTS.goal}</strong></div>
        </div>
      </section>

      <div className="next-action-panel onb-recommendation">
        <p><Sparkles size={13} />AI recommendation</p>
        <h2>{recommendation.recommended}</h2>
        <div className="confidence"><span>Confidence</span><strong>{recommendation.confidence}%</strong></div>
        <strong className="onb-why-label">Why?</strong>
        <ul className="onb-why-list">{recommendation.reasons.map((reason) => <li key={reason}><Check size={11} />{reason}</li>)}</ul>
        <small>AI recommendation only — not an eligibility or approval decision.</small>
        <button type="button" className="primary-action demo-continue-button" onClick={onNext}>Continue to AI Onboarding<ArrowRight size={14} /></button>
      </div>
    </div>
  );
}
