export type EventType = "WEDDING" | "GROOM_PARTY" | "BRIDE_PARTY";

/** Public shape returned by GET /api/events?year=YYYY — never contains admin-only data. */
export interface VillageEvent {
  id: number;
  personName: string;
  eventType: EventType;
  /** ISO date, e.g. "2027-07-08" */
  eventDate: string;
  location: string | null;
  /** Optional public detail written by the submitter. */
  notes?: string | null;
}

/** Body of POST /api/events */
export interface CreateEventRequest {
  personName: string;
  eventType: EventType;
  eventDate: string;
  location?: string | null;
  /** Admin follow-up only, never rendered publicly. */
  contactPhone: string;
  notes?: string | null;
}

/** Response of POST /api/events */
export interface CreateEventResponse {
  hasConflict: boolean;
  message: string;
}

/** Field-level validation errors as returned by the backend. */
export type FieldErrors = Partial<Record<keyof CreateEventRequest, string>>;
