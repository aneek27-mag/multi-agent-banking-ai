import { BankingShell } from '../../components/BankingShell';
import { CustomerListView } from '../../components/CustomerIntelligence';

export default function CustomersPage() {
  return <BankingShell activePath="/customers"><CustomerListView /></BankingShell>;
}
