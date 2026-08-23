import { notFound } from 'next/navigation';
import { BankingShell } from '../../../components/BankingShell';
import { Customer360View } from '../../../components/CustomerIntelligence';
import { customerRecords } from '../../../data/customers';

export function generateStaticParams() {
  return customerRecords.map((customer) => ({ id: customer.id }));
}

export default async function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = customerRecords.find((record) => record.id === id);
  if (!customer) notFound();
  return <BankingShell activePath="/customers"><Customer360View customer={customer} /></BankingShell>;
}
