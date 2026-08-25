import { BankingShell } from '../../components/BankingShell';
import { AnalyticsDashboard } from '../../components/analytics/AnalyticsDashboard';

export default function AnalyticsPage() {
  return (
    <BankingShell activePath="/analytics">
      <AnalyticsDashboard />
    </BankingShell>
  );
}
