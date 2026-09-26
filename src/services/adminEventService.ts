import { ENDPOINTS } from "../config/api";
import type { AdminEvent, AdminEventUpdate } from "../types/adminEvent";
import { adminAuthHeader } from "./adminAuth";
import { request } from "./httpClient";

const base = ENDPOINTS.adminEvents;

/** GET /api/admin/events — every event, whatever its status. */
export function fetchAllEvents(token?: string | null): Promise<AdminEvent[]> {
  return request<AdminEvent[]>(base, {
    method: "GET",
    headers: adminAuthHeader(token)
  });
}

/** GET /api/admin/events/pending */
export function fetchPendingEvents(token?: string | null): Promise<AdminEvent[]> {
  return request<AdminEvent[]>(`${base}/pending`, {
    method: "GET",
    headers: adminAuthHeader(token)
  });
}

/** PUT /api/admin/events/{id}/approve */
export function approveEvent(id: number, token?: string | null): Promise<AdminEvent> {
  return request<AdminEvent>(`${base}/${id}/approve`, {
    method: "PUT",
    headers: adminAuthHeader(token)
  });
}

/** PUT /api/admin/events/{id}/reject */
export function rejectEvent(id: number, token?: string | null): Promise<AdminEvent> {
  return request<AdminEvent>(`${base}/${id}/reject`, {
    method: "PUT",
    headers: adminAuthHeader(token)
  });
}

/** PUT /api/admin/events/{id} */
export function updateEvent(
  id: number,
  payload: AdminEventUpdate,
  token?: string | null
): Promise<AdminEvent> {
  return request<AdminEvent>(`${base}/${id}`, {
    method: "PUT",
    headers: adminAuthHeader(token),
    body: JSON.stringify(payload)
  });
}

/** DELETE /api/admin/events/{id} */
export function deleteEvent(id: number, token?: string | null): Promise<void> {
  return request<void>(`${base}/${id}`, {
    method: "DELETE",
    headers: adminAuthHeader(token)
  });
}
