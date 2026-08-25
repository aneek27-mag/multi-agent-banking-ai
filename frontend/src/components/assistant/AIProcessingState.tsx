'use client';

import { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';

export function AIProcessingState({ steps }: { steps: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeIndex >= steps.length - 1) return;
    const timer = setTimeout(() => setActiveIndex((index) => index + 1), 550);
    return () => clearTimeout(timer);
  }, [activeIndex, steps.length]);

  return (
    <div className="ai-processing" aria-live="polite">
      {steps.map((step, index) => {
        const state = index < activeIndex ? 'done' : index === activeIndex ? 'active' : 'pending';
        return (
          <div className={`ai-processing-step ${state}`} key={step}>
            <span className="ai-processing-icon">
              {state === 'done' ? <Check size={11} /> : state === 'active' ? <Loader2 size={11} className="ai-spin" /> : null}
            </span>
            <span>{step}</span>
          </div>
        );
      })}
    </div>
  );
}
