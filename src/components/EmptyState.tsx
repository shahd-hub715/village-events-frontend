import { strings } from "../config/strings";

interface EmptyStateProps {
  title: string;
  text?: string;
  onAddEvent: () => void;
}

export default function EmptyState({ title, text, onAddEvent }: EmptyStateProps) {
  return (
    <div className="empty-card">
      <div className="empty-icon" aria-hidden="true" />
      <strong className="card-title">{title}</strong>
      <p className="card-text card-text--center">{text ?? strings.empty.text}</p>
      <button type="button" className="btn btn-primary btn-small" onClick={onAddEvent}>
        {strings.empty.cta}
      </button>
    </div>
  );
}
