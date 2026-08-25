import Link from 'next/link';
import { Activity, ArrowUpRight, BrainCircuit, MessageSquareText, ShieldCheck, Sparkles, Target, Users } from 'lucide-react';
import { useAllCustomers } from '../../state/demoStore';
import { AssistantCustomerContext } from '../../types/ai';

const capabilities = [
  { icon: BrainCircuit, label: 'Customer intelligence analysis' },
  { icon: Target, label: 'Product recommendation explainability' },
  { icon: ShieldCheck, label: 'Risk & compliance signal detection' },
  { icon: Activity, label: 'Portfolio-level insight' },
];

export function CustomerContext({ customer, customerId, onSelectCustomer }: { customer: AssistantCustomerContext | null; customerId: string | null; onSelectCustomer: (id: string | null) => void }) {
  const customerRecords = useAllCustomers();
  return (
    <aside className="ai-context">
      <div className="ai-context-panel">
        <p className="ai-context-label"><Users size={12} />Current context</p>
        <select
          className="ai-context-select"
          value={customerId ?? ''}
          onChange={(event) => onSelectCustomer(event.target.value || null)}
          aria-label="Select customer context"
        >
          <option value="">No customer selected</option>
          {customerRecords.map((record) => <option value={record.id} key={record.id}>{record.name}</option>)}
        </select>

        {customer ? (
          <>
            <div className="ai-context-identity">
              <span>{customer.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>
              <div>
                <strong>{customer.name}</strong>
                <small>{customer.id} · {customer.segment}</small>
              </div>
            </div>
            <div className="ai-context-stats">
              <ContextStat label="Customer health" value={customer.healthScore} />
              <ContextStat label="Digital engagement" value={customer.engagement} />
              <ContextStat label="Risk" value={customer.riskLevel} raw />
              <ContextStat label="AI opportunity" value={customer.opportunityScore} />
            </div>
            <Link className="ai-context-link" href={`/customers/${customer.id}`}>Open Customer 360<ArrowUpRight size={12} /></Link>
          </>
        ) : (
          <p className="ai-context-empty">Select a customer to ground the assistant&apos;s answers in their profile, or ask a portfolio-level question.</p>
        )}
      </div>

      <div className="ai-context-panel">
        <p className="ai-context-label"><Sparkles size={12} />AI capabilities</p>
        <ul className="ai-capabilities">
          {capabilities.map((capability) => (
            <li key={capability.label}><capability.icon size={13} />{capability.label}</li>
          ))}
        </ul>
      </div>

      <div className="ai-context-panel ai-context-note">
        <MessageSquareText size={14} />
        <p>Responses are demo analytics and recommendations, not financial decisions. Sensitive actions still require human review.</p>
      </div>
    </aside>
  );
}

function ContextStat({ label, value, raw }: { label: string; value: number | string; raw?: boolean }) {
  return (
    <div className="ai-context-stat">
      <span>{label}</span>
      <strong>{value}{!raw && <small>/100</small>}</strong>
    </div>
  );
}
