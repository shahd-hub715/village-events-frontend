export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export const ENDPOINTS = {
  events: "/events",
  adminEvents: "/admin/events",
  changeRequests: "/change-requests",
  adminChangeRequests: "/admin/change-requests"
} as const;

/** Client-side path the admin dashboard is served at. */
export const ADMIN_PATH = "/admin";
