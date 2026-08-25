'use client';

import { useState } from 'react';
import { Check, Clock, X } from 'lucide-react';
import { WorkflowStep } from '../../types/onboarding';

const ICONS: Record<string, typeof Check> = { Completed: Check, 'Requires Review': Clock, Failed: X };

export function WorkflowTracker({ steps, title, caption }: { steps: WorkflowStep[]; title: string; caption?: string }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = steps.find((step) => step.id === activeId) ?? null;

  return (
    <section className="onb-workflow-panel">
      <div className="agent-section-heading">
        <div>
          <p>Onboarding pipeline</p>
          <h2>{title}</h2>
        </div>
        {caption && <span className="workflow-status"><i />{caption}</span>}
      </div>
      <div className="onb-workflow-scroll">
        <div className="onb-workflow-steps">
          {steps.map((step, index) => {
            const Icon = ICONS[step.status];
            return (
              <button
                type="button"
                key={step.id}
                className={`onb-workflow-node ${step.status.toLowerCase().replace(/\s+/g, '-')} ${activeId === step.id ? 'active' : ''}`}
                onClick={() => setActiveId((current) => (current === step.id ? null : step.id))}
              >
                <span className="onb-workflow-icon">{Icon ? <Icon size={12} /> : String(index + 1).padStart(2, '0')}</span>
                <strong>{step.label}</strong>
                <small>{step.status}</small>
              </button>
            );
          })}
        </div>
      </div>
      {active && (
        <div className="onb-workflow-detail">
          <strong>{active.label}</strong>
          <span className={`onb-workflow-detail-status ${active.status.toLowerCase().replace(/\s+/g, '-')}`}>{active.status}</span>
          <p>{active.detail}</p>
        </div>
      )}
    </section>
  );
}
