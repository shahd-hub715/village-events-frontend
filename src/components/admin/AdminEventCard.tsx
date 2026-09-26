import AdminStatusBadge from "./AdminStatusBadge";
import { adminStrings } from "../../config/adminStrings";
import { EVENT_TYPE_LABELS } from "../../config/strings";
import type { AdminEvent } from "../../types/adminEvent";
import { formatSubmittedAt } from "../../utils/adminDate";
import {
  dayNumber,
  formatLongDate,
  monthNameOf,
  yearNumber
} from "../../utils/date";

interface AdminEventCardProps {
  event: AdminEvent;
  busy: boolean;
  /** Shown on a PENDING card inside the archive so it doesn't read as a duplicate. */
  duplicateHint?: boolean;
  onApprove: (event: AdminEvent) => void;
  onReject: (event: AdminEvent) => void;
  onEdit: (event: AdminEvent) => void;
  onDelete: (event: AdminEvent) => void;
}

export default function AdminEventCard({
  event,
  busy,
  duplicateHint = false,
  onApprove,
  onReject,
  onEdit,
  onDelete
}: AdminEventCardProps) {
  const { card, actions, all } = adminStrings;
  const submittedAt = formatSubmittedAt(event.createdAt);

  const isPending = event.status === "PENDING";
  const isApproved = event.status === "APPROVED";
  const isRejected = event.status === "REJECTED";

  return (
    <li className="admin-card">
      <div className="admin-card-head">
        <div className="admin-card-date" aria-hidden="true">
          <span className="event-day">
            {dayNumber(event.eventDate)}
          </span>

          <span className="event-month">
            {monthNameOf(event.eventDate)}
          </span>

          <span className="event-year">
            {yearNumber(event.eventDate)}
          </span>
        </div>

        <div className="admin-card-ident">
          <h3 className="admin-card-name">
            {event.personName}
          </h3>

          <div className="admin-card-tags">
            <span className="event-type">
              {EVENT_TYPE_LABELS[event.eventType]}
            </span>

            <AdminStatusBadge status={event.status} />

            {duplicateHint ? (
              <span className="admin-card-hint">
                {all.alsoAbove}
              </span>
            ) : null}
          </div>

          <span className="admin-card-meta">
            {formatLongDate(event.eventDate)}
          </span>

          {isPending && event.hasDateConflict ? (
            <span className="admin-conflict">
              <span
                className="admin-conflict-dot"
                aria-hidden="true"
              />

              {event.sameDateCount === 1
                ? "يوجد مناسبة أخرى بهذا التاريخ"
                : `يوجد ${event.sameDateCount} مناسبات أخرى بهذا التاريخ`}
            </span>
          ) : null}
        </div>

        {submittedAt ? (
          <span
            className="admin-card-submitted"
            title={card.createdAt}
          >
            {card.submittedPrefix} {submittedAt}
          </span>
        ) : null}
      </div>

      <dl className="admin-fields admin-fields--single">
        <div className="admin-field">
          <dt>{card.location}</dt>
          <dd>{event.location ?? card.none}</dd>
        </div>

        <div className="admin-field">
          <dt>{card.notes}</dt>
          <dd className={event.notes ? "" : "admin-value--quiet"}>
            {event.notes ?? card.noNotes}
          </dd>
        </div>
      </dl>

      <div className="admin-private">
        <span className="admin-private-label">
          {card.privateLabel}
        </span>

        <dl className="admin-fields">
          <div className="admin-field">
            <dt>{card.contactPhone}</dt>

            <dd>
              <a
                className="admin-phone"
                href={`tel:${event.contactPhone}`}
                dir="ltr"
              >
                {event.contactPhone}
              </a>
            </dd>
          </div>
        </dl>
      </div>

      <div className="admin-actions">
        {isPending || isRejected ? (
          <button
            type="button"
            className="btn btn-primary btn-small"
            disabled={busy}
            onClick={() => onApprove(event)}
          >
            {isRejected
              ? actions.republish
              : actions.approve}
          </button>
        ) : null}

        {isPending || isApproved ? (
          <button
            type="button"
            className="btn btn-quiet"
            disabled={busy}
            onClick={() => onReject(event)}
          >
            {isApproved
              ? actions.unpublish
              : actions.reject}
          </button>
        ) : null}

        <button
          type="button"
          className="btn btn-quiet"
          disabled={busy}
          onClick={() => onEdit(event)}
        >
          {actions.edit}
        </button>

        <button
          type="button"
          className="btn btn-danger"
          disabled={busy}
          onClick={() => onDelete(event)}
        >
          {actions.delete}
        </button>

        {busy ? (
          <span className="admin-busy">
            {actions.working}
          </span>
        ) : null}
      </div>
    </li>
  );
}