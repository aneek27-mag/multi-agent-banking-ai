import { BankingShell } from '../../components/BankingShell';
import { CustomerListView } from '../../components/CustomerIntelligence';

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ segment?: string; risk?: string; kyc?: string }> }) {
  const { segment, risk, kyc } = await searchParams;
  return (
    <BankingShell activePath="/customers">
      <CustomerListView initialSegment={segment ?? null} initialRisk={risk ?? null} initialKyc={kyc ?? null} />
    </BankingShell>
  );
}
