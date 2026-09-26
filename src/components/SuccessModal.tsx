import { useEffect } from "react";
import { strings } from "../config/strings";
import Modal from "./Modal";

interface SuccessModalProps {
  /** Backend message, shown when it carries extra context (e.g. a conflict notice). */
  message?: string;
  onClose: () => void;
  /** Auto-dismiss delay in ms. */
  autoCloseMs?: number;
}

export default function SuccessModal({
  message,
  onClose,
  autoCloseMs = 5000
}: SuccessModalProps) {
  useEffect(() => {
    if (!autoCloseMs) return;
    const timer = window.setTimeout(onClose, autoCloseMs);
    return () => window.clearTimeout(timer);
  }, [autoCloseMs, onClose]);

  return (
    <Modal titleId="submission-success-title" variant="dialog" onClose={onClose}>
      <div className="dialog-head">
        <h2 className="dialog-title" id="submission-success-title">
          {strings.submission.successTitle}
        </h2>
        <button
          type="button"
          className="modal-close"
          aria-label={strings.submission.close}
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <p className="dialog-text">{message || strings.submission.successText}</p>
    </Modal>
  );
}
