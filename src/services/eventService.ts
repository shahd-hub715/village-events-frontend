import { ENDPOINTS } from "../config/api";
import type {
  CreateEventRequest,
  CreateEventResponse,
  VillageEvent
} from "../types/event";
import { request } from "./httpClient";

/** GET /api/events?year={year} */
export function fetchEvents(year: number): Promise<VillageEvent[]> {
  return request<VillageEvent[]>(ENDPOINTS.events, { method: "GET" }, { year });
}

/** POST /api/events */
export function createEvent(
  payload: CreateEventRequest
): Promise<CreateEventResponse> {
  return request<CreateEventResponse>(ENDPOINTS.events, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
