import { BankingShell } from '../../components/BankingShell';
import { AgentWorkspace } from '../../components/AgentWorkspace';

export default function AgentsPage() {
  return <BankingShell activePath="/agents"><AgentWorkspace /></BankingShell>;
}
