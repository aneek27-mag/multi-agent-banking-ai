import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { AiAction } from '../../types/ai';

export function AIActionCard({ actions }: { actions: AiAction[] }) {
  if (!actions.length) return null;
  return (
    <div className="ai-actions">
      {actions.map((action) => (
        <Link className="ai-action-button" href={action.href} key={`${action.label}-${action.href}`}>
          {action.label}
          <ArrowUpRight size={12} />
        </Link>
      ))}
    </div>
  );
}
