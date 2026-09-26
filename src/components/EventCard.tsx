import { EVENT_TYPE_LABELS, strings } from "../config/strings";
import type { VillageEvent } from "../types/event";
import { dayNumber, formatLongDate, monthNameOf, yearNumber } from "../utils/date";

interface EventCardProps {
  event: VillageEvent;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <li className="event-card">
      <div className="event-date" aria-hidden="true">
        <span className="event-day">{dayNumber(event.eventDate)}</span>
        <span className="event-month">{monthNameOf(event.eventDate)}</span>
        <span className="event-year">{yearNumber(event.eventDate)}</span>
      </div>
      <div className="event-body">
        <div className="event-head">
          <h3 className="event-name">{event.personName}</h3>
          <span className="event-type">{EVENT_TYPE_LABELS[event.eventType]}</span>
        </div>
        <span className="event-meta">{formatLongDate(event.eventDate)}</span>
        {event.location ? (
          <span className="event-meta">
            {strings.events.locationPrefix} {event.location}
          </span>
        ) : null}
        {event.notes && event.notes.trim() ? (
          <span className="event-notes">
            <span className="event-notes-label">{strings.events.notesLabel}</span>
            {event.notes.trim()}
          </span>
        ) : null}
      </div>
    </li>
  );
}
