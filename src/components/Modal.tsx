import { useEffect, type ReactNode } from "react";

interface ModalProps {
  titleId: string;
  onClose: () => void;
  /**
   * "sheet" = bottom sheet, "dialog" = small centered popup,
   * "sheet-centered" = same width/spacing as "sheet" but vertically centered like "dialog" (the add-event form).
   */
  variant?: "sheet" | "dialog" | "sheet-centered";
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
      className={`modal-overlay${variant === "dialog" ? " modal-overlay--center" : ""}${
        variant === "sheet-centered" ? " modal-overlay--sheet-centered" : ""
      }`}
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
