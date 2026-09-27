import { useEffect, useRef } from "react";
import { EVENT_TYPE_OPTIONS } from "../config/strings";
import type { EventType } from "../types/event";

interface EventTypeDropdownProps {
  id: string;
  value: "" | EventType;
  placeholder: string;
  invalid?: boolean;
  onChange: (value: EventType) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ChevronIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 4.5L6 8L9.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function EventTypeDropdown({
  id,
  value,
  placeholder,
  invalid = false,
  onChange,
  open,
  onOpenChange
}: EventTypeDropdownProps) {
  const selected = EVENT_TYPE_OPTIONS.find((option) => option.value === value);
  const rootRef = useRef<HTMLDivElement>(null);

  const choose = (next: EventType) => {
    onChange(next);
    onOpenChange(false);
  };

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        !rootRef.current.contains(event.target)
      ) {
        onOpenChange(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open, onOpenChange]);

  return (
    <div className="event-type-dropdown" ref={rootRef}>
      <button
        type="button"
        id={id}
        className="input event-type-toggle"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={invalid}
        onClick={() => onOpenChange(!open)}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <ChevronIcon />
      </button>

      {open ? (
        <div className="numeric-date-menu" role="listbox">
          {EVENT_TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={value === option.value}
              className="numeric-date-option"
              onClick={() => choose(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
