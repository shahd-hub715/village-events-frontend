import { strings } from "../config/strings";

interface ErrorMessageProps {
  onRetry: () => void;
}

export default function ErrorMessage({ onRetry }: ErrorMessageProps) {
  return (
    <div className="error-card" role="alert">
      <strong className="card-title">{strings.error.title}</strong>
      <p className="card-text">{strings.error.text}</p>
      <button type="button" className="btn btn-quiet" onClick={onRetry}>
        {strings.error.retry}
      </button>
    </div>
  );
}
