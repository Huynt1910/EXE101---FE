/**
 * Formats a date  string into a human-readable format.
 *
 * Use this for values that contain only a date, such as `YYYY-MM-DD`.
 *
 * @param value The raw date string to format.
 * @returns A formatted date like `3 Apr 2026`, or `N/A` if the value is empty.
 */
export function formatDate(value?: string | null) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(date);
}

/**
 * Formats a time string into a human-readable format.
 *
 * Use this for values that contain only a time, such as `HH:mm:ss`.
 *
 * @param value The raw time string to format.
 * @returns A formatted time like `14:30`, or `N/A` if the value is empty.
 */
export function formatTime(value?: string | null): string {
  if (!value) return "N/A";

  if (/^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
    return value.slice(0, 5);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

/**
 * Formats a date and time string into a human-readable format.
 *
 * Use this for values that contain both date and time, such as `YYYY-MM-DD HH:mm:ss`.
 *
 * @param value The raw date and time string to format.
 * @returns A formatted date and time like `3 Apr 2026, 14:30`, or `N/A` if the value is empty.
 */
export function formatDateTime(value?: string | null): string {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
