import { OnboardingApplication } from '../../types/onboarding';

export function KpiStrip({ applications }: { applications: OnboardingApplication[] }) {
  const newApplications = applications.filter((application) => application.kycStatus === 'New').length;
  const inProgress = applications.filter((application) => application.kycStatus === 'In Progress').length;
  const kycVerified = applications.filter((application) => application.kycStatus === 'Completed').length;
  const humanReview = applications.filter((application) => application.kycStatus === 'Human Review').length;
  const rejected = applications.filter((application) => application.kycStatus === 'Rejected').length;
  const aiVerified = applications.filter((application) => application.processed && application.kycStatus !== 'Rejected' && application.kycStatus !== 'Human Review').length;

  return (
    <section className="kpi-grid" aria-label="Onboarding pipeline performance">
      <div className="kpi-intro">
        <p>Verification pulse</p>
        <strong>2m 14s</strong>
        <span>Avg. verification time</span>
      </div>
      <article className="kpi-card lime"><span>New applications</span><strong>{newApplications}</strong></article>
      <article className="kpi-card blue"><span>In progress</span><strong>{inProgress}</strong></article>
      <article className="kpi-card"><span>KYC verified</span><strong>{kycVerified}</strong></article>
      <article className="kpi-card violet"><span>AI verified</span><strong>{aiVerified}</strong></article>
      <article className="kpi-card amber"><span>Human review</span><strong>{humanReview}</strong></article>
      <article className="kpi-card red"><span>Rejected</span><strong>{rejected}</strong></article>
    </section>
  );
}
