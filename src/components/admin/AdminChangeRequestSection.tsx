import { useEffect, useState } from "react";
import AdminChangeRequestCard from "./AdminChangeRequestCard";
import LoadingState from "../LoadingState";
import { adminStrings } from "../../config/adminStrings";
import { useAdminChangeRequests } from "../../hooks/useAdminChangeRequests";
import { resolveChangeRequest } from "../../services/adminChangeRequestService";
import { ApiError } from "../../services/apiError";
import type { AdminChangeRequest } from "../../types/adminChangeRequest";
import "../../styles/changeRequest.css";

interface AdminChangeRequestSectionProps {
  token: string | null;
  /** Called on any 401 so the page can return to the sign-in card. */
  onUnauthorized: () => void;
  /** Page-level success banner. */
  onNotify: (message: string) => void;
}

export default function AdminChangeRequestSection({
  token,
  onUnauthorized,
  onNotify
}: AdminChangeRequestSectionProps) {
  const { changeRequests: t, pending, error } = adminStrings;
  const { requests, status, unauthorized, reload, remove } = useAdminChangeRequests(token);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    if (unauthorized) onUnauthorized();
  }, [unauthorized, onUnauthorized]);

  const runResolve = async (request: AdminChangeRequest) => {
    setBusyId(request.id);
    setActionError("");
    try {
      await resolveChangeRequest(request.id, token);
      remove(request.id);
      onNotify(t.resolved);
    } catch (failure) {
      if (failure instanceof ApiError && failure.status === 401) {
        onUnauthorized();
      } else if (failure instanceof ApiError && failure.status === 404) {
        remove(request.id);
        setActionError(t.notFound);
      } else if (failure instanceof ApiError) {
        setActionError(failure.message);
      } else {
        setActionError(error.generic);
      }
    } finally {
      setBusyId(null);
    }
  };

  const count =
    status === "loading"
      ? pending.loadingCount
      : status === "error"
        ? pending.unavailableCount
        : requests.length === 1
          ? pending.one
          : pending.many(requests.length);

  return (
    <section className="admin-section" aria-labelledby="admin-change-requests-heading">
      <div className="section-head">
        <h2 className="section-title" id="admin-change-requests-heading">
          {t.heading}
        </h2>
        <span className="section-count">{count}</span>
      </div>

      <p className="admin-section-note">{t.note}</p>

      {actionError ? (
        <div className="form-error" role="alert">
          {actionError}
        </div>
      ) : null}

      {status === "loading" ? <LoadingState /> : null}

      {status === "error" && !unauthorized ? (
        <div className="error-card" role="alert">
          <strong className="card-title">{t.errorTitle}</strong>
          <p className="card-text">{error.text}</p>
          <button type="button" className="btn btn-quiet" onClick={reload}>
            {error.retry}
          </button>
        </div>
      ) : null}

      {status === "success" && requests.length === 0 ? (
        <div className="empty-card">
          <span className="empty-icon" aria-hidden="true" />
          <strong className="card-title">{t.emptyTitle}</strong>
          <p className="card-text card-text--center">{t.emptyText}</p>
          <button type="button" className="btn btn-quiet" onClick={reload}>
            {error.refresh}
          </button>
        </div>
      ) : null}

      {requests.length > 0 ? (
        <ul className="admin-list">
          {requests.map((request) => (
            <AdminChangeRequestCard
              key={request.id}
              request={request}
              busy={busyId === request.id}
              onResolve={runResolve}
            />
          ))}
        </ul>
      ) : null}
    </section>
  );
}
