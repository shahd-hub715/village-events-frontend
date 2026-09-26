import Modal from "../Modal";
import { adminStrings } from "../../config/adminStrings";
import type { AdminEvent } from "../../types/adminEvent";

interface AdminDeleteConfirmModalProps {
  event: AdminEvent;
  deleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AdminDeleteConfirmModal({
  event,
  deleting,
  onConfirm,
  onCancel
}: AdminDeleteConfirmModalProps) {
  const { remove } = adminStrings;

  return (
    <Modal titleId="admin-delete-title" variant="dialog" onClose={onCancel}>
      <div className="dialog-head">
        <h2 className="dialog-title" id="admin-delete-title">
          {remove.title}
        </h2>
        <button
          type="button"
          className="modal-close"
          aria-label={remove.cancel}
          onClick={onCancel}
        >
          ×
        </button>
      </div>
      <p className="dialog-text">{remove.text(event.personName)}</p>
      <div className="dialog-actions">
        <button
          type="button"
          className="btn btn-danger-solid btn-submit"
          onClick={onConfirm}
          disabled={deleting}
        >
          {deleting ? remove.deleting : remove.confirm}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          {remove.cancel}
        </button>
      </div>
    </Modal>
  );
}
