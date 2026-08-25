'use client';

import { useState } from 'react';
import { ArrowRight, Check, MessageSquareText, Sparkles } from 'lucide-react';

export function EngagementStage({ onNext }: { onNext: () => void }) {
  const [sent, setSent] = useState(false);

  return (
    <div className="demo-stage-body">
      <section className="dashboard-panel demo-flow-panel">
        <div className="demo-flow-step"><span>Customer signal</span><strong>High travel spending + strong digital activity</strong></div>
        <ArrowRight className="demo-flow-arrow" size={16} />
        <div className="demo-flow-step"><span>AI action</span><strong>Generate personalized offer</strong></div>
      </section>

      <section className="insight-panel">
        <div className="insight-title"><MessageSquareText size={17} /><h2>Personalized message</h2></div>
        <p>&quot;Based on your recent travel and digital spending activity, you may find our travel-focused banking benefits useful.&quot;</p>
        <div className="analytics-stat-row">
          <div><span>Expected engagement</span><strong>High</strong></div>
          <div><span>AI confidence</span><strong>91%</strong></div>
        </div>
        {!sent ? (
          <button type="button" className="primary-action demo-continue-button" onClick={() => setSent(true)}><Sparkles size={14} />Send Demo Engagement</button>
        ) : (
          <>
            <p className="demo-confirmation"><Check size={14} />Demo engagement created</p>
            <button type="button" className="primary-action demo-continue-button" onClick={onNext}>Continue to Risk Intelligence<ArrowRight size={14} /></button>
          </>
        )}
        <small className="onb-demo-tag">Simulated message — no real email or SMS is sent.</small>
      </section>
    </div>
  );
}
