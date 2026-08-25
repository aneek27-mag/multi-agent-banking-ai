import Link from 'next/link';
import { ChevronLeft, ChevronRight, LogOut, Pause, Play, RotateCcw } from 'lucide-react';

export function DemoControls({
  currentStage,
  totalStages,
  playing,
  onPrev,
  onNext,
  onTogglePlay,
  onRestart,
}: {
  currentStage: number;
  totalStages: number;
  playing: boolean;
  onPrev: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  onRestart: () => void;
}) {
  const isFirst = currentStage === 0;
  const isLast = currentStage === totalStages - 1;

  return (
    <div className="demo-controls">
      <div className="demo-controls-group">
        <button type="button" className="outline-action" onClick={onPrev} disabled={isFirst}><ChevronLeft size={14} />Previous</button>
        <button type="button" className="outline-action" onClick={onNext} disabled={isLast}>Next<ChevronRight size={14} /></button>
      </div>
      <div className="demo-controls-group">
        <button type="button" className="primary-action" onClick={onTogglePlay} disabled={isLast && !playing}>
          {playing ? <Pause size={14} /> : <Play size={14} />}
          {playing ? 'Pause Demo' : 'Play Demo'}
        </button>
        <button type="button" className="outline-action" onClick={onRestart}><RotateCcw size={14} />Restart</button>
        <Link href="/" className="outline-action demo-exit"><LogOut size={14} />Exit Demo</Link>
      </div>
    </div>
  );
}
