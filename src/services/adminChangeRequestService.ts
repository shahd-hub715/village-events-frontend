import { ENDPOINTS } from "../config/api";
import type { AdminChangeRequest } from "../types/adminChangeRequest";
import { adminAuthHeader } from "./adminAuth";
import { request } from "./httpClient";

const base = ENDPOINTS.adminChangeRequests;

/** GET /api/admin/change-requests/pending */
export function fetchPendingChangeRequests(
  token?: string | null
): Promise<AdminChangeRequest[]> {
  return request<AdminChangeRequest[]>(`${base}/pending`, {
    method: "GET",
    headers: adminAuthHeader(token)
  });
}

/** PUT /api/admin/change-requests/{id}/resolve — marks the request handled; does not edit/delete the event. */
export async function resolveChangeRequest(id: number, token?: string | null): Promise<void> {
  await request<unknown>(`${base}/${id}/resolve`, {
    method: "PUT",
    headers: adminAuthHeader(token)
  });
}
