import { BankingShell } from '../../components/BankingShell';
import { SettingsView } from '../../components/SettingsView';

export default function SettingsPage() {
  return (
    <BankingShell activePath="/settings">
      <SettingsView />
    </BankingShell>
  );
}
