export interface ModulePlaceholderContent {
  title: string;
  description: string;
  cta?: { label: string; href: string };
}

export const moduleCopy: Record<string, ModulePlaceholderContent> = {
  customers: { title: 'Customers', description: 'Search and segment the full customer portfolio by intent, adoption, KYC, and risk.' },
  agents: { title: 'Agent Workflow', description: 'Observe the acquisition, intelligence, recommendation, engagement, and risk agents working together.' },
  engagement: { title: 'Engagement', description: 'Track customer journeys, campaign response, digital adoption, and reactivation opportunities.', cta: { label: 'View engagement analytics', href: '/analytics#engagement' } },
  risk: { title: 'Risk & Fraud', description: 'Surface early risk signals and route sensitive cases to a human review queue.', cta: { label: 'View risk intelligence', href: '/analytics#risk' } },
};
