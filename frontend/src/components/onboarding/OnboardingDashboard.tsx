'use client';

import Link from 'next/link';
import { Plus, Sparkles } from 'lucide-react';
import { useApplications, useReviewQueue } from '../../state/demoStore';
import { DROP_OFF_INSIGHT, FUNNEL_STAGES } from '../../data/onboarding';
import { KpiStrip } from './KpiStrip';
import { WorkflowTracker } from './WorkflowTracker';
import { ApplicationFunnel } from './ApplicationFunnel';
import { ApplicationsTable } from './ApplicationsTable';
import { ReviewQueue } from './ReviewQueue';

export function OnboardingDashboard() {
  const applications = useApplications();
  const reviewCases = useReviewQueue();
  const featured = applications.find((application) => application.id === 'APP-10482') ?? applications[0];

  return (
    <div className="onb-page">
      <section className="onb-heading">
        <div>
          <p className="dashboard-eyebrow"><span className="status-pulse" />Nexus onboarding / simulated environment</p>
          <h1>Intelligent Onboarding</h1>
          <p>AI-assisted customer acquisition, document verification and onboarding.</p>
        </div>
        <Link href="/onboarding/new" className="primary-action"><Plus size={16} />Start New Application</Link>
      </section>

      <KpiStrip applications={applications} />

      {featured && <WorkflowTracker steps={featured.workflow} title={`Example pipeline · ${featured.customerName}`} caption="Representative flow" />}

      <ApplicationFunnel stages={FUNNEL_STAGES} dropOff={DROP_OFF_INSIGHT} />

      <section className="onb-section-heading">
        <div>
          <p className="dashboard-eyebrow"><Sparkles size={12} />Applications</p>
          <h2>All onboarding applications</h2>
        </div>
      </section>
      <ApplicationsTable applications={applications} />

      <ReviewQueue cases={reviewCases} />
    </div>
  );
}
