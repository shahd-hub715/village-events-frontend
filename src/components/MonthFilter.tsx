import { strings } from "../config/strings";
import { monthNameFromKey } from "../utils/date";

interface MonthFilterProps {
  monthKeys: string[];
  selectedMonth: string | null;
  onSelect: (monthKey: string | null) => void;
}

export default function MonthFilter({
  monthKeys,
  selectedMonth,
  onSelect
}: MonthFilterProps) {
  if (monthKeys.length < 2) return null;

  return (
    <div
      className="filter-row filter-row--months"
      role="group"
      aria-label={strings.events.monthFilterLabel}
    >
      <button
        type="button"
        className="chip chip--month"
        aria-pressed={selectedMonth === null}
        onClick={() => onSelect(null)}
      >
        {strings.events.allMonths}
      </button>
      {monthKeys.map((key) => (
        <button
          key={key}
          type="button"
          className="chip chip--month"
          aria-pressed={selectedMonth === key}
          onClick={() => onSelect(key)}
        >
          {monthNameFromKey(key)}
          <span className="chip-num" aria-hidden="true">
            / {Number(key)}
          </span>
        </button>
      ))}
    </div>
  );
}
