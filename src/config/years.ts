/**
 * Year strategy for the year filter.
 *
 * Nothing is hardcoded per calendar year: the window is always derived from the
 * current year, so no code change is needed when the year rolls over. Only the
 * current year and future years are ever offered; future years that already exist
 * in the data are merged in.
 *
 * To switch to a backend-provided list later, replace getSelectableYears with a
 * call to that endpoint — this module is the only place that decides years.
 */
export const YEAR_WINDOW = {
  /** how far ahead residents can register */
  future: 2
} as const;

/**
 * Current year + future years only. Past years are never selectable, even if the
 * API returns events from them. Future years found in the data are merged in, so
 * an event registered five years ahead still gets a chip.
 */
export function getSelectableYears(
  extraYears: number[] = [],
  now: Date = new Date()
): number[] {
  const current = now.getFullYear();
  const years = new Set<number>();
  for (let y = current; y <= current + YEAR_WINDOW.future; y++) {
    years.add(y);
  }
  extraYears.filter((y) => y > current).forEach((y) => years.add(y));
  return [...years].sort((a, b) => a - b);
}

export function getDefaultYear(now: Date = new Date()): number {
  return now.getFullYear();
}

/** Latest date a resident may pick, used as the max of the date input. */
export function maxSelectableDate(now: Date = new Date()): string {
  return `${now.getFullYear() + YEAR_WINDOW.future}-12-31`;
}
