import type { EventType } from "./event";

export type AdminEventStatus = "PENDING" | "APPROVED" | "REJECTED";

/** Filter value for the "all events" section. */
export type AdminStatusFilterValue = "ALL" | AdminEventStatus;

/** Shape returned by the admin endpoints — includes the private fields. */
export interface AdminEvent {
  id: number;
  personName: string;
  eventType: EventType;
  /** ISO date, e.g. "2027-07-08" */
  eventDate: string;
  location: string | null;
  contactPhone: string;
  notes: string | null;
  status: AdminEventStatus;
  createdAt: string;
  hasDateConflict: boolean;
  sameDateCount: number;
  updatedAt: string;
}

/** Body of PUT /api/admin/events/{id} */
export interface AdminEventUpdate {
  personName: string;
  eventType: EventType;
  eventDate: string;
  location: string | null;
  contactPhone: string;
  notes: string | null;
}

/** Field-level validation errors as returned by the backend. */
export type AdminFieldErrors = Partial<Record<keyof AdminEventUpdate, string>>;
