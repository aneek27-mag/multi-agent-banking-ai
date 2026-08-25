import { BankingShell } from '../../../components/BankingShell';
import { Customer360Loader } from '../../../components/CustomerIntelligence';
import { customerRecords } from '../../../data/customers';

export function generateStaticParams() {
  return customerRecords.map((customer) => ({ id: customer.id }));
}

export default async function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BankingShell activePath="/customers"><Customer360Loader id={id} /></BankingShell>;
}
