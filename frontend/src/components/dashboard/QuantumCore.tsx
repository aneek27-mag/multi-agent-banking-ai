interface QuantumCoreProps {
  score: number;
  status: string;
  onExecute?: () => void;
}

export default function QuantumCore({ score, status }: QuantumCoreProps) {
  // Helper to generate the text below the score
  const getScoreLabel = (s: number) => {
    if (s >= 800) return 'EXCELLENT';
    if (s >= 700) return 'GOOD';
    if (s >= 600) return 'FAIR';
    return 'NEEDS ATTENTION';
  };

  // Map the generic system status to a Risk Level as shown in the design
  const riskLevel = status === 'OPTIMAL' ? 'Minimal' : status === 'DEGRADED' ? 'Moderate' : 'High';
  const statusColor = status === 'OPTIMAL' ? '#00ff9d' : status === 'DEGRADED' ? '#ffb4ab' : '#93000a';

  return (
    <div className="glass-panel p-6 flex flex-col justify-between h-full min-h-[350px]">
      {/* Header Row */}
      <div className="flex justify-between items-start">
        <h3 className="text-on-surface text-lg font-bold flex items-center gap-2">
          <span className="text-primary-fixed">📊</span> Nexus Score
        </h3>
        
        <div className="bg-surface-container border border-white/5 px-3 py-1 rounded-full flex items-center gap-2">
          <span className="text-xs font-semibold" style={{ color: statusColor }}>
            Risk Level: {riskLevel}
          </span>
        </div>
      </div>

      {/* Central Circular Gauge */}
      <div className="flex-1 flex flex-col items-center justify-center my-6">
        <div className="relative w-40 h-40 rounded-full border-4 border-surface-container flex items-center justify-center shadow-inner">
          {/* The Cyan Progress Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary border-l-primary -rotate-45 shadow-[0_0_15px_rgba(0,229,255,0.15)] transition-transform duration-1000"></div>
          
          <div className="text-center z-10 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-white tracking-tighter">
              {Math.round(score)}
            </div>
            <div className="text-[10px] text-primary mt-1 uppercase tracking-widest font-bold">
              {getScoreLabel(score)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Subdued Footer */}
      <div className="mt-auto">
        <span className="text-[10px] text-on-surface-variant font-bold tracking-widest uppercase">
          AI Insights
        </span>
      </div>
    </div>
  );
}