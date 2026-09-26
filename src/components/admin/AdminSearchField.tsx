import { adminStrings } from "../../config/adminStrings";

interface AdminSearchFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function AdminSearchField({ value, onChange }: AdminSearchFieldProps) {
  const { search } = adminStrings;

  return (
    <div className="admin-search">
      <input
        className="input admin-search-input"
        type="search"
        value={value}
        placeholder={search.placeholder}
        aria-label={search.label}
        autoComplete="off"
        onChange={(event) => onChange(event.target.value)}
      />
      {value ? (
        <button
          type="button"
          className="admin-search-clear"
          aria-label={search.clear}
          onClick={() => onChange("")}
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
