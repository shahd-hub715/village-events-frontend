import { strings } from "../config/strings";

export default function LoadingState() {
  return (
    <div className="skeleton-list" aria-busy="true">
      <div className="skeleton" />
      <div className="skeleton" />
      <div className="skeleton" />
      <span className="loading-label">{strings.loading.label}</span>
    </div>
  );
}
