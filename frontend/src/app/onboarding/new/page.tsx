import { BankingShell } from '../../../components/BankingShell';
import { NewApplicationWizard } from '../../../components/onboarding/NewApplicationWizard';

export default function NewOnboardingApplicationPage() {
  return (
    <BankingShell activePath="/onboarding">
      <NewApplicationWizard />
    </BankingShell>
  );
}
