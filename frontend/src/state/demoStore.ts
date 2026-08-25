'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { applications as seedApplications, buildReviewQueue, newAuditEvent } from '../data/onboarding';
import { customerRecords } from '../data/customers';
import { agentActivity as seedActivity } from '../data/mockData';
import { OnboardingApplication, ReviewCase } from '../types/onboarding';
import { CustomerRecord } from '../types/customer';
import { AgentActivity } from '../types/banking';

let applicationsState: OnboardingApplication[] = seedApplications.map((application) => ({
  ...application,
  documents: application.documents.map((document) => ({ ...document })),
  workflow: application.workflow.map((step) => ({ ...step })),
  audit: [...application.audit],
}));

let dynamicCustomers: CustomerRecord[] = [];
let activityState: AgentActivity[] = [...seedActivity];
let version = 0;
let customerSeq = 30000;

export interface DashboardInsights {
  highIntent: number;
  decliningEngagement: number;
  humanReview: number;
  customersAnalyzed: number;
  engagementSignals: number;
  productOpportunities: number;
  riskSignals: number;
  lastScanLabel: string;
}

let insightsState: DashboardInsights = {
  highIntent: 184,
  decliningEngagement: 42,
  humanReview: 17,
  customersAnalyzed: 248392,
  engagementSignals: 0,
  productOpportunities: 184,
  riskSignals: 42,
  lastScanLabel: 'Data refreshed 4 minutes ago',
};

const STORAGE_KEY = 'nexus-demo-store-v1';

interface PersistedShape {
  applications: OnboardingApplication[];
  customers: CustomerRecord[];
  activity: AgentActivity[];
  customerSeq: number;
  insights: DashboardInsights;
}

function persist() {
  if (typeof window === 'undefined') return;
  try {
    const payload: PersistedShape = { applications: applicationsState, customers: dynamicCustomers, activity: activityState, customerSeq, insights: insightsState };
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // sessionStorage unavailable or quota exceeded — demo state just won't survive a hard reload.
  }
}

/** Restores state persisted from an earlier hard navigation (the sidebar uses plain <a> tags). Client-only, called once after mount to avoid SSR hydration mismatches. */
export function hydrateFromSession() {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Partial<PersistedShape>;
    if (parsed.applications) applicationsState = parsed.applications;
    if (parsed.customers) dynamicCustomers = parsed.customers;
    if (parsed.activity) activityState = parsed.activity;
    if (parsed.customerSeq) customerSeq = parsed.customerSeq;
    if (parsed.insights) insightsState = parsed.insights;
    notify();
  } catch {
    // Corrupt or incompatible cached state — fall back to the seed data already in memory.
  }
}

const listeners = new Set<() => void>();
function notify() {
  version += 1;
  persist();
  listeners.forEach((listener) => listener());
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getApplications() {
  return applicationsState;
}
export function getApplication(id: string) {
  return applicationsState.find((application) => application.id === id);
}

export function addApplication(application: OnboardingApplication) {
  applicationsState = [application, ...applicationsState];
  notify();
}

export function updateApplication(id: string, patch: Partial<OnboardingApplication>) {
  applicationsState = applicationsState.map((application) => (application.id === id ? { ...application, ...patch } : application));
  notify();
}

export function appendAudit(id: string, agent: string, event: string) {
  applicationsState = applicationsState.map((application) =>
    application.id === id ? { ...application, audit: [...application.audit, newAuditEvent(agent, event)] } : application
  );
  notify();
}

export function pushActivity(entry: AgentActivity) {
  activityState = [entry, ...activityState].slice(0, 12);
  notify();
}

/** Commits a completed intelligence-scan pass into the shared dashboard state so every panel that reads it re-renders. */
export function applyIntelligenceScanResult(result: Omit<DashboardInsights, 'lastScanLabel'>) {
  insightsState = { ...result, lastScanLabel: 'Data refreshed just now' };
  notify();
}

function ageFromDob(dob: string): number {
  const parsed = new Date(dob);
  if (Number.isNaN(parsed.getTime())) return 30;
  const years = (Date.now() - parsed.getTime()) / (365.25 * 24 * 3600 * 1000);
  return Math.max(18, Math.round(years));
}

function cityFromAddress(address: string): string {
  const parts = address.split(',').map((part) => part.trim());
  return parts.length >= 2 ? parts[parts.length - 2] : address;
}

export function addCustomerFromApplication(application: OnboardingApplication): CustomerRecord {
  customerSeq += 1;
  const record: CustomerRecord = {
    id: `CUS-${customerSeq}`,
    name: application.customerName,
    initials: application.initials,
    age: ageFromDob(application.personal.dob),
    city: cityFromAddress(application.personal.address),
    occupation: application.personal.occupation,
    monthlyIncome: application.accountRequest.expectedMonthlyIncome,
    accountType: application.accountType,
    balance: 5000,
    engagement: 40,
    riskScore: application.risk === 'High' ? 65 : application.risk === 'Medium' ? 38 : 16,
    riskLevel: application.risk,
    segment: 'New to Bank',
    kycStatus: 'Verified',
    products: [application.accountType],
    lastActive: 'Just now',
    opportunityScore: 58,
    healthScore: 55,
  };
  dynamicCustomers = [...dynamicCustomers, record];
  applicationsState = applicationsState.map((item) => (item.id === application.id ? { ...item, convertedToCustomerId: record.id } : item));
  pushActivity({ agent: 'Customer Intelligence Agent', action: 'Created customer profile from onboarding', customer: record.name, time: 'Just now', status: 'Completed' });
  notify();
  return record;
}

function useStoreVersion(): number {
  return useSyncExternalStore(subscribe, () => version, () => version);
}

export function useApplications(): OnboardingApplication[] {
  useStoreVersion();
  return applicationsState;
}

export function useApplication(id: string): OnboardingApplication | undefined {
  const applications = useApplications();
  return useMemo(() => applications.find((application) => application.id === id), [applications, id]);
}

export function useReviewQueue(): ReviewCase[] {
  const applications = useApplications();
  return useMemo(() => buildReviewQueue(applications), [applications]);
}

export function useAllCustomers(): CustomerRecord[] {
  useStoreVersion();
  return [...customerRecords, ...dynamicCustomers];
}

export function useCustomerById(id: string | null | undefined): CustomerRecord | undefined {
  const all = useAllCustomers();
  return useMemo(() => (id ? all.find((customer) => customer.id === id) : undefined), [all, id]);
}

export function useActivityFeed(): AgentActivity[] {
  useStoreVersion();
  return activityState;
}

export function useDashboardInsights(): DashboardInsights {
  useStoreVersion();
  return insightsState;
}
