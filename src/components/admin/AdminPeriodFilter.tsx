import { adminStrings } from "../../config/adminStrings";
import { monthNameFromKey } from "../../utils/date";

interface AdminPeriodFilterProps {
  years: string[];
  year: string;
  /** Month keys ("01".."12") present in the current status + year selection. */
  months: string[];
  month: string;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  onReset: () => void;
}

export default function AdminPeriodFilter({
  years,
  year,
  months,
  month,
  onYearChange,
  onMonthChange,
  onReset
}: AdminPeriodFilterProps) {
  const { period } = adminStrings;
  const dirty = year !== "ALL" || month !== "ALL";

  return (
    <div className="admin-period">
      <div className="admin-period-row" role="group" aria-label={period.yearLabel}>
        <span className="admin-period-label">{period.yearLabel}</span>
        <div className="admin-filter">
          {["ALL", ...years].map((value) => {
            const active = value === year;
            return (
              <button
                key={value}
                type="button"
                className={`admin-filter-chip admin-filter-chip--plain${active ? " is-active" : ""}`}
                aria-pressed={active}
                onClick={() => onYearChange(value)}
              >
                {value === "ALL" ? period.allYears : value}
              </button>
            );
          })}
        </div>
      </div>

      {months.length > 1 ? (
        <div className="admin-period-row" role="group" aria-label={period.monthLabel}>
          <span className="admin-period-label">{period.monthLabel}</span>
          <div className="admin-filter">
            {["ALL", ...months].map((value) => {
              const active = value === month;
              return (
                <button
                  key={value}
                  type="button"
                  className={`admin-filter-chip admin-filter-chip--plain${active ? " is-active" : ""}`}
                  aria-pressed={active}
                  onClick={() => onMonthChange(value)}
                >
                  {value === "ALL" ? period.allMonths : monthNameFromKey(value)}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {dirty ? (
        <button type="button" className="admin-period-reset" onClick={onReset}>
          {period.reset}
        </button>
      ) : null}
    </div>
  );
}
