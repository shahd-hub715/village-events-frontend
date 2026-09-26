export type RequestStatus = "idle" | "loading" | "success" | "error";

export interface SubmissionResult {
  hasConflict: boolean;
  message: string;
}
