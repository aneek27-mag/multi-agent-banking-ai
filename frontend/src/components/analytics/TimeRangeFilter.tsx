import { TIME_RANGES } from '../../data/analytics';
import { TimeRange } from '../../types/analytics';

export function TimeRangeFilter({ value, onChange }: { value: TimeRange; onChange: (range: TimeRange) => void }) {
  return (
    <div className="analytics-range-filter" role="group" aria-label="Time range">
      {TIME_RANGES.map((range) => (
        <button
          type="button"
          key={range.value}
          className={value === range.value ? 'active' : ''}
          onClick={() => onChange(range.value)}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
