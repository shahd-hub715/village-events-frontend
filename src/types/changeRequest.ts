/** Public shapes for "طلب تعديل أو حذف مناسبة". */

export type ChangeRequestType = "EDIT" | "DELETE";

/** Body of POST /api/change-requests */
export interface CreateChangeRequest {
  requestType: ChangeRequestType;
  personName: string;
  /** ISO date, e.g. "2027-07-08" */
  eventDate: string;
  contactPhone: string;
  requestedChanges: string;
}

/** Field-level validation errors for the change-request form. */
export type ChangeRequestFieldErrors = Partial<Record<keyof CreateChangeRequest, string>>;
