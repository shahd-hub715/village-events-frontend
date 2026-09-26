import { useMemo } from "react";
import AdminEventList from "./AdminEventList";
import type { AdminEvent } from "../../types/adminEvent";
import { formatMonthYear } from "../../utils/date";

interface AdminEventGroupsProps {
  events: AdminEvent[];
  busyId: number | null;
  hintPending?: boolean;
  onApprove: (event: AdminEvent) => void;
  onReject: (event: AdminEvent) => void;
  onEdit: (event: AdminEvent) => void;
  onDelete: (event: AdminEvent) => void;
}

interface Group {
  key: string;
  label: string;
  events: AdminEvent[];
}

/** Groups by "YYYY-MM" so a long archive stays scannable. Input is already date-sorted. */
function groupByMonth(events: AdminEvent[]): Group[] {
  const groups: Group[] = [];
  events.forEach((event) => {
    const key = event.eventDate.slice(0, 7);
    const last = groups[groups.length - 1];
    if (last && last.key === key) {
      last.events.push(event);
    } else {
      groups.push({ key, label: formatMonthYear(event.eventDate), events: [event] });
    }
  });
  return groups;
}

export default function AdminEventGroups({
  events,
  busyId,
  hintPending = false,
  onApprove,
  onReject,
  onEdit,
  onDelete
}: AdminEventGroupsProps) {
  const groups = useMemo(() => groupByMonth(events), [events]);

  return (
    <div className="admin-groups">
      {groups.map((group) => (
        <section className="admin-group" key={group.key} aria-label={group.label}>
          <div className="admin-group-head">
            <h3 className="admin-group-title">{group.label}</h3>
            <span className="admin-group-count">{group.events.length}</span>
          </div>
          <AdminEventList
            events={group.events}
            busyId={busyId}
            hintPending={hintPending}
            onApprove={onApprove}
            onReject={onReject}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </section>
      ))}
    </div>
  );
}
