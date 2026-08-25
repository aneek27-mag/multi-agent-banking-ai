import Link from 'next/link';
import { ArrowLeft, MapPin, ShieldCheck } from 'lucide-react';
import { OnboardingApplication } from '../../types/onboarding';

const STATUS_CLASS: Record<string, string> = { New: 'new', 'In Progress': 'in-progress', Completed: 'completed', 'Human Review': 'human-review', Rejected: 'rejected' };

export function ApplicationHeader({ application }: { application: OnboardingApplication }) {
  const allVerified = application.documents.every((document) => document.status === 'Verified');
  const hasIssue = application.documents.some((document) => document.status === 'Requires Review' || document.status === 'Failed');
  const kycDocStatus = allVerified ? 'Verified' : hasIssue ? 'Issues found' : 'Pending';

  return (
    <>
      <Link href="/onboarding" className="back-link"><ArrowLeft size={15} />Back to applications</Link>
      <section className="profile-header">
        <div className="profile-identity">
          <span className="profile-avatar">{application.initials}</span>
          <div>
            <p className="dashboard-eyebrow">Application review / simulated profile</p>
            <h1>{application.customerName}</h1>
            <span>{application.id} · {application.accountType}</span>
            <div className="profile-tags">
              <span className={`kyc-status ${STATUS_CLASS[application.kycStatus] ?? ''}`}>{application.kycStatus}</span>
              <span className={`risk-pill ${application.risk.toLowerCase()}`}>{application.risk} risk</span>
              <span className="verified-tag"><ShieldCheck size={12} />KYC {kycDocStatus}</span>
              <span><MapPin size={12} />{application.personal.address.split(',').pop()?.trim()}</span>
            </div>
          </div>
        </div>
        <div className="profile-last-active">
          <span>Submitted</span>
          <strong>{application.submitted}</strong>
          <small>Processing time: {application.processingTime}</small>
        </div>
      </section>
    </>
  );
}
