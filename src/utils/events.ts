import { strings } from "../config/strings";
import type { VillageEvent } from "../types/event";
import { formatMonthYear, monthKeyOf } from "./date";

export interface MonthGroup {
  key: string;
  label: string;
  events: VillageEvent[];
}

export function sortByDate(events: VillageEvent[]): VillageEvent[] {
  return [...events].sort((a, b) => a.eventDate.localeCompare(b.eventDate));
}

export function monthKeysOf(events: VillageEvent[]): string[] {
  const keys: string[] = [];
  events.forEach((event) => {
    const key = monthKeyOf(event.eventDate);
    if (!keys.includes(key)) keys.push(key);
  });
  return keys.sort();
}

export function filterByMonth(
  events: VillageEvent[],
  monthKey: string | null
): VillageEvent[] {
  if (!monthKey) return events;
  return events.filter((event) => monthKeyOf(event.eventDate) === monthKey);
}

import { EVENT_TYPE_LABELS } from "../config/strings";

function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه");
}

/** Matches person name, location, notes and the Arabic event-type label. */
export function filterBySearch(
  events: VillageEvent[],
  term: string
): VillageEvent[] {
  const query = normalize(term);
  if (!query) return events;
  return events.filter((event) => {
    const haystack = [
      event.personName,
      event.location ?? "",
      event.notes ?? "",
      EVENT_TYPE_LABELS[event.eventType]
    ]
      .map(normalize)
      .join(" ");
    return haystack.includes(query);
  });
}

export function groupByMonth(events: VillageEvent[]): MonthGroup[] {
  const groups: MonthGroup[] = [];
  sortByDate(events).forEach((event) => {
    const key = event.eventDate.slice(0, 7);
    let group = groups.find((candidate) => candidate.key === key);
    if (!group) {
      group = { key, label: formatMonthYear(event.eventDate), events: [] };
      groups.push(group);
    }
    group.events.push(event);
  });
  return groups;
}

export function countLabel(count: number): string {
  return count === 1 ? strings.events.one : strings.events.many(count);
}
