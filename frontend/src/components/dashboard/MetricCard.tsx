interface MetricCardProps {
  title: string;
  value: string;
  insight: string;
  isActive?: boolean;
}

export default function MetricCard({ title, value, insight, isActive = false }: MetricCardProps) {
  return (
    <div className={`p-6 flex flex-col justify-between h-40 ${isActive ? 'glass-panel-active' : 'glass-panel'}`}>
      <div className="flex justify-between items-start">
        <h3 className="text-on-surface-variant text-xs font-bold tracking-widest uppercase">
          {title}
        </h3>
        {/* Placeholder icon */}
        <div className="w-6 h-6 rounded bg-surface-bright flex items-center justify-center text-xs text-primary">
          📊
        </div>
      </div>
      
      <div>
        <div className="text-3xl font-bold text-white tracking-tight">
          {value}
        </div>
        <div className="text-xs font-medium text-[#00ff9d] mt-2 flex items-center gap-2">
          <span>↑</span> {insight}
        </div>
      </div>
    </div>
  );
}