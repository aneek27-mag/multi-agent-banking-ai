import { Zap } from 'lucide-react';
import { AutomationBenchmark } from '../../types/analytics';

export function AutomationImpactSection({ benchmarks }: { benchmarks: AutomationBenchmark[] }) {
  return (
    <section className="dashboard-panel analytics-section analytics-automation" id="automation-impact">
      <div className="panel-heading">
        <div>
          <p>Business impact</p>
          <h2>AI automation impact</h2>
        </div>
        <span className="panel-caption">Simulated benchmark values</span>
      </div>

      <div className="analytics-automation-grid">
        {benchmarks.map((benchmark) => (
          <div className="analytics-automation-card" key={benchmark.process}>
            <strong>{benchmark.process}</strong>
            <div className="analytics-automation-row"><span>Manual</span><em>{benchmark.manual}</em></div>
            <div className="analytics-automation-row analytics-automation-ai"><span><Zap size={11} />AI-assisted</span><em>{benchmark.ai}</em></div>
            <div className="analytics-automation-improvement">−{benchmark.improvementPct}% time</div>
          </div>
        ))}
      </div>
    </section>
  );
}
