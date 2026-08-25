import { ArrowRight, ChevronDown, Play } from 'lucide-react';
import { DEMO_STAGES } from '../../data/demoScript';

export function DemoOverview({ onStart }: { onStart: (index: number) => void }) {
  return (
    <div className="demo-overview">
      <p className="dashboard-eyebrow"><span className="status-pulse" />SIH Demo Mode / presentation layer</p>
      <h1>Agentic Banking Intelligence</h1>
      <p className="demo-overview-subtitle">End-to-end AI-powered customer lifecycle demonstration</p>

      <div className="demo-overview-flow">
        {DEMO_STAGES.map((stage, index) => (
          <div className="demo-overview-flow-item-wrap" key={stage.id}>
            <button type="button" className="demo-overview-flow-item" onClick={() => onStart(index)}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{stage.title.split('· ')[1] ?? stage.title}</strong>
            </button>
            {index < DEMO_STAGES.length - 1 && <ChevronDown className="demo-overview-arrow" size={16} />}
          </div>
        ))}
      </div>

      <button type="button" className="primary-action demo-overview-start" onClick={() => onStart(0)}>
        <Play size={15} />Start Demo<ArrowRight size={14} />
      </button>
    </div>
  );
}
