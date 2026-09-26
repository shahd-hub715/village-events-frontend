import { strings } from "../config/strings";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchField({ value, onChange }: SearchFieldProps) {
  return (
    <div className="search">
      <input
        type="search"
        className="input search-input"
        value={value}
        placeholder={strings.events.searchPlaceholder}
        aria-label={strings.events.searchLabel}
        onChange={(event) => onChange(event.target.value)}
      />
      {value ? (
        <button
          type="button"
          className="search-clear"
          aria-label={strings.events.searchClear}
          onClick={() => onChange("")}
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
