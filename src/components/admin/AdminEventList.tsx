import AdminEventCard from "./AdminEventCard";
import type { AdminEvent } from "../../types/adminEvent";

interface AdminEventListProps {
  events: AdminEvent[];
  busyId: number | null;
  /** In the archive, PENDING cards get a note pointing at the review section. */
  hintPending?: boolean;
  onApprove: (event: AdminEvent) => void;
  onReject: (event: AdminEvent) => void;
  onEdit: (event: AdminEvent) => void;
  onDelete: (event: AdminEvent) => void;
}

export default function AdminEventList({
  events,
  busyId,
  hintPending = false,
  onApprove,
  onReject,
  onEdit,
  onDelete
}: AdminEventListProps) {
  return (
    <ul className="admin-list">
      {events.map((event) => (
        <AdminEventCard
          key={event.id}
          event={event}
          busy={busyId === event.id}
          duplicateHint={hintPending && event.status === "PENDING"}
          onApprove={onApprove}
          onReject={onReject}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
