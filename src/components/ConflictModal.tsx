import { strings } from "../config/strings";
import Modal from "./Modal";

interface ConflictModalProps {
  submitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConflictModal({
  submitting,
  onConfirm,
  onCancel
}: ConflictModalProps) {
  return (
    <Modal titleId="submission-conflict-title" variant="dialog" onClose={onCancel}>
      <div className="dialog-head">
        <h2 className="dialog-title" id="submission-conflict-title">
          {strings.submission.conflictTitle}
        </h2>
        <button
          type="button"
          className="modal-close"
          aria-label={strings.submission.close}
          onClick={onCancel}
        >
          ×
        </button>
      </div>
      <p className="dialog-text">{strings.submission.conflictText}</p>
      <div className="dialog-actions">
        <button
          type="button"
          className="btn btn-primary btn-submit"
          onClick={onConfirm}
          disabled={submitting}
        >
          {submitting ? <span className="spinner" aria-hidden="true" /> : null}
          {submitting ? strings.form.submitting : strings.submission.confirm}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          {strings.submission.cancel}
        </button>
      </div>
    </Modal>
  );
}
