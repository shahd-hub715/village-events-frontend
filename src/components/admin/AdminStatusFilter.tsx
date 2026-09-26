import { adminStrings } from "../../config/adminStrings";
import type { AdminStatusFilterValue } from "../../types/adminEvent";

interface AdminStatusFilterProps {
  value: AdminStatusFilterValue;
  counts: Record<AdminStatusFilterValue, number>;
  onChange: (value: AdminStatusFilterValue) => void;
}

const ORDER: AdminStatusFilterValue[] = ["ALL", "PENDING", "APPROVED", "REJECTED"];

export default function AdminStatusFilter({
  value,
  counts,
  onChange
}: AdminStatusFilterProps) {
  const { filters } = adminStrings;

  return (
    <div className="admin-filter" role="group" aria-label={filters.label}>
      {ORDER.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            className={`admin-filter-chip${active ? " is-active" : ""}`}
            aria-pressed={active}
            onClick={() => onChange(option)}
          >
            {filters.options[option]}
            <span className="admin-filter-count">{counts[option]}</span>
          </button>
        );
      })}
    </div>
  );
}
