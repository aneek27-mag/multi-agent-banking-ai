import { buildWorkflow, initials } from '../data/onboarding';
import { addApplication, addCustomerFromApplication, appendAudit, getApplication, getApplications, updateApplication } from '../state/demoStore';
import { OnboardingApplication, WorkflowStepStatus } from '../types/onboarding';

export interface ProcessStep {
  agent: string;
  label: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  { agent: 'KYC Agent', label: 'Reading documents…' },
  { agent: 'KYC Agent', label: 'Extracting information…' },
  { agent: 'Document Verification Agent', label: 'Comparing identity fields…' },
  { agent: 'Risk Agent', label: 'Running risk checks…' },
  { agent: 'Customer Intelligence Agent', label: 'Generating initial profile…' },
  { agent: 'Decision Agent', label: 'Generating verification result…' },
];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getOnboardingApplications() {
  return getApplications();
}

/** Simulates re-checking a single document (e.g. after a correction is requested). */
export async function verifyDocument(applicationId: string): Promise<{ status: 'Verified' | 'Requires Review' }> {
  await wait(700);
  const application = getApplication(applicationId);
  return { status: application?.hasMismatch ? 'Requires Review' : 'Verified' };
}

/** Low-level step generator — yields each simulated agent step in sequence, one at a time. */
export async function* runKYCWorkflow(): AsyncGenerator<{ index: number; total: number; step: ProcessStep }> {
  for (let index = 0; index < PROCESS_STEPS.length; index += 1) {
    yield { index, total: PROCESS_STEPS.length, step: PROCESS_STEPS[index] };
    await wait(550);
  }
}

export interface ProcessApplicationResult {
  application: OnboardingApplication;
  outcome: 'verified' | 'human_review' | 'rejected';
  newCustomerId?: string;
}

/** Orchestrates the full simulated AI processing pass for one application and commits the result to shared demo state. */
export async function processApplication(applicationId: string, onStep?: (index: number, total: number, step: ProcessStep) => void): Promise<ProcessApplicationResult> {
  const original = getApplication(applicationId);
  if (!original) throw new Error('Application not found');

  for await (const progress of runKYCWorkflow()) {
    onStep?.(progress.index, progress.total, progress.step);
  }

  const outcome: ProcessApplicationResult['outcome'] = original.risk === 'High' ? 'rejected' : original.hasMismatch ? 'human_review' : 'verified';

  const completedWorkflow = original.workflow.map((step) => {
    if (outcome === 'human_review' && step.status === 'Requires Review') return step;
    if (outcome === 'rejected' && step.status === 'Failed') return step;
    if (step.status === 'Pending' || step.status === 'Processing') {
      const nextStatus: WorkflowStepStatus = outcome === 'human_review' && step.id === 'consistency' ? 'Requires Review' : 'Completed';
      return { ...step, status: nextStatus };
    }
    return step;
  });

  const kycStatus = outcome === 'verified' ? 'Completed' : outcome === 'human_review' ? 'Human Review' : 'Rejected';
  const aiConfidence = outcome === 'verified' ? Math.max(original.aiConfidence, 96) : original.aiConfidence;
  const currentStep = outcome === 'verified' ? 'Digital Banking Activation' : outcome === 'human_review' ? 'Identity Consistency Check' : 'Risk Screening';

  updateApplication(applicationId, { workflow: completedWorkflow, kycStatus, aiConfidence, currentStep, processed: true });

  appendAudit(applicationId, 'KYC Agent', 'Document extraction reviewed');
  appendAudit(applicationId, 'Document Verification Agent', 'Identity fields compared');
  appendAudit(applicationId, 'Risk Agent', outcome === 'rejected' ? 'Risk assessment flagged' : 'Risk assessment completed');
  appendAudit(applicationId, 'Decision Agent', outcome === 'verified' ? 'Recommended automated approval' : outcome === 'human_review' ? 'Human review requested' : 'Application rejected in sandbox');

  let newCustomerId: string | undefined;
  if (outcome === 'verified' && !original.convertedToCustomerId) {
    const customer = addCustomerFromApplication(getApplication(applicationId) ?? original);
    newCustomerId = customer.id;
  }

  const finalApplication = getApplication(applicationId) ?? original;
  return { application: finalApplication, outcome, newCustomerId };
}

export interface AccountRecommendationInput {
  monthlyIncome: number;
  expectedMonthlyTransactions: number;
  primaryUsage: string;
}

export interface AccountRecommendationResult {
  recommended: string;
  confidence: number;
  reasons: string[];
  alternatives: string[];
}

/** Deterministic demo heuristic — an AI recommendation, not an eligibility or approval decision. */
export function recommendAccount(input: AccountRecommendationInput): AccountRecommendationResult {
  const { monthlyIncome, expectedMonthlyTransactions, primaryUsage } = input;
  const candidates = [
    { type: 'Digital Savings Account', score: (primaryUsage === 'Digital payments' ? 40 : 10) + Math.min(expectedMonthlyTransactions, 40) + (monthlyIncome < 100000 ? 15 : 5), reasons: ['High expected digital usage', 'Frequent transactions', 'Suitable income profile'] },
    { type: 'Salary Account', score: (primaryUsage === 'Salary credit' ? 45 : 5) + (monthlyIncome >= 30000 ? 20 : 5), reasons: ['Regular salary credit pattern expected', 'Fee-friendly for salaried profiles'] },
    { type: 'Current Account', score: (expectedMonthlyTransactions > 50 ? 40 : 5) + (monthlyIncome >= 150000 ? 20 : 5), reasons: ['High transaction volume', 'Suited to business-style usage'] },
    { type: 'Savings Account', score: 25, reasons: ['Flexible, general-purpose banking'] },
  ];
  candidates.sort((a, b) => b.score - a.score);
  const [top, ...rest] = candidates;
  return {
    recommended: top.type,
    confidence: Math.min(96, 55 + Math.round(top.score / 2)),
    reasons: top.reasons,
    alternatives: rest.slice(0, 2).map((candidate) => candidate.type),
  };
}

export interface NewApplicationInput {
  name: string;
  dob: string;
  phone: string;
  email: string;
  address: string;
  occupation: string;
  accountType: string;
  expectedMonthlyIncome: number;
  expectedMonthlyTransactions: number;
  purpose: string;
  aiConfidence: number;
}

/** Submits the customer-facing acquisition wizard as an already-verified demo application, and creates the resulting customer. */
export function submitNewApplication(input: NewApplicationInput): { application: OnboardingApplication; customerId: string } {
  const id = `APP-${10000 + Math.floor(Math.random() * 89999)}`;
  const docFields = { Name: input.name, 'Date of Birth': input.dob, Address: input.address };
  const application: OnboardingApplication = {
    id,
    customerName: input.name,
    initials: initials(input.name),
    submitted: 'Just now',
    accountType: input.accountType,
    documentsComplete: 3,
    documentsRequired: 3,
    kycStatus: 'Completed',
    aiConfidence: input.aiConfidence,
    risk: 'Low',
    processingTime: '0m 52s',
    currentStep: 'Digital Banking Activation',
    hasMismatch: false,
    processed: true,
    personal: { dob: input.dob, phone: input.phone, email: input.email, address: input.address, occupation: input.occupation },
    accountRequest: { accountType: input.accountType, expectedMonthlyTransactions: input.expectedMonthlyTransactions, expectedMonthlyIncome: input.expectedMonthlyIncome, purpose: input.purpose },
    documents: [
      { type: 'PAN', status: 'Verified', fileLabel: 'pan-scan.jpg', extraction: docFields, documentQuality: 96, ocrConfidence: 97 },
      { type: 'Aadhaar', status: 'Verified', fileLabel: 'aadhaar-scan.jpg', extraction: docFields, documentQuality: 95, ocrConfidence: 96 },
      { type: 'Address Proof', status: 'Verified', fileLabel: 'address-proof.jpg', extraction: { Address: input.address }, documentQuality: 93, ocrConfidence: 95 },
      { type: 'Photograph', status: 'Verified', fileLabel: 'photo.jpg', extraction: { Quality: 'Clear, front-facing' }, documentQuality: 97, ocrConfidence: 98 },
    ],
    workflow: buildWorkflow(['Completed', 'Completed', 'Completed', 'Completed', 'Completed', 'Completed', 'Completed', 'Completed', 'Completed']),
    verificationChecks: [
      { label: 'Document quality', passed: true },
      { label: 'Name consistency', passed: true },
      { label: 'Date of birth consistency', passed: true },
      { label: 'Address consistency', passed: true },
      { label: 'Document completeness', passed: true },
      { label: 'Risk screening', passed: true },
    ],
    aiSummary: 'All submitted documents appear consistent and meet the expected verification criteria.',
    aiDecision: 'Eligible for automated onboarding workflow.',
    audit: [
      { time: new Date().toLocaleTimeString('en-IN', { hour12: false }), agent: 'Customer Assistant', event: 'Application submitted via new customer acquisition flow' },
      { time: new Date().toLocaleTimeString('en-IN', { hour12: false }), agent: 'Decision Agent', event: 'Recommended automated approval' },
    ],
  };

  addApplication(application);
  const customer = addCustomerFromApplication(application);
  return { application, customerId: customer.id };
}
