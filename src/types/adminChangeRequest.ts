import type { ChangeRequestType } from "./changeRequest";

export type ChangeRequestStatus = "PENDING" | "RESOLVED";

/** Item returned by GET /api/admin/change-requests/pending */
export interface AdminChangeRequest {
  id: number;
  requestType: ChangeRequestType;
  personName: string;
  /** ISO date, e.g. "2027-07-08" */
  eventDate: string;
  contactPhone: string;
  requestedChanges: string;
  status: ChangeRequestStatus;
  /** ISO timestamp of submission */
  createdAt: string;
}
