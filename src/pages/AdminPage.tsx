import BrandTitle from "../components/BrandTitle.tsx";
import { useCallback, useMemo, useState } from "react";
import AdminChangeRequestSection from "../components/admin/AdminChangeRequestSection";
import AdminDeleteConfirmModal from "../components/admin/AdminDeleteConfirmModal";
import AdminEditEventModal from "../components/admin/AdminEditEventModal";
import AdminEventGroups from "../components/admin/AdminEventGroups";
import AdminEventList from "../components/admin/AdminEventList";
import AdminLogin from "../components/admin/AdminLogin";
import AdminPeriodFilter from "../components/admin/AdminPeriodFilter";
import AdminSearchField from "../components/admin/AdminSearchField";
import AdminRejectConfirmModal from "../components/admin/AdminRejectConfirmModal";
import AdminStatusFilter from "../components/admin/AdminStatusFilter";
import LoadingState from "../components/LoadingState";
import { adminStrings } from "../config/adminStrings";
import { villageShortTitle } from "../config/village";
import { useAdminEvents } from "../hooks/useAdminEvents";
import {
  approveEvent,
  deleteEvent,
  rejectEvent,
  updateEvent
} from "../services/adminEventService";
import {
  clearCredentials,
  loadCredentials,
  saveCredentials
} from "../services/adminAuth";
import { ApiError } from "../services/apiError";
import type {
  AdminEvent,
  AdminEventUpdate,
  AdminFieldErrors,
  AdminStatusFilterValue
} from "../types/adminEvent";
import "../styles/admin.css";

export default function AdminPage() {
  const { page, pending, all, empty, error, success } = adminStrings;

  const [token, setToken] = useState<string | null>(loadCredentials);
  const [authMessage, setAuthMessage] = useState("");

  const {
    pending: pendingEvents,
    pendingStatus,
    all: allEvents,
    allStatus,
    unauthorized,
    reload,
    applyUpdate,
    applyRemove
  } = useAdminEvents(token);

  const [filter, setFilter] = useState<AdminStatusFilterValue>("ALL");
  const [year, setYear] = useState("ALL");
  const [month, setMonth] = useState("ALL");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  const [actionError, setActionError] = useState("");
  const [editTarget, setEditTarget] = useState<AdminEvent | null>(null);
  const [editErrors, setEditErrors] = useState<AdminFieldErrors>({});
  const [editMessage, setEditMessage] = useState("");
  const [rejectTarget, setRejectTarget] = useState<AdminEvent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminEvent | null>(null);

  /** A free-text query outranks the chips: it searches the whole archive. */
  const searching = query.trim().length > 0;

  const searched = useMemo(() => {
    const needle = query.trim().toLowerCase();

    if (!needle) return allEvents;

    return allEvents.filter((event) =>
      [
        event.personName,
        event.location,
        event.contactPhone,
        event.notes,
        event.eventDate
      ]
        .filter(Boolean)
        .some((field) =>
          String(field).toLowerCase().includes(needle)
        )
    );
  }, [allEvents, query]);

  const counts = useMemo(
    () => ({
      ALL: searched.length,
      PENDING: searched.filter(
        (e) => e.status === "PENDING"
      ).length,
      APPROVED: searched.filter(
        (e) => e.status === "APPROVED"
      ).length,
      REJECTED: searched.filter(
        (e) => e.status === "REJECTED"
      ).length
    }),
    [searched]
  );

  /** Status filter next — the year/month choices describe what that status actually contains. */
  const byStatus = useMemo(
    () =>
      filter === "ALL"
        ? searched
        : searched.filter((e) => e.status === filter),
    [searched, filter]
  );

  const years = useMemo(
    () =>
      Array.from(
        new Set(
          byStatus.map((e) => e.eventDate.slice(0, 4))
        )
      ).sort(),
    [byStatus]
  );

  /** Months present in the current status (and year, when one is picked). */
  const months = useMemo(
    () =>
      Array.from(
        new Set(
          byStatus
            .filter(
              (e) =>
                year === "ALL" ||
                e.eventDate.slice(0, 4) === year
            )
            .map((e) => e.eventDate.slice(5, 7))
        )
      ).sort(),
    [byStatus, year]
  );

  const filtered = useMemo(
    () =>
      byStatus.filter((e) => {
        if (
          year !== "ALL" &&
          e.eventDate.slice(0, 4) !== year
        ) {
          return false;
        }

        if (
          month !== "ALL" &&
          e.eventDate.slice(5, 7) !== month
        ) {
          return false;
        }

        return true;
      }),
    [byStatus, year, month]
  );

  /** Year/month are meaningless once the status changes, so they reset with it. */
  const changeFilter = (
    value: AdminStatusFilterValue
  ) => {
    setFilter(value);
    setYear("ALL");
    setMonth("ALL");
  };

  const changeYear = (value: string) => {
    setYear(value);
    setMonth("ALL");
  };

  const resetPeriod = () => {
    setYear("ALL");
    setMonth("ALL");
  };

  /** Shared 401 handling for sections that load on their own. */
  const expireSession = useCallback(() => {
    clearCredentials();
    setToken(null);
    setAuthMessage(
      adminStrings.error.unauthorized
    );
  }, []);

  const signOut = () => {
    clearCredentials();
    setToken(null);
    setAuthMessage("");
  };

  const signIn = (
    username: string,
    password: string
  ) => {
    setAuthMessage("");
    setToken(
      saveCredentials(username, password)
    );
  };

  /** Turns an API failure into on-screen feedback; 401 sends the admin back to sign-in. */
  const handleFailure = (
    failure: unknown,
    id?: number
  ): AdminFieldErrors | null => {
    if (failure instanceof ApiError) {
      if (failure.status === 401) {
        clearCredentials();
        setToken(null);
        setAuthMessage(error.unauthorized);
        return null;
      }

      if (failure.status === 404) {
        setActionError(error.notFound);

        if (id !== undefined) {
          applyRemove(id);
        }

        return null;
      }

      if (failure.isValidation) {
        return failure.fieldErrors ?? {};
      }

      setActionError(failure.message);
      return null;
    }

    setActionError(error.generic);
    return null;
  };

  const notify = (message: string) => {
    setActionError("");
    setToast(message);
  };

  const runApprove = async (
    event: AdminEvent
  ) => {
    setBusyId(event.id);
    setActionError("");

    try {
      const updated = await approveEvent(
        event.id,
        token
      );

      applyUpdate(
        updated ?? {
          ...event,
          status: "APPROVED"
        }
      );

      notify(success.approved);
    } catch (failure) {
      handleFailure(failure, event.id);
    } finally {
      setBusyId(null);
    }
  };

  const runReject = async (
    event: AdminEvent
  ) => {
    setBusyId(event.id);
    setActionError("");

    try {
      const updated = await rejectEvent(
        event.id,
        token
      );

      applyUpdate(
        updated ?? {
          ...event,
          status: "REJECTED"
        }
      );

      notify(success.rejected);
      setRejectTarget(null);
    } catch (failure) {
      handleFailure(failure, event.id);
      setRejectTarget(null);
    } finally {
      setBusyId(null);
    }
  };

  const runUpdate = async (
    payload: AdminEventUpdate
  ) => {
    if (!editTarget) return;

    const id = editTarget.id;

    setBusyId(id);
    setEditErrors({});
    setEditMessage("");

    try {
      const updated =
        (await updateEvent(
          id,
          payload,
          token
        )) ?? {
          ...editTarget,
          ...payload
        };

      applyUpdate(updated);
      setEditTarget(null);
      notify(success.updated);
    } catch (failure) {
      const fieldErrors =
        handleFailure(failure, id);

      if (fieldErrors) {
        setEditErrors(fieldErrors);
      } else {
        setEditMessage(
          failure instanceof ApiError
            ? failure.message
            : adminStrings.error.generic
        );
      }
    } finally {
      setBusyId(null);
    }
  };

  const runDelete = async () => {
    if (!deleteTarget) return;

    const id = deleteTarget.id;

    setBusyId(id);

    try {
      await deleteEvent(id, token);

      applyRemove(id);
      setDeleteTarget(null);
      notify(success.deleted);
    } catch (failure) {
      handleFailure(failure, id);
      setDeleteTarget(null);
    } finally {
      setBusyId(null);
    }
  };

  const openEdit = (event: AdminEvent) => {
    setEditErrors({});
    setEditMessage("");
    setEditTarget(event);
  };

  if (!token) {
    return (
      <AdminLogin
        message={authMessage}
        onSubmit={signIn}
      />
    );
  }

  const pendingCount =
    pendingStatus === "loading"
      ? pending.loadingCount
      : pendingStatus === "error"
        ? pending.unavailableCount
        : pendingEvents.length === 1
          ? pending.one
          : pending.many(
              pendingEvents.length
            );

  const allCount =
    allStatus === "loading"
      ? all.loadingCount
      : allStatus === "error"
        ? all.unavailableCount
        : filtered.length === 1
          ? all.one
          : all.many(filtered.length);

  return (
    <div className="app admin">
      <header className="site-header">
        <div className="header-inner">
          <div className="brand">
            <BrandTitle title={villageShortTitle()} />
            <span className="brand-suffix">
              · {adminStrings.brandSuffix}
            </span>
          </div>

          <div className="admin-topbar-actions">
            <a
              className="btn btn-secondary btn-small"
              href="/"
            >
              {page.publicLink}
            </a>

            <button
              type="button"
              className="btn btn-quiet"
              onClick={signOut}
            >
              {page.signOut}
            </button>
          </div>
        </div>
      </header>

      <main className="main admin-main">
        <div className="admin-head">
          <h1 className="admin-title">
            {page.title}
          </h1>

          <p className="admin-subtitle">
            {page.subtitle}
          </p>
        </div>

        {toast ? (
          <div
            className="admin-toast"
            role="status"
          >
            <span>{toast}</span>

            <button
              type="button"
              className="modal-close"
              aria-label={success.dismiss}
              onClick={() => setToast("")}
            >
              ×
            </button>
          </div>
        ) : null}

        {actionError ? (
          <div
            className="form-error"
            role="alert"
          >
            {actionError}
          </div>
        ) : null}

        {/* 1 — review queue */}
        <section
          className="admin-section"
          aria-labelledby="admin-pending-heading"
        >
          <div className="section-head">
            <h2
              className="section-title"
              id="admin-pending-heading"
            >
              {pending.heading}
            </h2>

            <span className="section-count">
              {pendingCount}
            </span>
          </div>

          {pendingStatus === "loading" ? (
            <LoadingState />
          ) : null}

          {pendingStatus === "error" &&
          !unauthorized ? (
            <div
              className="error-card"
              role="alert"
            >
              <strong className="card-title">
                {error.title}
              </strong>

              <p className="card-text">
                {error.text}
              </p>

              <button
                type="button"
                className="btn btn-quiet"
                onClick={reload}
              >
                {error.retry}
              </button>
            </div>
          ) : null}

          {pendingStatus === "success" &&
          pendingEvents.length === 0 ? (
            <div className="empty-card">
              <span
                className="empty-icon"
                aria-hidden="true"
              />

              <strong className="card-title">
                {empty.title}
              </strong>

              <p className="card-text card-text--center">
                {empty.text}
              </p>

              <button
                type="button"
                className="btn btn-quiet"
                onClick={reload}
              >
                {error.refresh}
              </button>
            </div>
          ) : null}

          {pendingEvents.length > 0 ? (
            <AdminEventList
              events={pendingEvents}
              busyId={busyId}
              onApprove={runApprove}
              onReject={setRejectTarget}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ) : null}
        </section>

        {/* 1b — visitor edit/delete requests */}
        <AdminChangeRequestSection
          token={token}
          onUnauthorized={expireSession}
          onNotify={notify}
        />

        {/* 2 — full archive */}
        <section
          className="admin-section"
          aria-labelledby="admin-all-heading"
        >
          <div className="section-head">
            <h2
              className="section-title"
              id="admin-all-heading"
            >
              {all.heading}
            </h2>

            <span className="section-count">
              {allCount}
            </span>
          </div>

          <p className="admin-section-note">
            {all.note}
          </p>

          <div className="admin-toolbar">
            <AdminSearchField
              value={query}
              onChange={setQuery}
            />

            <AdminStatusFilter
              value={filter}
              counts={counts}
              onChange={changeFilter}
            />
          </div>

          {byStatus.length > 0 ? (
            <AdminPeriodFilter
              years={years}
              year={year}
              months={months}
              month={month}
              onYearChange={changeYear}
              onMonthChange={setMonth}
              onReset={resetPeriod}
            />
          ) : null}

          {allStatus === "loading" ? (
            <LoadingState />
          ) : null}

          {allStatus === "error" &&
          !unauthorized ? (
            <div
              className="error-card"
              role="alert"
            >
              <strong className="card-title">
                {all.errorTitle}
              </strong>

              <p className="card-text">
                {error.text}
              </p>

              <button
                type="button"
                className="btn btn-quiet"
                onClick={reload}
              >
                {error.retry}
              </button>
            </div>
          ) : null}

          {allStatus === "success" &&
          filtered.length === 0 ? (
            <div className="empty-card">
              <span
                className="empty-icon"
                aria-hidden="true"
              />

              <strong className="card-title">
                {searching
                  ? all.noResultsTitle
                  : all.emptyTitle}
              </strong>

              <p className="card-text card-text--center">
                {searching
                  ? all.noResultsText
                  : all.emptyText}
              </p>
            </div>
          ) : null}

          {filtered.length > 0 ? (
            <AdminEventGroups
              events={filtered}
              busyId={busyId}
              hintPending
              onApprove={runApprove}
              onReject={setRejectTarget}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ) : null}
        </section>
      </main>

      {editTarget ? (
        <AdminEditEventModal
          event={editTarget}
          saving={
            busyId === editTarget.id
          }
          serverErrors={editErrors}
          serverMessage={editMessage}
          onSave={runUpdate}
          onClose={() =>
            setEditTarget(null)
          }
        />
      ) : null}

      {rejectTarget ? (
        <AdminRejectConfirmModal
          event={rejectTarget}
          working={
            busyId === rejectTarget.id
          }
          onConfirm={() =>
            void runReject(rejectTarget)
          }
          onCancel={() =>
            setRejectTarget(null)
          }
        />
      ) : null}

      {deleteTarget ? (
        <AdminDeleteConfirmModal
          event={deleteTarget}
          deleting={
            busyId === deleteTarget.id
          }
          onConfirm={() =>
            void runDelete()
          }
          onCancel={() =>
            setDeleteTarget(null)
          }
        />
      ) : null}
    </div>
  );
}