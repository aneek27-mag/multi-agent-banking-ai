import { workflowSteps } from '../data/agents';

export interface WorkflowUpdate {
  step: number;
  label: string;
  status: 'running' | 'complete';
}

const wait = (duration: number) => new Promise((resolve) => setTimeout(resolve, duration));

export async function* runBankingWorkflow(): AsyncGenerator<WorkflowUpdate> {
  for (let step = 0; step < workflowSteps.length; step += 1) {
    yield { step, label: workflowSteps[step], status: 'running' };
    await wait(650);
    yield { step, label: workflowSteps[step], status: 'complete' };
  }
}

export async function runAgentAction(agent: string, action: string) {
  await wait(450);
  return { agent, action, status: 'Completed' as const, time: new Date().toLocaleTimeString('en-IN', { hour12: false }) };
}
