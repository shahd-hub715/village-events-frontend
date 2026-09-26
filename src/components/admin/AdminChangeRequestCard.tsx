import { adminStrings } from "../../config/adminStrings";
import { CHANGE_REQUEST_TYPE_LABELS } from "../../config/strings";
import type { AdminChangeRequest } from "../../types/adminChangeRequest";
import { formatSubmittedAt } from "../../utils/adminDate";
import { dayNumber, formatLongDate, monthNameOf, yearNumber } from "../../utils/date";

interface AdminChangeRequestCardProps {
  request: AdminChangeRequest;
  busy: boolean;
  onResolve: (request: AdminChangeRequest) => void;
}

export default function AdminChangeRequestCard({
  request,
  busy,
  onResolve
}: AdminChangeRequestCardProps) {
  const { card, changeRequests: t } = adminStrings;
  const submittedAt = formatSubmittedAt(request.createdAt);
  // reuse the existing badge tints: amber for edit, red for delete
  const badgeTone = request.requestType === "DELETE" ? "rejected" : "pending";

  return (
    <li className="admin-card">
      <div className="admin-card-head">
        <div className="admin-card-date" aria-hidden="true">
          <span className="event-day">{dayNumber(request.eventDate)}</span>
          <span className="event-month">{monthNameOf(request.eventDate)}</span>
          <span className="event-year">{yearNumber(request.eventDate)}</span>
        </div>
        <div className="admin-card-ident">
          <h3 className="admin-card-name">{request.personName}</h3>
          <div className="admin-card-tags">
            <span className={`admin-badge admin-badge--${badgeTone}`}>
              {t.typePrefix} {CHANGE_REQUEST_TYPE_LABELS[request.requestType]}
            </span>
          </div>
          <span className="admin-card-meta">{formatLongDate(request.eventDate)}</span>
        </div>
        {submittedAt ? (
          <span className="admin-card-submitted" title={card.createdAt}>
            {card.submittedPrefix} {submittedAt}
          </span>
        ) : null}
      </div>

      <dl className="admin-fields">
        <div className="admin-field admin-field--wide">
          <dt>{t.details}</dt>
          <dd className="cr-details">{request.requestedChanges}</dd>
        </div>
      </dl>

      <div className="admin-private">
        <span className="admin-private-label">{card.privateLabel}</span>
        <dl className="admin-fields">
          <div className="admin-field">
            <dt>{card.contactPhone}</dt>
            <dd>
              <a className="admin-phone" href={`tel:${request.contactPhone}`} dir="ltr">
                {request.contactPhone}
              </a>
            </dd>
          </div>
        </dl>
      </div>

      <div className="admin-actions">
        <button
          type="button"
          className="btn btn-primary btn-small"
          disabled={busy}
          onClick={() => onResolve(request)}
        >
          {busy ? t.resolving : t.resolve}
        </button>
      </div>
    </li>
  );
}
