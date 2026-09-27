import { useEffect, useMemo, useRef, useState } from "react";

type PickerType = "day" | "month" | "year" | null;

interface NumericDatePickerProps {
  id: string;
  value: string;
  min: string;
  max: string;
  invalid?: boolean;
  onChange: (value: string) => void;
  /** Omit for a self-contained picker; pass both to coordinate with a sibling menu (e.g. only one dropdown open at a time). */
  openPicker?: PickerType;
  onOpenPickerChange?: (next: PickerType) => void;
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
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

export default function NumericDatePicker({
  id,
  value,
  min,
  max,
  invalid = false,
  onChange,
  openPicker: controlledOpenPicker,
  onOpenPickerChange
}: NumericDatePickerProps) {
  const initial = value ? value.split("-").map(Number) : [];

  const [year, setYear] = useState<number | "">(initial[0] || "");
  const [month, setMonth] = useState<number | "">(initial[1] || "");
  const [day, setDay] = useState<number | "">(initial[2] || "");
  const [uncontrolledOpenPicker, setUncontrolledOpenPicker] = useState<PickerType>(null);

  const isControlled = controlledOpenPicker !== undefined;
  const openPicker = isControlled ? controlledOpenPicker : uncontrolledOpenPicker;
  const setOpenPicker = isControlled ? onOpenPickerChange! : setUncontrolledOpenPicker;

  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openPicker === null) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        !rootRef.current.contains(event.target)
      ) {
        setOpenPicker(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [openPicker, setOpenPicker]);

  const minYear = Number(min.slice(0, 4));
  const maxYear = Number(max.slice(0, 4));

  const years = useMemo(
    () =>
      Array.from(
        { length: maxYear - minYear + 1 },
        (_, index) => minYear + index
      ),
    [minYear, maxYear]
  );

  const maxDays =
    year && month ? daysInMonth(Number(year), Number(month)) : 31;

  const days = Array.from(
    { length: maxDays },
    (_, index) => index + 1
  );

  const months = Array.from(
    { length: 12 },
    (_, index) => index + 1
  );

  const commitDate = (
    nextDay: number | "",
    nextMonth: number | "",
    nextYear: number | ""
  ) => {
    if (!nextDay || !nextMonth || !nextYear) return;

    const iso = `${nextYear}-${pad(nextMonth)}-${pad(nextDay)}`;

    if (iso >= min && iso <= max) {
      onChange(iso);
    }
  };

  const chooseDay = (next: number) => {
    setDay(next);
    setOpenPicker(null);
    commitDate(next, month, year);
  };

  const chooseMonth = (next: number) => {
    setMonth(next);

    const nextMaxDays =
      year ? daysInMonth(Number(year), next) : 31;

    const safeDay =
      day && Number(day) > nextMaxDays ? "" : day;

    if (safeDay !== day) {
      setDay("");
    }

    setOpenPicker(null);
    commitDate(safeDay, next, year);
  };

  const chooseYear = (next: number) => {
    setYear(next);

    const nextMaxDays =
      month ? daysInMonth(next, Number(month)) : 31;

    const safeDay =
      day && Number(day) > nextMaxDays ? "" : day;

    if (safeDay !== day) {
      setDay("");
    }

    setOpenPicker(null);
    commitDate(safeDay, month, next);
  };

  return (
    <div
      id={id}
      ref={rootRef}
      className="numeric-date-picker"
      aria-invalid={invalid}
    >
      <div className="numeric-date-panel">
        <div className="numeric-date-column">
          <button
            type="button"
            className="input numeric-date-button"
            onClick={() =>
              setOpenPicker(openPicker === "day" ? null : "day")
            }
          >
            <span>{day ? pad(Number(day)) : "اليوم"}</span>
            <ChevronIcon />
          </button>

          {openPicker === "day" ? (
            <div className="numeric-date-menu">
              {days.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="numeric-date-option"
                  onClick={() => chooseDay(item)}
                >
                  {pad(item)}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="numeric-date-column">
          <button
            type="button"
            className="input numeric-date-button"
            onClick={() =>
              setOpenPicker(openPicker === "month" ? null : "month")
            }
          >
            <span>{month ? pad(Number(month)) : "الشهر"}</span>
            <ChevronIcon />
          </button>

          {openPicker === "month" ? (
            <div className="numeric-date-menu">
              {months.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="numeric-date-option"
                  onClick={() => chooseMonth(item)}
                >
                  {pad(item)}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="numeric-date-column">
          <button
            type="button"
            className="input numeric-date-button"
            onClick={() =>
              setOpenPicker(openPicker === "year" ? null : "year")
            }
          >
            <span>{year || "السنة"}</span>
            <ChevronIcon />
          </button>

          {openPicker === "year" ? (
            <div className="numeric-date-menu">
              {years.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="numeric-date-option"
                  onClick={() => chooseYear(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}