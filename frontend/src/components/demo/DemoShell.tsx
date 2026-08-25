'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogOut, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import { DEMO_STAGES } from '../../data/demoScript';
import { DemoOverview } from './DemoOverview';
import { DemoProgress } from './DemoProgress';
import { DemoControls } from './DemoControls';
import { AcquisitionStage } from './stages/AcquisitionStage';
import { OnboardingStage } from './stages/OnboardingStage';
import { IntelligenceStage } from './stages/IntelligenceStage';
import { AgentDecisionStage } from './stages/AgentDecisionStage';
import { EngagementStage } from './stages/EngagementStage';
import { RiskStage } from './stages/RiskStage';
import { HumanReviewStage } from './stages/HumanReviewStage';
import { ExecutiveStage } from './stages/ExecutiveStage';

const LAST_STAGE = DEMO_STAGES.length - 1;

export function DemoShell() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [runId, setRunId] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [presenterNotes, setPresenterNotes] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);

  const goNext = useCallback(() => setCurrentStage((stage) => Math.min(stage + 1, LAST_STAGE)), []);
  const goPrev = useCallback(() => setCurrentStage((stage) => Math.max(stage - 1, 0)), []);
  const restart = useCallback(() => { setStarted(false); setCurrentStage(0); setPlaying(false); setRunId((id) => id + 1); }, []);
  const jumpTo = useCallback((index: number) => { setCurrentStage(index); setPlaying(false); }, []);
  const start = useCallback((index: number) => { setCurrentStage(index); setStarted(true); }, []);

  // Auto Demo: advance one stage after this stage's suggested presenter timing.
  useEffect(() => {
    if (!started || !playing || currentStage >= LAST_STAGE) return;
    const seconds = DEMO_STAGES[currentStage].autoPlaySeconds;
    const timer = setTimeout(() => setCurrentStage((stage) => Math.min(stage + 1, LAST_STAGE)), seconds * 1000);
    return () => clearTimeout(timer);
  }, [started, playing, currentStage]);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (event.key === 'Escape') { router.push('/'); return; }
      if (!started) return;
      if (event.key === 'ArrowRight') goNext();
      else if (event.key === 'ArrowLeft') goPrev();
      else if (event.key.toLowerCase() === 'r') restart();
    }
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [started, goNext, goPrev, restart, router]);

  const stageMeta = DEMO_STAGES[currentStage];

  return (
    <div className={`bank-shell demo-shell ${presentationMode ? 'presentation' : ''}`}>
      <header className="demo-header">
        <div className="demo-brand">
          <span className="bank-brand-mark"><Sparkles size={16} /></span>
          <span>Nexus</span>
          <span className="demo-badge">SIH Demo</span>
        </div>
        {started && <DemoProgress currentStage={currentStage} onJump={jumpTo} compact={presentationMode} />}
        <div className="demo-header-toggles">
          {started && (
            <button type="button" className={`demo-toggle ${presenterNotes ? 'on' : ''}`} onClick={() => setPresenterNotes((value) => !value)}>
              {presenterNotes ? <Eye size={13} /> : <EyeOff size={13} />}Presenter Notes
            </button>
          )}
          {started && (
            <button type="button" className={`demo-toggle ${presentationMode ? 'on' : ''}`} onClick={() => setPresentationMode((value) => !value)}>
              {presentationMode ? <Minimize2 size={13} /> : <Maximize2 size={13} />}Presentation Mode
            </button>
          )}
          <Link href="/" className="outline-action demo-exit"><LogOut size={14} />Exit Demo</Link>
        </div>
      </header>

      <main className="demo-main">
        {!started ? (
          <DemoOverview onStart={start} />
        ) : (
          <>
            <div className="demo-stage-heading">
              <p className="dashboard-eyebrow"><span className="status-pulse" />Agentic Banking Intelligence / demo environment</p>
              <h1>{stageMeta.title}</h1>
              <p>{stageMeta.subtitle}</p>
              {presenterNotes && <p className="demo-presenter-hint"><strong>Presenter note:</strong> {stageMeta.presenterHint}</p>}
            </div>

            <div key={`${runId}-${currentStage}`} className="demo-stage-content">
              {currentStage === 0 && <AcquisitionStage onNext={goNext} />}
              {currentStage === 1 && <OnboardingStage onNext={goNext} />}
              {currentStage === 2 && <IntelligenceStage onNext={goNext} />}
              {currentStage === 3 && <AgentDecisionStage onNext={goNext} />}
              {currentStage === 4 && <EngagementStage onNext={goNext} />}
              {currentStage === 5 && <RiskStage onNext={goNext} />}
              {currentStage === 6 && <HumanReviewStage onNext={goNext} />}
              {currentStage === 7 && <ExecutiveStage onRestart={restart} />}
            </div>
          </>
        )}
      </main>

      {started && (
        <footer className="demo-footer">
          <DemoControls
            currentStage={currentStage}
            totalStages={DEMO_STAGES.length}
            playing={playing}
            onPrev={goPrev}
            onNext={goNext}
            onTogglePlay={() => setPlaying((value) => !value)}
            onRestart={restart}
          />
        </footer>
      )}
    </div>
  );
}
