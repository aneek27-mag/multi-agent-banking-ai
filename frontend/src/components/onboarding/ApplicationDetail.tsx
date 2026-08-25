'use client';

import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { useApplication } from '../../state/demoStore';
import { ApplicationHeader } from './ApplicationHeader';
import { ProcessWithAI } from './ProcessWithAI';
import { WorkflowTracker } from './WorkflowTracker';
import { DocumentCard } from './DocumentCard';
import { VerificationSummary } from './VerificationSummary';
import { AuditLog } from './AuditLog';

const formatINR = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export function ApplicationDetail({ id }: { id: string }) {
  const application = useApplication(id);

  if (!application) {
    return (
      <div className="onb-page">
        <div className="empty-customers onb-not-found">
          <Search size={22} />
          <strong>Application not found</strong>
          <span>This application ID doesn&apos;t exist in the demo dataset.</span>
          <Link href="/onboarding" className="outline-action"><ArrowLeft size={14} />Back to applications</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="customer360-page onb-detail-page">
      <ApplicationHeader application={application} />

      <ProcessWithAI application={application} />

      <WorkflowTracker steps={application.workflow} title="This application's pipeline" />

      <section className="customer360-columns">
        <div>
          <section className="detail-panel">
            <div className="detail-heading">
              <div><p>Personal information</p><h2>Applicant details</h2></div>
            </div>
            <div className="finance-metrics">
              <div className="metric-item"><span>Name</span><strong>{application.customerName}</strong></div>
              <div className="metric-item"><span>Date of birth</span><strong>{application.personal.dob}</strong></div>
              <div className="metric-item"><span>Phone</span><strong>{application.personal.phone}</strong></div>
              <div className="metric-item"><span>Email</span><strong>{application.personal.email}</strong></div>
              <div className="metric-item"><span>Address</span><strong>{application.personal.address}</strong></div>
              <div className="metric-item"><span>Occupation</span><strong>{application.personal.occupation}</strong></div>
            </div>
          </section>

          <section className="detail-panel">
            <div className="detail-heading">
              <div><p>Account request</p><h2>What the customer is applying for</h2></div>
            </div>
            <div className="finance-metrics">
              <div className="metric-item"><span>Account type</span><strong>{application.accountRequest.accountType}</strong></div>
              <div className="metric-item"><span>Expected monthly transactions</span><strong>{application.accountRequest.expectedMonthlyTransactions}</strong></div>
              <div className="metric-item"><span>Expected monthly income</span><strong>{formatINR(application.accountRequest.expectedMonthlyIncome)}</strong></div>
              <div className="metric-item"><span>Purpose</span><strong>{application.accountRequest.purpose}</strong></div>
            </div>
          </section>

          <section className="detail-panel">
            <div className="detail-heading">
              <div><p>Documents</p><h2>Simulated identity documents</h2></div>
              <span className="panel-caption">{application.documentsComplete}/{application.documentsRequired} required documents</span>
            </div>
            <div className="doc-grid">
              {application.documents.map((document) => <DocumentCard doc={document} key={document.type} />)}
            </div>
          </section>

          <VerificationSummary application={application} />
        </div>

        <aside className="customer360-aside">
          <AuditLog events={application.audit} />
        </aside>
      </section>
    </div>
  );
}
