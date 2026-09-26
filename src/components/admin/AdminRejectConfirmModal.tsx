import Modal from "../Modal";
import { adminStrings } from "../../config/adminStrings";
import type { AdminEvent } from "../../types/adminEvent";

interface AdminRejectConfirmModalProps {
  event: AdminEvent;
  working: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AdminRejectConfirmModal({
  event,
  working,
  onConfirm,
  onCancel
}: AdminRejectConfirmModalProps) {
  const { reject, actions } = adminStrings;
  const published = event.status === "APPROVED";

  return (
    <Modal titleId="admin-reject-title" variant="dialog" onClose={onCancel}>
      <div className="dialog-head">
        <h2 className="dialog-title" id="admin-reject-title">
          {published ? reject.publishedTitle : reject.title}
        </h2>
        <button
          type="button"
          className="modal-close"
          aria-label={reject.cancel}
          onClick={onCancel}
        >
          ×
        </button>
      </div>
      <p className="dialog-text">
        {event.personName} — {published ? reject.publishedText : reject.text}
      </p>
      <div className="dialog-actions">
        <button
          type="button"
          className="btn btn-primary btn-submit"
          onClick={onConfirm}
          disabled={working}
        >
          {working ? <span className="spinner" aria-hidden="true" /> : null}
          {working ? actions.working : published ? actions.unpublish : reject.confirm}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          {reject.cancel}
        </button>
      </div>
    </Modal>
  );
}
