'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Check, ChevronRight, Loader2, Sparkles, Zap } from 'lucide-react';
import { OnboardingApplication } from '../../types/onboarding';
import { PROCESS_STEPS, ProcessApplicationResult, processApplication } from '../../services/onboardingService';

export function ProcessWithAI({ application }: { application: OnboardingApplication }) {
  const [running, setRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(-1);
  const [result, setResult] = useState<ProcessApplicationResult | null>(null);

  async function run() {
    setRunning(true);
    setResult(null);
    setStepIndex(-1);
    const outcome = await processApplication(application.id, (index) => setStepIndex(index));
    setStepIndex(PROCESS_STEPS.length);
    setResult(outcome);
    setRunning(false);
  }

  const flaggedIssue = application.documents.find((document) => document.flag)?.flag;

  return (
    <section className="dashboard-panel onb-process-panel">
      <div className="agent-section-heading">
        <div>
          <p>Live demo</p>
          <h2>Multi-agent AI processing</h2>
        </div>
        <button type="button" className="run-workflow-button" onClick={run} disabled={running}>
          {running ? <Loader2 size={15} className="ai-spin" /> : <Zap size={15} />}
          {running ? 'Processing…' : application.processed ? 'Re-run AI processing' : 'Process Application with AI'}
        </button>
      </div>

      {stepIndex >= 0 && (
        <div className="ai-processing onb-process-steps">
          {PROCESS_STEPS.map((step, index) => {
            const state = index < stepIndex || stepIndex >= PROCESS_STEPS.length ? 'done' : index === stepIndex ? 'active' : 'pending';
            return (
              <div className={`ai-processing-step ${state}`} key={step.label}>
                <span className="ai-processing-icon">{state === 'done' ? <Check size={11} /> : state === 'active' ? <Loader2 size={11} className="ai-spin" /> : null}</span>
                <span><strong className="onb-step-agent">{step.agent}</strong> — {step.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {result && (
        <div className={`workflow-decision onb-result ${result.outcome === 'verified' ? 'onb-result-good' : 'onb-result-review'}`}>
          <div>
            <span>{result.outcome === 'verified' ? 'AI Verification Complete' : result.outcome === 'human_review' ? 'Human Review Required' : 'Application Rejected'}</span>
            <strong>{result.outcome === 'verified' ? <><Check size={15} />Ready to continue onboarding</> : <><AlertTriangle size={15} />{flaggedIssue?.issue ?? 'Risk threshold not met'}</>}</strong>
            <p>Next action: {result.outcome === 'verified' ? 'Continue onboarding' : result.outcome === 'human_review' ? 'Human verification' : 'Application closed in sandbox'}</p>
          </div>
          <b>{result.application.aiConfidence}%<small>confidence</small></b>
          {result.outcome === 'verified' && (result.newCustomerId ?? (result.application.convertedToCustomerId?.endsWith('-SEED') ? undefined : result.application.convertedToCustomerId)) && (
            <Link href={`/customers/${result.newCustomerId ?? result.application.convertedToCustomerId}`}><Sparkles size={14} />View in Customer 360<ChevronRight size={13} /></Link>
          )}
        </div>
      )}
    </section>
  );
}
