import type { FieldErrors } from "../types/event";

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors?: FieldErrors;

  constructor(message: string, status: number, fieldErrors?: FieldErrors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }

  get isValidation(): boolean {
    return !!this.fieldErrors && Object.keys(this.fieldErrors).length > 0;
  }
}
