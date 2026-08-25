import { BankingShell } from '../../../components/BankingShell';
import { ApplicationDetail } from '../../../components/onboarding/ApplicationDetail';

export default async function OnboardingApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <BankingShell activePath="/onboarding">
      <ApplicationDetail id={id} />
    </BankingShell>
  );
}
