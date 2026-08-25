'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Check, Loader2, Sparkles } from 'lucide-react';

const AGENT_STEPS = ['Customer Intelligence Agent', 'Recommendation Agent', 'Risk Agent', 'Decision Agent'];
const EVIDENCE = ['High digital engagement', 'Frequent travel spending', 'Strong repayment behavior', 'No existing premium credit product'];

export function AgentDecisionStage({ onNext }: { onNext: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timers = AGENT_STEPS.slice(1).map((_, offset) => setTimeout(() => setStepIndex(offset + 1), (offset + 1) * 650));
    return () => timers.forEach(clearTimeout);
  }, []);

  const complete = stepIndex >= AGENT_STEPS.length - 1;

  return (
    <div className="demo-stage-body">
      <section className="dashboard-panel">
        <div className="panel-heading"><div><p>Live demo</p><h2>Multi-agent orchestration</h2></div></div>
        <div className="ai-processing" style={{ marginTop: 16 }}>
          {AGENT_STEPS.map((agent, index) => {
            const state = index < stepIndex ? 'done' : index === stepIndex ? 'active' : 'pending';
            return (
              <div className={`ai-processing-step ${state}`} key={agent}>
                <span className="ai-processing-icon">{state === 'done' ? <Check size={11} /> : state === 'active' ? <Loader2 size={11} className="ai-spin" /> : null}</span>
                <span>{agent}</span>
              </div>
            );
          })}
        </div>
      </section>

      {complete && (
        <section className="insight-panel">
          <div className="insight-title"><Sparkles size={17} /><h2>Next best action</h2></div>
          <p className="demo-decision-product">Premium Travel Credit Card</p>
          <div className="confidence"><span>Confidence</span><strong>91%</strong></div>
          <strong className="onb-why-label">Explainable signals</strong>
          <ul className="onb-why-list">{EVIDENCE.map((item) => <li key={item}><Check size={11} />{item}</li>)}</ul>
          <button type="button" className="primary-action demo-continue-button" onClick={onNext}>Generate Personalized Engagement<ArrowRight size={14} /></button>
        </section>
      )}
    </div>
  );
}
