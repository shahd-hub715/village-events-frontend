import { useCallback, useEffect, useState } from "react";
import { fetchPendingChangeRequests } from "../services/adminChangeRequestService";
import { ApiError } from "../services/apiError";
import type { AdminChangeRequest } from "../types/adminChangeRequest";
import type { RequestStatus } from "../types/ui";

interface UseAdminChangeRequestsResult {
  requests: AdminChangeRequest[];
  status: RequestStatus;
  /** true when the backend answered 401 */
  unauthorized: boolean;
  reload: () => void;
  remove: (id: number) => void;
}

/** Oldest first — a queue is worked from the top. */
const bySubmitted = (a: AdminChangeRequest, b: AdminChangeRequest) =>
  (a.createdAt ?? "").localeCompare(b.createdAt ?? "");

export function useAdminChangeRequests(token: string | null): UseAdminChangeRequestsResult {
  const [requests, setRequests] = useState<AdminChangeRequest[]>([]);
  const [status, setStatus] = useState<RequestStatus>("loading");
  const [unauthorized, setUnauthorized] = useState(false);
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  const remove = useCallback((id: number) => {
    setRequests((current) => current.filter((item) => item.id !== id));
  }, []);

  useEffect(() => {
    if (!token) {
      setRequests([]);
      setStatus("idle");
      return;
    }

    let cancelled = false;
    setStatus("loading");
    setUnauthorized(false);

    fetchPendingChangeRequests(token)
      .then((data) => {
        if (cancelled) return;
        setRequests((Array.isArray(data) ? [...data] : []).sort(bySubmitted));
        setStatus("success");
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setRequests([]);
        if (error instanceof ApiError && error.status === 401) setUnauthorized(true);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [token, nonce]);

  return { requests, status, unauthorized, reload, remove };
}
