'use client';

import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { AGENT_PERFORMANCE, AI_INSIGHTS, ANOMALY_TYPES, AUTOMATION_BENCHMARKS, CROSS_MODULE_LINKS, EXECUTIVE_BRIEF, PRODUCT_OPPORTUNITIES, SEGMENTS } from '../../data/analytics';
import { downloadReport, getAcquisitionData, getDigitalAdoptionData, getEngagementData, getKPIs, getRiskData } from '../../services/analyticsService';
import { TimeRange } from '../../types/analytics';
import { TimeRangeFilter } from './TimeRangeFilter';
import { KpiCards } from './KpiCards';
import { AcquisitionSection } from './AcquisitionSection';
import { DigitalAdoptionSection } from './DigitalAdoptionSection';
import { SegmentationSection } from './SegmentationSection';
import { ProductOpportunitySection } from './ProductOpportunitySection';
import { EngagementSection } from './EngagementSection';
import { RiskSection } from './RiskSection';
import { AgentPerformanceSection } from './AgentPerformanceSection';
import { AutomationImpactSection } from './AutomationImpactSection';
import { ExecutiveBrief } from './ExecutiveBrief';
import { InsightsFeed } from './InsightsFeed';
import { CrossModuleLinks } from './CrossModuleLinks';

export function AnalyticsDashboard() {
  const [range, setRange] = useState<TimeRange>('30d');

  const kpis = useMemo(() => getKPIs(range), [range]);
  const acquisition = useMemo(() => getAcquisitionData(range), [range]);
  const digitalAdoption = useMemo(() => getDigitalAdoptionData(), []);
  const engagement = useMemo(() => getEngagementData(range), [range]);
  const risk = useMemo(() => getRiskData(range), [range]);

  return (
    <div className="analytics-page">
      <section className="analytics-heading">
        <div>
          <p className="dashboard-eyebrow"><span className="status-pulse" />Nexus intelligence / simulated environment</p>
          <h1>Banking Intelligence</h1>
          <p>Real-time intelligence across customers, acquisition, engagement, risk and AI operations.</p>
        </div>
        <div className="analytics-heading-actions">
          <TimeRangeFilter value={range} onChange={setRange} />
          <button type="button" className="outline-action" onClick={() => downloadReport(range)}><Download size={14} />Export Report</button>
        </div>
      </section>

      <KpiCards kpis={kpis} />

      <ExecutiveBrief range={range} summary={EXECUTIVE_BRIEF.summary} opportunities={EXECUTIVE_BRIEF.opportunities} />

      <div className="analytics-columns">
        <AcquisitionSection {...acquisition} />
        <SegmentationSection segments={SEGMENTS} />
      </div>

      <DigitalAdoptionSection data={digitalAdoption} />

      <ProductOpportunitySection opportunities={PRODUCT_OPPORTUNITIES} />

      <div className="analytics-columns">
        <EngagementSection data={engagement} />
        <RiskSection risk={risk} anomalies={ANOMALY_TYPES} />
      </div>

      <AgentPerformanceSection agents={AGENT_PERFORMANCE} />

      <AutomationImpactSection benchmarks={AUTOMATION_BENCHMARKS} />

      <InsightsFeed insights={AI_INSIGHTS} />

      <CrossModuleLinks links={CROSS_MODULE_LINKS} />
    </div>
  );
}
