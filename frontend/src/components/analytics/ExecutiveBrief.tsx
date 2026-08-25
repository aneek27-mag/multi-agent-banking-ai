'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Bot, Loader2, RefreshCcw, Sparkles } from 'lucide-react';
import { generateExecutiveBrief } from '../../services/analyticsService';
import { TimeRange } from '../../types/analytics';

export function ExecutiveBrief({ range, summary, opportunities }: { range: TimeRange; summary: string; opportunities: string[] }) {
  const [liveSummary, setLiveSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function regenerate() {
    setLoading(true);
    const result = await generateExecutiveBrief(range);
    setLiveSummary(result.summary);
    setLoading(false);
  }

  return (
    <section className="insight-panel analytics-brief-panel" id="executive-brief">
      <div className="insight-title"><Sparkles size={17} /><h2>AI Executive Brief</h2></div>
      <p className="analytics-brief-kicker">Today&apos;s intelligence</p>
      <p className="analytics-brief-summary">{liveSummary ?? summary}</p>

      <strong>Key opportunities</strong>
      <ul className="analytics-opportunity-arrows">
        {opportunities.map((opportunity) => <li key={opportunity}><ArrowRight size={13} />{opportunity}</li>)}
      </ul>

      <div className="analytics-brief-actions">
        <Link href="/assistant" className="primary-action"><Bot size={14} />Ask AI About This Report</Link>
        <button type="button" className="outline-action" onClick={regenerate} disabled={loading}>
          {loading ? <Loader2 size={13} className="ai-spin" /> : <RefreshCcw size={13} />}
          {loading ? 'Generating…' : 'Regenerate with live AI'}
        </button>
      </div>
    </section>
  );
}
