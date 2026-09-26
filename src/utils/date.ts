import { MONTH_NAMES } from "../config/strings";

/** "2027-07-08" -> { year: 2027, month: 7, day: 8 } without timezone surprises. */
export function parseIsoDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month, day };
}

export function yearOf(iso: string): number {
  return parseIsoDate(iso).year;
}

/** "07" — stable key for grouping/filtering by month. */
export function monthKeyOf(iso: string): string {
  return iso.slice(5, 7);
}

export function monthNameOf(iso: string): string {
  return MONTH_NAMES[parseIsoDate(iso).month - 1];
}

export function monthNameFromKey(key: string): string {
  return MONTH_NAMES[Number(key) - 1];
}

function arabic(iso: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("ar", options).format(new Date(`${iso}T00:00:00`));
}

export function dayNumber(iso: string): string {
  return arabic(iso, { day: "numeric" });
}

export function yearNumber(iso: string): string {
  return arabic(iso, { year: "numeric" });
}

export function weekdayName(iso: string): string {
  return arabic(iso, { weekday: "long" });
}

/** "السبت، 8/7/2027" — weekday plus a numeric day/month/year date. */
export function formatLongDate(iso: string): string {
  const { year, month, day } = parseIsoDate(iso);
  return `${weekdayName(iso)}، ${day}/${month}/${year}`;
}

/** "تموز ٢٠٢٧" */
export function formatMonthYear(iso: string): string {
  return `${monthNameOf(iso)} ${yearNumber(iso)}`;
}

export function todayIso(now: Date = new Date()): string {
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export function isPastDate(iso: string, now: Date = new Date()): boolean {
  return iso < todayIso(now);
}
