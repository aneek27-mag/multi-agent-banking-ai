import { BankingShell } from '../../components/BankingShell';
import { AssistantShell } from '../../components/assistant/AssistantShell';

export default async function AssistantPage({ searchParams }: { searchParams: Promise<{ customer?: string }> }) {
  const { customer } = await searchParams;
  return (
    <BankingShell activePath="/assistant">
      <AssistantShell initialCustomerId={customer ?? null} />
    </BankingShell>
  );
}
