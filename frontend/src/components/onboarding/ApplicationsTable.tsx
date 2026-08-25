'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Filter, Search, Sparkles } from 'lucide-react';
import { OnboardingApplication } from '../../types/onboarding';

const STATUS_CLASS: Record<string, string> = {
  New: 'new',
  'In Progress': 'in-progress',
  Completed: 'completed',
  'Human Review': 'human-review',
  Rejected: 'rejected',
};

export function ApplicationsTable({ applications }: { applications: OnboardingApplication[] }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All statuses');
  const [risk, setRisk] = useState('All risk');
  const [accountType, setAccountType] = useState('All account types');
  const [sort, setSort] = useState('recent');

  const accountTypes = useMemo(() => [...new Set(applications.map((application) => application.accountType))], [applications]);

  const filtered = useMemo(() => applications
    .filter((application) => `${application.customerName} ${application.id}`.toLowerCase().includes(query.toLowerCase()))
    .filter((application) => status === 'All statuses' || application.kycStatus === status)
    .filter((application) => risk === 'All risk' || application.risk === risk)
    .filter((application) => accountType === 'All account types' || application.accountType === accountType)
    .sort((a, b) => (sort === 'confidence' ? b.aiConfidence - a.aiConfidence : 0)),
  [applications, query, status, risk, accountType, sort]);

  return (
    <section className="customer-table-panel onb-table-panel">
      <div className="customer-toolbar">
        <label className="customer-search">
          <Search size={16} />
          <span className="sr-only">Search applications</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name or application ID" />
        </label>
        <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by KYC status">
          <option>All statuses</option>
          <option>New</option>
          <option>In Progress</option>
          <option>Completed</option>
          <option>Human Review</option>
          <option>Rejected</option>
        </select>
        <select value={risk} onChange={(event) => setRisk(event.target.value)} aria-label="Filter by risk">
          <option>All risk</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <select value={accountType} onChange={(event) => setAccountType(event.target.value)} aria-label="Filter by account type">
          <option>All account types</option>
          {accountTypes.map((type) => <option key={type}>{type}</option>)}
        </select>
        <label className="sort-control">
          <Filter size={14} />
          <span>Sort</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort applications">
            <option value="recent">Most recent</option>
            <option value="confidence">AI confidence</option>
          </select>
        </label>
      </div>
      <div className="table-scroll">
        <table className="customer-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Application ID</th>
              <th>Submitted</th>
              <th>Account type</th>
              <th>Documents</th>
              <th>KYC status</th>
              <th>AI confidence</th>
              <th>Risk</th>
              <th>Processing time</th>
              <th>Current step</th>
              <th><span className="sr-only">Open</span></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((application) => (
              <tr key={application.id}>
                <td>
                  <Link href={`/onboarding/${application.id}`} className="customer-name-cell">
                    <span className="customer-avatar">{application.initials}</span>
                    <span><strong>{application.customerName}</strong></span>
                  </Link>
                </td>
                <td className="profile-secondary">{application.id}</td>
                <td className="profile-secondary">{application.submitted}</td>
                <td className="profile-primary">{application.accountType}</td>
                <td className="profile-secondary">{application.documentsComplete}/{application.documentsRequired} documents</td>
                <td><span className={`kyc-status ${STATUS_CLASS[application.kycStatus] ?? ''}`}>{application.kycStatus}</span></td>
                <td>{application.aiConfidence > 0 ? <span className="opportunity-score"><Sparkles size={13} />{application.aiConfidence}%</span> : <span className="profile-secondary">—</span>}</td>
                <td><span className={`risk-pill ${application.risk.toLowerCase()}`}>{application.risk}</span></td>
                <td className="profile-secondary">{application.processingTime}</td>
                <td className="profile-secondary">{application.currentStep}</td>
                <td><Link href={`/onboarding/${application.id}`} className="row-open" aria-label={`Open ${application.customerName}`}><ChevronRight size={16} /></Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-customers">
            <Search size={22} />
            <strong>No applications match these filters</strong>
            <span>Try a broader status, risk level, or search.</span>
          </div>
        )}
      </div>
      <div className="table-footer">Showing {filtered.length} of {applications.length} applications <span>Demo data for SIH 2026</span></div>
    </section>
  );
}
