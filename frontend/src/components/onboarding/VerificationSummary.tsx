'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Lightbulb, Loader2, Sparkles, X } from 'lucide-react';
import { OnboardingApplication } from '../../types/onboarding';
import { sendMessage } from '../../services/aiService';

export function VerificationSummary({ application }: { application: OnboardingApplication }) {
  const [open, setOpen] = useState(false);
  const [elaboration, setElaboration] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passedChecks = application.verificationChecks.filter((check) => check.passed);
  const failedChecks = application.verificationChecks.filter((check) => !check.passed);

  async function askAi() {
    setLoading(true);
    const evidence = passedChecks.map((check) => check.label).join(', ') || 'limited evidence so far';
    const question = `In one short paragraph, explain why the demo AI assessment for onboarding application ${application.id} (${application.customerName}) produced ${application.aiConfidence}% confidence and a decision of "${application.aiDecision}". Passed checks: ${evidence}. This is a simulated SIH demo assessment, not a real legal KYC decision — say so if relevant.`;
    const result = await sendMessage({ message: question, history: [], customer: null });
    setElaboration(result.content);
    setLoading(false);
  }

  return (
    <div className="insight-panel onb-summary-panel">
      <div className="insight-title"><Lightbulb size={17} /><h2>AI verification summary</h2></div>
      <p>{application.aiSummary}</p>
      <strong>Checks</strong>
      <ul>
        {passedChecks.map((check) => <li key={check.label}>{check.label}</li>)}
        {failedChecks.map((check) => <li className="onb-check-failed" key={check.label}><X size={11} />{check.label}</li>)}
      </ul>
      <div className="confidence">
        <span>Confidence</span>
        <strong>{application.aiConfidence}%</strong>
      </div>
      <p className="onb-decision-line"><Sparkles size={13} />{application.aiDecision}</p>
      <small className="onb-demo-tag">Demo AI assessment — not an actual legal KYC decision.</small>

      <button type="button" className="reasoning-toggle onb-reasoning-toggle" onClick={() => setOpen((current) => !current)}>
        <div>
          <p>Explainable AI</p>
          <h2>Why did AI reach this result?</h2>
        </div>
        <ChevronDown size={18} className={open ? 'rotate' : ''} />
      </button>

      {open && (
        <div className="reasoning-content onb-reasoning-content">
          <div className="reasoning-stage">
            <span>Evidence</span>
            <ul className="onb-evidence-list">
              {passedChecks.map((check) => <li key={check.label}><Sparkles size={11} />{check.label}</li>)}
              {failedChecks.map((check) => <li className="onb-check-failed" key={check.label}><X size={11} />{check.label} not confirmed</li>)}
            </ul>
          </div>
          <ChevronRight className="reasoning-arrow" />
          <div className="reasoning-stage analysis-stage">
            <span>AI analysis</span>
            <p>{application.aiSummary}</p>
          </div>
          <ChevronRight className="reasoning-arrow" />
          <div className="reasoning-stage conclusion-stage">
            <span>Decision</span>
            <strong>{application.aiDecision}</strong>
            <small>Confidence {application.aiConfidence}%</small>
          </div>
        </div>
      )}

      {open && (
        <div className="onb-elaborate">
          {elaboration ? (
            <p className="onb-elaboration-text">{elaboration}</p>
          ) : (
            <button type="button" className="outline-action" onClick={askAi} disabled={loading}>
              {loading ? <Loader2 size={13} className="ai-spin" /> : <Sparkles size={13} />}
              {loading ? 'Asking Nexus AI…' : 'Ask AI to elaborate'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
