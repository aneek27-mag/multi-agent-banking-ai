export type ApplicationStatus = 'New' | 'In Progress' | 'Completed' | 'Human Review' | 'Rejected';
export type DocumentType = 'PAN' | 'Aadhaar' | 'Address Proof' | 'Photograph';
export type DocumentStatus = 'Pending' | 'Processing' | 'Verified' | 'Requires Review' | 'Failed';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type WorkflowStepStatus = 'Completed' | 'Processing' | 'Pending' | 'Requires Review' | 'Failed';
export type ReviewCaseStatus = 'Awaiting review' | 'Approved' | 'Correction requested' | 'Escalated';

export interface AiDocumentFlag {
  issue: string;
  detail: string;
  confidence: number;
  risk: RiskLevel;
  recommendation: string;
}

export interface OnboardingDocument {
  type: DocumentType;
  status: DocumentStatus;
  fileLabel: string;
  extraction?: Record<string, string>;
  documentQuality?: number;
  ocrConfidence?: number;
  flag?: AiDocumentFlag | null;
}

export interface WorkflowStep {
  id: string;
  label: string;
  status: WorkflowStepStatus;
  detail: string;
}

export interface AuditEvent {
  time: string;
  agent: string;
  event: string;
}

export interface VerificationCheck {
  label: string;
  passed: boolean;
}

export interface PersonalInfo {
  dob: string;
  phone: string;
  email: string;
  address: string;
  occupation: string;
}

export interface AccountRequest {
  accountType: string;
  expectedMonthlyTransactions: number;
  expectedMonthlyIncome: number;
  purpose: string;
}

export interface OnboardingApplication {
  id: string;
  customerName: string;
  initials: string;
  submitted: string;
  accountType: string;
  documents: OnboardingDocument[];
  kycStatus: ApplicationStatus;
  aiConfidence: number;
  risk: RiskLevel;
  processingTime: string;
  currentStep: string;
  documentsComplete: number;
  documentsRequired: number;
  personal: PersonalInfo;
  accountRequest: AccountRequest;
  workflow: WorkflowStep[];
  verificationChecks: VerificationCheck[];
  aiSummary: string;
  aiDecision: string;
  audit: AuditEvent[];
  hasMismatch: boolean;
  processed: boolean;
  convertedToCustomerId?: string;
}

export interface ReviewCase {
  applicationId: string;
  customerName: string;
  issue: string;
  aiConfidence: number;
  priority: 'Low' | 'Medium' | 'High';
  waiting: string;
  status: ReviewCaseStatus;
}

export interface FunnelStage {
  label: string;
  value: number;
}

export interface DropOffInsight {
  stage: string;
  dropOffPct: number;
  reasons: string[];
  recommendation: string;
}
