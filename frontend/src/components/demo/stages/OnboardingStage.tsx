'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';

const STEPS = ['Document Processing', 'Identity Matching', 'Risk Screening', 'Verification'];
const CHECKS = [
  { label: 'PAN', result: 'Extracted' },
  { label: 'Identity', result: 'Matched' },
  { label: 'Address', result: 'Verified' },
];

export function OnboardingStage({ onNext }: { onNext: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timers = STEPS.slice(1).map((_, offset) => setTimeout(() => setStepIndex(offset + 1), (offset + 1) * 550));
    return () => timers.forEach(clearTimeout);
  }, []);

  const complete = stepIndex >= STEPS.length - 1;

  return (
    <div className="demo-stage-body">
      <section className="detail-panel">
        <div className="detail-heading"><div><p>Simulated document check</p><h2>Demo identity documents</h2></div></div>
        <div className="finance-metrics">
          {CHECKS.map((check) => <div className="metric-item" key={check.label}><span>{check.label}</span><strong><Check size={12} className="demo-inline-check" />{check.result}</strong></div>)}
          <div className="metric-item"><span>Document quality</span><strong>98%</strong></div>
          <div className="metric-item"><span>AI confidence</span><strong>98%</strong></div>
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="panel-heading"><div><p>Live demo</p><h2>Multi-agent processing</h2></div></div>
        <div className="ai-processing" style={{ marginTop: 16 }}>
          {STEPS.map((step, index) => {
            const state = index < stepIndex ? 'done' : index === stepIndex ? 'active' : 'pending';
            return (
              <div className={`ai-processing-step ${state}`} key={step}>
                <span className="ai-processing-icon">{state === 'done' ? <Check size={11} /> : state === 'active' ? <Loader2 size={11} className="ai-spin" /> : null}</span>
                <span>{step}</span>
              </div>
            );
          })}
        </div>
        {complete && (
          <div className="workflow-decision onb-result onb-result-good">
            <div>
              <span>Demo Verification Completed</span>
              <strong><Check size={15} />Documents processed successfully</strong>
              <p>This is a simulated demo verification, not a real KYC check.</p>
            </div>
            <b>98%<small>confidence</small></b>
          </div>
        )}
        {complete && <button type="button" className="primary-action demo-continue-button" onClick={onNext}>Continue to Customer Intelligence<ArrowRight size={14} /></button>}
      </section>
    </div>
  );
}
