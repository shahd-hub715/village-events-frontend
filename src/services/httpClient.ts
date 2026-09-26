import { API_BASE_URL } from "../config/api";
import { strings } from "../config/strings";
import type { FieldErrors } from "../types/event";
import { ApiError } from "./apiError";

const KNOWN_FIELDS = [
  "personName",
  "eventType",
  "eventDate",
  "location",
  "contactPhone",
  "notes",
  "requestType",
  "requestedChanges"
] as const;

function extractFieldErrors(body: unknown): FieldErrors | undefined {
  if (!body || typeof body !== "object") return undefined;
  const record = body as Record<string, unknown>;
  const errors: Record<string, string> = {};
  KNOWN_FIELDS.forEach((field) => {
    const value = record[field];
    if (typeof value === "string" && value.trim()) {
      errors[field] = value;
    }
  });
  return Object.keys(errors).length
    ? (errors as FieldErrors)
    : undefined;
}

function extractMessage(body: unknown): string | undefined {
  if (body && typeof body === "object") {
    const message = (body as Record<string, unknown>).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return undefined;
}

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function request<T>(
  path: string,
  init: RequestInit = {},
  query?: Record<string, string | number | undefined>
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });
  }

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      ...init,
      // caller headers win, so admin calls can add Authorization
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(init.headers as Record<string, string> | undefined)
      }
    });
  } catch {
    // network / CORS / backend down
    throw new ApiError(strings.error.text, 0);
  }

  const body = await parseBody(response);

  if (!response.ok) {
    throw new ApiError(
      extractMessage(body) ?? strings.error.generic,
      response.status,
      extractFieldErrors(body)
    );
  }

  return body as T;
}
