interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
}

export default function MetricCard({
  label,
  value,
  change,
  positive,
}: MetricCardProps) {
  return (
    <div className="glass rounded-lg p-5">
      <div className="text-xs font-medium tracking-wider text-slate-500">
        {label}
      </div>

      <div className="mt-3 text-3xl font-semibold tracking-tight text-white">
        {value}
      </div>

      {change && (
        <div
          className={`mt-2 text-xs ${
            positive ? "text-emerald-400" : "text-slate-400"
          }`}
        >
          {change}
        </div>
      )}
    </div>
  );
}

