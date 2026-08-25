import { BankingShell } from '../../components/BankingShell';
import { OnboardingDashboard } from '../../components/onboarding/OnboardingDashboard';

export default function OnboardingPage() {
  return (
    <BankingShell activePath="/onboarding">
      <OnboardingDashboard />
    </BankingShell>
  );
}
