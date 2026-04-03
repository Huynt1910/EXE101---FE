/**
 * Joins an array of strings into a comma-separated string.
 *
 * Empty or falsy items are removed before joining.
 *
 * @param value The array of string values to join.
 * @returns A comma-separated string, or an empty string if the input is null or undefined.
 */
export function formatStringList(value?: string[] | null): string {
  return value?.filter(Boolean).join(", ") ?? "";
}
