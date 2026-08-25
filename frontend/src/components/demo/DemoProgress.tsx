import { Check } from 'lucide-react';
import { DEMO_STAGES } from '../../data/demoScript';

export function DemoProgress({ currentStage, onJump, compact }: { currentStage: number; onJump: (index: number) => void; compact: boolean }) {
  return (
    <nav className={`demo-progress ${compact ? 'compact' : ''}`} aria-label="Demo progress">
      {DEMO_STAGES.map((stage, index) => (
        <button
          type="button"
          key={stage.id}
          className={`demo-progress-step ${index < currentStage ? 'done' : index === currentStage ? 'active' : ''}`}
          onClick={() => onJump(index)}
        >
          <span className="demo-progress-dot">{index < currentStage ? <Check size={11} /> : String(index + 1).padStart(2, '0')}</span>
          {!compact && <span className="demo-progress-label">{stage.shortLabel}</span>}
        </button>
      ))}
    </nav>
  );
}
