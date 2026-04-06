/**
 * Formats a numeric value using thousands separators.
 *
 * @param value The numeric value to format.
 * @returns A string like `70,000`, or `N/A` when the input is not a finite number.
 */
export function formatNumber(value?: number | null): string {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "N/A";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}
