import { notFound } from 'next/navigation';
import { BankingShell, ModulePlaceholder } from '../../components/BankingShell';
import { moduleCopy } from '../../data/modulePlaceholders';

export function generateStaticParams() {
  return Object.keys(moduleCopy).map((module) => ({ module }));
}

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  const content = moduleCopy[module];
  if (!content) notFound();
  return <BankingShell activePath={`/${module}`}><ModulePlaceholder {...content} /></BankingShell>;
}
