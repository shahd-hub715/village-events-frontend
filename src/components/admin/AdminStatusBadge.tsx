import { STATUS_LABELS } from "../../config/adminStrings";
import type { AdminEventStatus } from "../../types/adminEvent";

interface AdminStatusBadgeProps {
  status: AdminEventStatus;
}

export default function AdminStatusBadge({ status }: AdminStatusBadgeProps) {
  return (
    <span className={`admin-badge admin-badge--${status.toLowerCase()}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
