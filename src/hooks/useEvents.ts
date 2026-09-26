import { useCallback, useEffect, useState } from "react";
import { fetchEvents } from "../services/eventService";
import type { VillageEvent } from "../types/event";
import type { RequestStatus } from "../types/ui";
import { sortByDate } from "../utils/events";

interface UseEventsResult {
  events: VillageEvent[];
  status: RequestStatus;
  reload: () => void;
}

export function useEvents(year: number): UseEventsResult {
  const [events, setEvents] = useState<VillageEvent[]>([]);
  const [status, setStatus] = useState<RequestStatus>("loading");
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    fetchEvents(year)
      .then((data) => {
        if (cancelled) return;
        setEvents(sortByDate(Array.isArray(data) ? data : []));
        setStatus("success");
      })
      .catch(() => {
        if (cancelled) return;
        setEvents([]);
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [year, nonce]);

  return { events, status, reload };
}
