import type { VillageEvent } from "../types/event";
import { countLabel, groupByMonth } from "../utils/events";
import EventCard from "./EventCard";

interface EventListProps {
  events: VillageEvent[];
}

export default function EventList({ events }: EventListProps) {
  const groups = groupByMonth(events);

  return (
    <div className="month-groups">
      {groups.map((group) => (
        <section className="month-group" key={group.key}>
          <div className="month-group-head">
            <h3 className="month-group-title">{group.label}</h3>
            <span className="month-group-count">{countLabel(group.events.length)}</span>
            <div className="month-group-rule" aria-hidden="true" />
          </div>
          <ul className="event-list">
            {group.events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
