import { AuditEvent } from '../../types/onboarding';

export function AuditLog({ events }: { events: AuditEvent[] }) {
  return (
    <section className="detail-panel onb-audit-panel">
      <div className="detail-heading">
        <div>
          <p>Governance</p>
          <h2>Audit log</h2>
        </div>
        <span className="panel-caption">{events.length} events</span>
      </div>
      <div className="onb-audit-list">
        {events.map((event, index) => (
          <div className="timeline-item" key={`${event.time}-${index}`}>
            <span className="timeline-dot" />
            <div>
              <time>{event.time}</time>
              <p><strong>{event.agent}</strong> · {event.event}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
