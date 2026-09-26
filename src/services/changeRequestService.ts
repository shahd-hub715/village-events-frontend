import { ENDPOINTS } from "../config/api";
import type { CreateChangeRequest } from "../types/changeRequest";
import { request } from "./httpClient";

/** POST /api/change-requests — files a request only; the event itself is never touched. */
export async function createChangeRequest(payload: CreateChangeRequest): Promise<void> {
  await request<unknown>(ENDPOINTS.changeRequests, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
