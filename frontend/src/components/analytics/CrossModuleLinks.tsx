import Link from 'next/link';
import { Bot, ChevronRight, FileCheck2, MessageSquareText, Network, ShieldAlert, Users } from 'lucide-react';
import { CrossModuleLink } from '../../types/analytics';

const ICONS: Record<string, typeof Bot> = { users: Users, 'shield-alert': ShieldAlert, message: MessageSquareText, network: Network, 'file-check': FileCheck2, bot: Bot };

export function CrossModuleLinks({ links }: { links: CrossModuleLink[] }) {
  return (
    <section className="dashboard-panel analytics-section analytics-cross-links" aria-label="Explore other modules">
      <div className="panel-heading">
        <div>
          <p>Connected intelligence</p>
          <h2>Take action across the platform</h2>
        </div>
      </div>
      <div className="analytics-cross-grid">
        {links.map((link) => {
          const Icon = ICONS[link.icon] ?? Bot;
          return (
            <Link href={link.href} className="analytics-cross-card" key={link.label}>
              <span className="analytics-cross-icon"><Icon size={15} /></span>
              <div>
                <strong>{link.label}</strong>
                <small>{link.description}</small>
              </div>
              <ChevronRight size={14} />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
