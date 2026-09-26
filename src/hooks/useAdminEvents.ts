import { useCallback, useEffect, useState } from "react";
import { fetchAllEvents, fetchPendingEvents } from "../services/adminEventService";
import { ApiError } from "../services/apiError";
import type { AdminEvent } from "../types/adminEvent";
import type { RequestStatus } from "../types/ui";

interface UseAdminEventsResult {
  /** GET /api/admin/events/pending */
  pending: AdminEvent[];
  pendingStatus: RequestStatus;
  /** GET /api/admin/events */
  all: AdminEvent[];
  allStatus: RequestStatus;
  /** true when either call answered 401 — the page shows the sign-in card. */
  unauthorized: boolean;
  reload: () => void;
  /** Apply an approve / reject / edit result to both lists at once. */
  applyUpdate: (event: AdminEvent) => void;
  /** Drop a deleted (or vanished) event from both lists. */
  applyRemove: (id: number) => void;
}

const byDate = (a: AdminEvent, b: AdminEvent) => a.eventDate.localeCompare(b.eventDate);

export function useAdminEvents(token: string | null): UseAdminEventsResult {
  const [pending, setPending] = useState<AdminEvent[]>([]);
  const [all, setAll] = useState<AdminEvent[]>([]);
  const [pendingStatus, setPendingStatus] = useState<RequestStatus>("loading");
  const [allStatus, setAllStatus] = useState<RequestStatus>("loading");
  const [unauthorized, setUnauthorized] = useState(false);
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  const applyUpdate = useCallback((event: AdminEvent) => {
    setAll((current) => {
      const next = current.some((item) => item.id === event.id)
        ? current.map((item) => (item.id === event.id ? event : item))
        : [...current, event];
      return next.sort(byDate);
    });
    // the pending list only ever holds PENDING events
    setPending((current) =>
      event.status === "PENDING"
        ? (current.some((item) => item.id === event.id)
            ? current.map((item) => (item.id === event.id ? event : item))
            : [...current, event]
          ).sort(byDate)
        : current.filter((item) => item.id !== event.id)
    );
  }, []);

  const applyRemove = useCallback((id: number) => {
    setAll((current) => current.filter((item) => item.id !== id));
    setPending((current) => current.filter((item) => item.id !== id));
  }, []);

  useEffect(() => {
    if (!token) {
      setPending([]);
      setAll([]);
      setPendingStatus("idle");
      setAllStatus("idle");
      return;
    }

    let cancelled = false;
    setPendingStatus("loading");
    setAllStatus("loading");
    setUnauthorized(false);

    const flagUnauthorized = (error: unknown) => {
      if (error instanceof ApiError && error.status === 401) setUnauthorized(true);
    };

    fetchPendingEvents(token)
      .then((data) => {
        if (cancelled) return;
        setPending((Array.isArray(data) ? [...data] : []).sort(byDate));
        setPendingStatus("success");
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setPending([]);
        flagUnauthorized(error);
        setPendingStatus("error");
      });

    fetchAllEvents(token)
      .then((data) => {
        if (cancelled) return;
        setAll((Array.isArray(data) ? [...data] : []).sort(byDate));
        setAllStatus("success");
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setAll([]);
        flagUnauthorized(error);
        setAllStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [token, nonce]);

  return {
    pending,
    pendingStatus,
    all,
    allStatus,
    unauthorized,
    reload,
    applyUpdate,
    applyRemove
  };
}
