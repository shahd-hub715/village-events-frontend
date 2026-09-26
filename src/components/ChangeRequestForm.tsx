import { useState, type FormEvent } from "react";
import { CHANGE_REQUEST_TYPE_LABELS, strings } from "../config/strings";
import { ApiError } from "../services/apiError";
import { createChangeRequest } from "../services/changeRequestService";
import type {
  ChangeRequestFieldErrors,
  ChangeRequestType,
  CreateChangeRequest
} from "../types/changeRequest";
import "../styles/changeRequest.css";
import NumericDatePicker from "./NumericDatePicker";
import { maxSelectableDate } from "../config/years";
import { todayIso } from "../utils/date";

interface ChangeRequestFormProps {
  onClose: () => void;
}

interface FormState {
  requestType: "" | ChangeRequestType;
  personName: string;
  eventDate: string;
  contactPhone: string;
  requestedChanges: string;
}

const EMPTY_FORM: FormState = {
  requestType: "",
  personName: "",
  eventDate: "",
  contactPhone: "",
  requestedChanges: ""
};

const TYPES: ChangeRequestType[] = ["EDIT", "DELETE"];

const FIELD_KEYS: (keyof CreateChangeRequest)[] = [
  "requestType",
  "personName",
  "eventDate",
  "contactPhone",
  "requestedChanges"
];

/** Keeps only the backend errors this form can show next to a field. */
function pickFieldErrors(error: ApiError): ChangeRequestFieldErrors {
  const raw = (error.fieldErrors ?? {}) as Record<string, string | undefined>;
  const picked: ChangeRequestFieldErrors = {};

  FIELD_KEYS.forEach((key) => {
    const value = raw[key];

    if (value) {
      picked[key] = value;
    }
  });

  return picked;
}

export default function ChangeRequestForm({
  onClose
}: ChangeRequestFormProps) {
  const t = strings.changeRequest;

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] =
    useState<ChangeRequestFieldErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const update = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value
    }));

    setFieldErrors((current) => ({
      ...current,
      [key]: undefined
    }));
  };

  const validate = (): ChangeRequestFieldErrors => {
    const errors: ChangeRequestFieldErrors = {};

    if (!form.requestType) {
      errors.requestType = t.validation.requestType;
    }

    if (!form.personName.trim()) {
      errors.personName = t.validation.personName;
    }

    if (!form.eventDate) {
      errors.eventDate = t.validation.eventDate;
    }

    if (!form.contactPhone.trim()) {
      errors.contactPhone = t.validation.contactPhone;
    }

    if (!form.requestedChanges.trim()) {
      errors.requestedChanges = t.validation.requestedChanges;
    }

    return errors;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setFormError("");

    const errors = validate();

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    const payload: CreateChangeRequest = {
      requestType:
        form.requestType as ChangeRequestType,
      personName: form.personName.trim(),
      eventDate: form.eventDate,
      contactPhone: form.contactPhone.trim(),
      requestedChanges:
        form.requestedChanges.trim()
    };

    setSubmitting(true);

    try {
      await createChangeRequest(payload);
      setSent(true);
    } catch (error) {
      if (error instanceof ApiError) {
        const picked = pickFieldErrors(error);

        if (Object.keys(picked).length) {
          setFieldErrors(picked);
        } else {
          setFormError(error.message);
        }
      } else {
        setFormError(strings.error.generic);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="cr-success">
        <span
          className="cr-success-mark"
          aria-hidden="true"
        />

        <h2
          className="modal-title"
          id="change-request-title"
        >
          {t.successTitle}
        </h2>

        <p className="modal-intro cr-success-text">
          {t.successText}
        </p>

        <button
          type="button"
          className="btn btn-primary"
          onClick={onClose}
        >
          {t.successClose}
        </button>
      </div>
    );
  }

  const detailsPlaceholder = form.requestType
    ? t.placeholders.details[form.requestType]
    : t.placeholders.detailsEmpty;

  return (
    <>
      <div className="modal-head">
        <h2
          className="modal-title"
          id="change-request-title"
        >
          {t.title}
        </h2>

        <button
          type="button"
          className="modal-close"
          aria-label={t.close}
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <p className="modal-intro">
        {t.intro}
      </p>

      {formError ? (
        <div
          className="form-error"
          role="alert"
        >
          {formError}
        </div>
      ) : null}

      <form
        className="form"
        onSubmit={handleSubmit}
        noValidate
      >
        <fieldset
          className="field cr-fieldset"
          aria-invalid={
            !!fieldErrors.requestType
          }
        >
          <legend className="label cr-legend">
            {t.fields.requestType}{" "}
            <span className="required">
              *
            </span>
          </legend>

          <div className="cr-type">
            {TYPES.map((type) => (
              <label
                key={type}
                className="cr-type-option"
              >
                <input
                  type="radio"
                  name="requestType"
                  value={type}
                  checked={
                    form.requestType === type
                  }
                  onChange={() =>
                    update(
                      "requestType",
                      type
                    )
                  }
                />

                <span>
                  {
                    CHANGE_REQUEST_TYPE_LABELS[
                    type
                    ]
                  }
                </span>
              </label>
            ))}
          </div>

          {fieldErrors.requestType ? (
            <span className="field-error">
              {fieldErrors.requestType}
            </span>
          ) : null}
        </fieldset>

        <div className="field">
          <label
            className="label"
            htmlFor="cr-personName"
          >
            {t.fields.personName}{" "}
            <span className="required">
              *
            </span>
          </label>

          <input
            id="cr-personName"
            className="input"
            type="text"
            autoComplete="name"
            placeholder={
              t.placeholders.personName
            }
            value={form.personName}
            aria-invalid={
              !!fieldErrors.personName
            }
            onChange={(event) =>
              update(
                "personName",
                event.target.value
              )
            }
          />

          {fieldErrors.personName ? (
            <span className="field-error">
              {fieldErrors.personName}
            </span>
          ) : null}
        </div>

        <div className="field">
          <label
            className="label"
            htmlFor="cr-eventDate"
          >
            {t.fields.eventDate}{" "}
            <span className="required">
              *
            </span>
          </label>

          <NumericDatePicker
            id="cr-eventDate"
            value={form.eventDate}
            min={todayIso()}
            max={maxSelectableDate()}
            invalid={!!fieldErrors.eventDate}
            onChange={(value) =>
              update("eventDate", value)
            }
          />

          {fieldErrors.eventDate ? (
            <span className="field-error">
              {fieldErrors.eventDate}
            </span>
          ) : null}
        </div>

        <div className="field">
          <label
            className="label"
            htmlFor="cr-contactPhone"
          >
            {t.fields.contactPhone}{" "}
            <span className="required">
              *
            </span>
          </label>

          <input
            id="cr-contactPhone"
            className="input input--phone"
            type="tel"
            dir="ltr"
            autoComplete="tel"
            placeholder={
              t.placeholders.contactPhone
            }
            aria-describedby="cr-phone-note"
            value={form.contactPhone}
            aria-invalid={
              !!fieldErrors.contactPhone
            }
            onChange={(event) =>
              update(
                "contactPhone",
                event.target.value
              )
            }
          />

          <span
            className="field-note"
            id="cr-phone-note"
          >
            {t.phoneNote}
          </span>

          {fieldErrors.contactPhone ? (
            <span className="field-error">
              {fieldErrors.contactPhone}
            </span>
          ) : null}
        </div>

        <div className="field">
          <label
            className="label"
            htmlFor="cr-requestedChanges"
          >
            {t.fields.requestedChanges}{" "}
            <span className="required">
              *
            </span>
          </label>

          <textarea
            id="cr-requestedChanges"
            className="input textarea"
            rows={4}
            placeholder={
              detailsPlaceholder
            }
            value={
              form.requestedChanges
            }
            aria-invalid={
              !!fieldErrors.requestedChanges
            }
            onChange={(event) =>
              update(
                "requestedChanges",
                event.target.value
              )
            }
          />

          {fieldErrors.requestedChanges ? (
            <span className="field-error">
              {
                fieldErrors.requestedChanges
              }
            </span>
          ) : null}
        </div>

        <div className="submit-row cr-actions">
          <button
            type="submit"
            className="btn btn-primary btn-submit"
            disabled={submitting}
          >
            {submitting ? (
              <span
                className="spinner"
                aria-hidden="true"
              />
            ) : null}

            {submitting
              ? t.submitting
              : t.submit}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            {t.cancel}
          </button>
        </div>
      </form>
    </>
  );
}