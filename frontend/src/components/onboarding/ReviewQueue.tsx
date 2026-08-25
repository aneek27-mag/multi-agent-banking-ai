'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Check, ChevronRight, MessageSquareText, ShieldCheck, X } from 'lucide-react';
import { ReviewCase } from '../../types/onboarding';
import { appendAudit, updateApplication } from '../../state/demoStore';

export function ReviewQueue({ cases }: { cases: ReviewCase[] }) {
  const [resolved, setResolved] = useState<Record<string, ReviewCase['status']>>({});

  function resolve(reviewCase: ReviewCase, status: ReviewCase['status'], action: string) {
    setResolved((current) => ({ ...current, [reviewCase.applicationId]: status }));
    appendAudit(reviewCase.applicationId, 'Human Escalation Agent', action);
    if (status === 'Approved') updateApplication(reviewCase.applicationId, { kycStatus: 'Completed', currentStep: 'Digital Banking Activation' });
  }

  const open = cases.filter((reviewCase) => !resolved[reviewCase.applicationId]);

  return (
    <section className="dashboard-panel onb-review-panel">
      <div className="agent-section-heading">
        <div>
          <p>Human in the loop</p>
          <h2>Human review queue</h2>
        </div>
        <span className="escalation-count">{open.length} open</span>
      </div>
      {cases.length === 0 && (
        <div className="onb-review-empty">
          <ShieldCheck size={20} />
          <strong>No applications need human review</strong>
          <span>Every application in this session cleared automated verification.</span>
        </div>
      )}
      {cases.map((reviewCase) => {
        const status = resolved[reviewCase.applicationId];
        return (
          <div className="escalation-row" key={reviewCase.applicationId}>
            <div className="escalation-icon"><AlertTriangle size={15} /></div>
            <div>
              <strong>{reviewCase.customerName}</strong>
              <p>Issue: {reviewCase.issue}</p>
              <small>Priority: {reviewCase.priority} · Waiting {reviewCase.waiting}</small>
              <span className="escalation-confidence">AI confidence {reviewCase.aiConfidence}%</span>
              {!status ? (
                <div className="escalation-actions">
                  <Link href={`/onboarding/${reviewCase.applicationId}`}><ChevronRight size={12} />Review</Link>
                  <button onClick={() => resolve(reviewCase, 'Approved', 'Approved after human review')}><Check size={12} />Approve</button>
                  <button onClick={() => resolve(reviewCase, 'Correction requested', 'Requested correction from customer')}><MessageSquareText size={12} />Request Correction</button>
                  <button onClick={() => resolve(reviewCase, 'Escalated', 'Escalated to senior reviewer')}><X size={12} />Escalate</button>
                </div>
              ) : (
                <span className="reviewed-state"><Check size={13} />{status}</span>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
