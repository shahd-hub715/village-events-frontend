import { useState, type FormEvent } from "react";
import ConflictModal from "./ConflictModal";
import { strings } from "../config/strings";
import { maxSelectableDate } from "../config/years";
import { ApiError } from "../services/apiError";
import { createEvent } from "../services/eventService";
import type { CreateEventRequest, EventType, FieldErrors } from "../types/event";
import type { SubmissionResult } from "../types/ui";
import { isPastDate, todayIso } from "../utils/date";
import EventTypeDropdown from "./EventTypeDropdown";
import NumericDatePicker from "./NumericDatePicker";

interface AddEventFormProps {
  /** ISO dates that already have an approved event — drives the calm same-date notice. */
  takenDates: string[];
  onClose: () => void;
  onSubmitted: (result: SubmissionResult) => void;
}

interface FormState {
  personName: string;
  eventType: "" | EventType;
  eventDate: string;
  location: string;
  contactPhone: string;
  notes: string;
}

const EMPTY_FORM: FormState = {
  personName: "",
  eventType: "",
  eventDate: "",
  location: "",
  contactPhone: "",
  notes: ""
};

export default function AddEventForm({
  takenDates,
  onClose,
  onSubmitted
}: AddEventFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<CreateEventRequest | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (!form.personName.trim()) errors.personName = strings.form.validation.personName;
    if (!form.eventType) errors.eventType = strings.form.validation.eventType;
    if (!form.eventDate) errors.eventDate = strings.form.validation.eventDate;
    else if (isPastDate(form.eventDate)) errors.eventDate = strings.form.validation.pastDate;
    if (!form.contactPhone.trim()) errors.contactPhone = strings.form.validation.contactPhone;
    return errors;
  };

  const send = async (payload: CreateEventRequest) => {
    setSubmitting(true);
    try {
      const response = await createEvent(payload);
      setPendingPayload(null);
      onSubmitted({ hasConflict: response.hasConflict, message: response.message });
    } catch (error) {
      setPendingPayload(null);
      if (error instanceof ApiError && error.isValidation) {
        setFieldErrors(error.fieldErrors ?? {});
      } else if (error instanceof ApiError) {
        setFormError(error.message);
      } else {
        setFormError(strings.error.generic);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    const errors = validate();
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    const payload: CreateEventRequest = {
      personName: form.personName.trim(),
      eventType: form.eventType as EventType,
      eventDate: form.eventDate,
      location: form.location.trim() ? form.location.trim() : null,
      contactPhone: form.contactPhone.trim(),
      notes: form.notes.trim() ? form.notes.trim() : null
    };

    // Same-date check against the approved events already loaded: confirm first, submit after.
    if (takenDates.includes(payload.eventDate)) {
      setPendingPayload(payload);
      return;
    }

    await send(payload);
  };

  const dateTaken = !!form.eventDate && takenDates.includes(form.eventDate);

  return (
    <>
      <div className="modal-head">
        <h2 className="modal-title" id="add-event-title">
          {strings.form.title}
        </h2>
        <button
          type="button"
          className="modal-close"
          aria-label={strings.form.close}
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <p className="modal-intro">{strings.form.intro}</p>

      {formError ? (
        <div className="form-error" role="alert">
          {formError}
        </div>
      ) : null}

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="label" htmlFor="personName">
            {strings.form.fields.personName} <span className="required">*</span>
          </label>
          <input
            id="personName"
            name="personName"
            className="input"
            type="text"
            required
            autoComplete="name"
            placeholder={strings.form.placeholders.personName}
            value={form.personName}
            aria-invalid={!!fieldErrors.personName}
            onChange={(event) => update("personName", event.target.value)}
          />
          {fieldErrors.personName ? (
            <span className="field-error">{fieldErrors.personName}</span>
          ) : null}
        </div>

        <div className="field">
          <label className="label" htmlFor="eventType">
            {strings.form.fields.eventType} <span className="required">*</span>
          </label>
          <EventTypeDropdown
            id="eventType"
            value={form.eventType}
            placeholder={strings.form.placeholders.eventType}
            invalid={!!fieldErrors.eventType}
            onChange={(value) => update("eventType", value)}
          />
          {fieldErrors.eventType ? (
            <span className="field-error">{fieldErrors.eventType}</span>
          ) : null}
        </div>

        <div className="field">
          <label className="label" htmlFor="eventDate">
            {strings.form.fields.eventDate} <span className="required">*</span>
          </label>
          <NumericDatePicker
            id="eventDate"
            value={form.eventDate}
            min={todayIso()}
            max={maxSelectableDate()}
            invalid={!!fieldErrors.eventDate}
            onChange={(value) => update("eventDate", value)}
          />
          {dateTaken ? (
            <span className="field-hint">{strings.form.dateTakenHint}</span>
          ) : null}
          {fieldErrors.eventDate ? (
            <span className="field-error">{fieldErrors.eventDate}</span>
          ) : null}
        </div>

        <div className="field">
          <label className="label" htmlFor="location">
            {strings.form.fields.location}{" "}
            <span className="optional">{strings.form.optional}</span>
          </label>
          <input
            id="location"
            name="location"
            className="input"
            type="text"
            placeholder={strings.form.placeholders.location}
            value={form.location}
            onChange={(event) => update("location", event.target.value)}
          />
        </div>

        <div className="field">
          <label className="label" htmlFor="contactPhone">
            {strings.form.fields.contactPhone} <span className="required">*</span>
          </label>
          <input
            id="contactPhone"
            name="contactPhone"
            className="input input--phone"
            type="tel"
            dir="ltr"
            required
            autoComplete="tel"
            placeholder={strings.form.placeholders.contactPhone}
            aria-describedby="phone-note"
            value={form.contactPhone}
            aria-invalid={!!fieldErrors.contactPhone}
            onChange={(event) => update("contactPhone", event.target.value)}
          />
          <span className="field-note" id="phone-note">
            {strings.form.phoneNote}
          </span>
          {fieldErrors.contactPhone ? (
            <span className="field-error">{fieldErrors.contactPhone}</span>
          ) : null}
        </div>

        <div className="field">
          <label className="label" htmlFor="notes">
            {strings.form.fields.notes}{" "}
            <span className="optional">{strings.form.optional}</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            className="input textarea"
            rows={3}
            placeholder={strings.form.placeholders.notes}
            value={form.notes}
            onChange={(event) => update("notes", event.target.value)}
          />
        </div>

        <div className="submit-row">
          <button type="submit" className="btn btn-primary btn-submit" disabled={submitting}>
            {submitting ? <span className="spinner" aria-hidden="true" /> : null}
            {submitting ? strings.form.submitting : strings.form.submit}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            {strings.form.cancel}
          </button>
        </div>
      </form>

      {pendingPayload ? (
        <ConflictModal
          submitting={submitting}
          onConfirm={() => void send(pendingPayload)}
          onCancel={() => setPendingPayload(null)}
        />
      ) : null}
    </>
  );
}
