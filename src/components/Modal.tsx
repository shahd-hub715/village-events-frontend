import { useEffect, type ReactNode } from "react";

interface ModalProps {
  titleId: string;
  onClose: () => void;
  /** "sheet" = bottom sheet (the add-event form), "dialog" = small centered popup. */
  variant?: "sheet" | "dialog";
  children: ReactNode;
}

export default function Modal({
  titleId,
  onClose,
  variant = "sheet",
  children
}: ModalProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className={`modal-overlay${variant === "dialog" ? " modal-overlay--center" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={`modal${variant === "dialog" ? " modal--dialog" : ""}`}>
        {children}
      </div>
    </div>
  );
}
