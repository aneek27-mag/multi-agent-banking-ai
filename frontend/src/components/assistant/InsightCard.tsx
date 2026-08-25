import Link from 'next/link';
import { ChevronRight, Sparkles, Target } from 'lucide-react';
import { StructuredReply } from '../../types/ai';

export function InsightCard({ structured }: { structured: StructuredReply }) {
  const { insight, signals, recommendation, confidence, nextStep, customerList, customerListTitle, summary } = structured;
  const hasInsightBlock = insight || signals || recommendation || confidence !== undefined;

  return (
    <div className="ai-insight">
      {hasInsightBlock && (
        <div className="ai-insight-block">
          {insight && (
            <div className="ai-insight-row">
              <span>Insight</span>
              <p>{insight}</p>
            </div>
          )}
          {signals && signals.length > 0 && (
            <div className="ai-insight-row">
              <span>Key signals</span>
              <ul>{signals.map((signal) => <li key={signal}>{signal}</li>)}</ul>
            </div>
          )}
          {recommendation && (
            <div className="ai-insight-row ai-insight-recommendation">
              <span>Recommendation</span>
              <strong><Sparkles size={13} />{recommendation}</strong>
            </div>
          )}
          {confidence !== undefined && (
            <div className="ai-insight-row ai-confidence">
              <span>Confidence</span>
              <strong>{confidence}%</strong>
            </div>
          )}
        </div>
      )}

      {customerList && customerList.length > 0 && (
        <div className="ai-customer-list">
          {customerListTitle && <p className="ai-customer-list-title">{customerListTitle}</p>}
          {customerList.map((item, index) => (
            <div className="ai-customer-row" key={`${item.name}-${index}`}>
              <span className="ai-customer-rank">{index + 1}</span>
              <div className="ai-customer-info">
                {item.id ? (
                  <Link href={`/customers/${item.id}`}>{item.name}<ChevronRight size={12} /></Link>
                ) : (
                  <strong>{item.name}</strong>
                )}
                {item.detail && <small>{item.detail}</small>}
              </div>
              <div className="ai-customer-metric">
                <strong>{item.metric}</strong>
                <small>{item.metricLabel}</small>
              </div>
            </div>
          ))}
        </div>
      )}

      {summary && summary.length > 0 && (
        <div className="ai-summary-grid">
          {summary.map((item) => (
            <div className="ai-summary-item" key={item.label}>
              <Target size={13} />
              <div>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            </div>
          ))}
        </div>
      )}

      {nextStep && (
        <p className="ai-next-step"><Sparkles size={12} />{nextStep}</p>
      )}
    </div>
  );
}
