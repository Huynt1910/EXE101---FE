import { en } from "./en";
import { vi } from "./vi";

export const messages = {
  vi,
  en,
} as const;

export type Messages = typeof messages;
