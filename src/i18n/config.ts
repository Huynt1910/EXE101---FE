export type Language = "vi" | "en";

export const languages = ["vi", "en"] as const;

export function isLanguage(value: string): value is Language {
  return languages.includes(value as Language);
}
