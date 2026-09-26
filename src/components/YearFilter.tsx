import { strings } from "../config/strings";

interface YearFilterProps {
  years: number[];
  selectedYear: number;
  onSelect: (year: number) => void;
}

export default function YearFilter({ years, selectedYear, onSelect }: YearFilterProps) {
  return (
    <div className="filter-row" role="group" aria-label={strings.events.yearFilterLabel}>
      {years.map((year) => (
        <button
          key={year}
          type="button"
          className="chip"
          aria-pressed={year === selectedYear}
          onClick={() => onSelect(year)}
        >
          {year}
        </button>
      ))}
    </div>
  );
}
