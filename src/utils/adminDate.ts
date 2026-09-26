/** "٢٠ أيلول ٢٠٢٦، ٩:٤٠ م" — submission timestamps as the backend sends them. */
export function formatSubmittedAt(value: string): string | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("ar", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}
