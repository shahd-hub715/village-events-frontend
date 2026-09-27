import { useState, type FormEvent } from "react";
import Modal from "../Modal";
import EventTypeDropdown from "../EventTypeDropdown";
import NumericDatePicker from "../NumericDatePicker";
import { adminStrings } from "../../config/adminStrings";
import { maxSelectableDate } from "../../config/years";
import { todayIso } from "../../utils/date";
import type {
  AdminEvent,
  AdminEventUpdate,
  AdminFieldErrors
} from "../../types/adminEvent";
import type { EventType } from "../../types/event";

type OpenMenu = "day" | "month" | "year" | "eventType" | null;

interface AdminEditEventModalProps {
  event: AdminEvent;
  saving: boolean;
  /** Validation errors coming back from the backend. */
  serverErrors: AdminFieldErrors;
  serverMessage: string;
  onSave: (payload: AdminEventUpdate) => void;
  onClose: () => void;
}

export default function AdminEditEventModal({
  event,
  saving,
  serverErrors,
  serverMessage,
  onSave,
  onClose
}: AdminEditEventModalProps) {
  const { edit, card, validation } = adminStrings;
  const [form, setForm] = useState({
    personName: event.personName,
    eventType: event.eventType as EventType,
    eventDate: event.eventDate,
    location: event.location ?? "",
    contactPhone: event.contactPhone,
    notes: event.notes ?? ""
  });
  const [localErrors, setLocalErrors] = useState<AdminFieldErrors>({});
  // Coordinates the date picker's day/month/year menus and the event-type dropdown so only one is open at a time.
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);

  const errors: AdminFieldErrors = { ...serverErrors, ...localErrors };

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setLocalErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();

    const next: AdminFieldErrors = {};
    if (!form.personName.trim()) next.personName = validation.personName;
    if (!form.eventType) next.eventType = validation.eventType;
    if (!form.eventDate) next.eventDate = validation.eventDate;
    if (!form.contactPhone.trim()) next.contactPhone = validation.contactPhone;
    if (Object.keys(next).length) {
      setLocalErrors(next);
      return;
    }

    onSave({
      personName: form.personName.trim(),
      eventType: form.eventType,
      eventDate: form.eventDate,
      location: form.location.trim() ? form.location.trim() : null,
      contactPhone: form.contactPhone.trim(),
      notes: form.notes.trim() ? form.notes.trim() : null
    });
  };

  return (
    <Modal titleId="admin-edit-title" variant="sheet-centered" onClose={onClose}>
      <div className="modal-head">
        <h2 className="modal-title" id="admin-edit-title">
          {edit.title}
        </h2>
        <button
          type="button"
          className="modal-close"
          aria-label={edit.close}
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <p className="modal-intro">{edit.intro}</p>

      {serverMessage ? (
        <div className="form-error" role="alert">
          {serverMessage}
        </div>
      ) : null}

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="label" htmlFor="admin-personName">
            {card.personName} <span className="required">*</span>
          </label>
          <input
            id="admin-personName"
            className="input"
            type="text"
            value={form.personName}
            aria-invalid={!!errors.personName}
            onChange={(e) => update("personName", e.target.value)}
          />
          {errors.personName ? (
            <span className="field-error">{errors.personName}</span>
          ) : null}
        </div>

        <div className="field">
          <label className="label" htmlFor="admin-eventType">
            {card.eventType} <span className="required">*</span>
          </label>
          <EventTypeDropdown
            id="admin-eventType"
            value={form.eventType}
            placeholder={validation.eventType}
            invalid={!!errors.eventType}
            onChange={(value: EventType) => update("eventType", value)}
            open={openMenu === "eventType"}
            onOpenChange={(next) => setOpenMenu(next ? "eventType" : null)}
          />
          {errors.eventType ? (
            <span className="field-error">{errors.eventType}</span>
          ) : null}
        </div>

        <div className="field">
          <label className="label" htmlFor="admin-eventDate">
            {card.eventDate} <span className="required">*</span>
          </label>
          <NumericDatePicker
            id="admin-eventDate"
            value={form.eventDate}
            min={todayIso()}
            max={maxSelectableDate()}
            invalid={!!errors.eventDate}
            onChange={(value) => update("eventDate", value)}
            openPicker={
              openMenu === "day" || openMenu === "month" || openMenu === "year"
                ? openMenu
                : null
            }
            onOpenPickerChange={setOpenMenu}
          />
          {errors.eventDate ? (
            <span className="field-error">{errors.eventDate}</span>
          ) : null}
        </div>

        <div className="admin-form-row">
          <div className="field">
            <label className="label" htmlFor="admin-location">
              {card.location}
            </label>
            <input
              id="admin-location"
              className="input"
              type="text"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
            />
            {errors.location ? (
              <span className="field-error">{errors.location}</span>
            ) : null}
          </div>

          <div className="field">
            <label className="label" htmlFor="admin-contactPhone">
              {card.contactPhone} <span className="required">*</span>
            </label>
            <input
              id="admin-contactPhone"
              className="input input--phone"
              type="tel"
              dir="ltr"
              value={form.contactPhone}
              aria-invalid={!!errors.contactPhone}
              onChange={(e) => update("contactPhone", e.target.value)}
            />
            {errors.contactPhone ? (
              <span className="field-error">{errors.contactPhone}</span>
            ) : null}
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="admin-notes">
            {card.notes}
          </label>
          <textarea
            id="admin-notes"
            className="input textarea"
            rows={3}
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
          {errors.notes ? <span className="field-error">{errors.notes}</span> : null}
        </div>

        <div className="submit-row">
          <button type="submit" className="btn btn-primary btn-submit" disabled={saving}>
            {saving ? <span className="spinner" aria-hidden="true" /> : null}
            {saving ? edit.saving : edit.save}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            {edit.cancel}
          </button>
        </div>
      </form>
    </Modal>
  );
}
