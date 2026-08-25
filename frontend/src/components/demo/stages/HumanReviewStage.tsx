'use client';

import { useState } from 'react';
import { AlertTriangle, ArrowRight, Check, MessageSquareText } from 'lucide-react';
import { DEMO_CUSTOMER, DEMO_RISK_CASE } from '../../../data/demoScript';

type Resolution = 'Cleared' | 'Escalated' | 'More information requested';

export function HumanReviewStage({ onNext }: { onNext: () => void }) {
  const [resolution, setResolution] = useState<Resolution | null>(null);

  return (
    <div className="demo-stage-body">
      <section className="dashboard-panel demo-review-panel">
        <div className="panel-heading"><div><p>Human in the loop</p><h2>Risk case</h2></div><span className="kyc-status human-review">Human Review</span></div>
        <div className="escalation-row">
          <div className="escalation-icon"><AlertTriangle size={15} /></div>
          <div>
            <strong>{DEMO_CUSTOMER.name}</strong>
            <p>Transaction: ₹{DEMO_RISK_CASE.amount.toLocaleString('en-IN')} · Risk {DEMO_RISK_CASE.aiRiskScore}/100</p>
            <small>AI confidence {DEMO_RISK_CASE.aiConfidence}%</small>
            <span className="escalation-confidence">AI recommendation: transaction requires manual verification due to significant behavioral deviation.</span>
            {!resolution ? (
              <div className="escalation-actions">
                <button onClick={() => setResolution('Cleared')}><Check size={12} />Clear Transaction</button>
                <button onClick={() => setResolution('Escalated')}><AlertTriangle size={12} />Escalate Case</button>
                <button onClick={() => setResolution('More information requested')}><MessageSquareText size={12} />Request More Information</button>
              </div>
            ) : (
              <span className="reviewed-state"><Check size={13} />{resolution}</span>
            )}
          </div>
        </div>
      </section>

      {resolution && (
        <section className="dashboard-panel demo-confirmation-panel">
          <p className="demo-confirmation"><Check size={14} />Case {resolution.toLowerCase()}</p>
          <div className="analytics-stat-row">
            <div><span>Human review queue</span><strong>+1</strong></div>
            <div><span>Audit log</span><strong>Updated</strong></div>
          </div>
          <button type="button" className="primary-action demo-continue-button" onClick={onNext}>Continue to Executive Intelligence<ArrowRight size={14} /></button>
        </section>
      )}
    </div>
  );
}
