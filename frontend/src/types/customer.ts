export type CustomerKyc = 'Verified' | 'In review' | 'Needs attention';
export type CustomerRisk = 'Low' | 'Medium' | 'High';

export interface CustomerRecord {
  id: string;
  name: string;
  initials: string;
  age: number;
  city: string;
  occupation: string;
  monthlyIncome: number;
  accountType: string;
  balance: number;
  engagement: number;
  riskScore: number;
  riskLevel: CustomerRisk;
  segment: string;
  kycStatus: CustomerKyc;
  products: string[];
  lastActive: string;
  opportunityScore: number;
  healthScore: number;
}

export interface CustomerRecommendation {
  product: string;
  relevance: number;
  confidence: number;
  reason: string;
  benefit: string;
}
