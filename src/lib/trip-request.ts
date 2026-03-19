import type { CreateTripRequest, TripDto } from "@/features/trip/type";
import {
  defaultTripRequestFormData,
  validateTripRequest,
} from "@/lib/data/trip-request";

export const TRIP_REQUEST_STORAGE_KEY = "bonddy.latestTripRequest";
export const TRIP_REQUEST_DRAFT_STORAGE_KEY = "bonddy.tripRequestDraft";

export type TripRequestFormData = {
  city: string;
  startTime: string;
  durationHours: number;
  adults: number;
  children: number;
  preferredLanguage: string;
  notes: string;
};

export type StoredTripRequest = TripRequestFormData & {
  id: string;
  createdAt: string;
  status: string;
};

export type TripRequestValidationErrors = Partial<
  Record<keyof TripRequestFormData, string>
>;

function safeJsonParse<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function isValidDateString(value: string) {
  if (!value) return false;
  return !Number.isNaN(new Date(value).getTime());
}

const normalize = (value: string) => value.trim().toLowerCase();

export { defaultTripRequestFormData, validateTripRequest };

export function formatTripRequestDateTime(value: string) {
  if (!isValidDateString(value)) return "Not available";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatDurationHours(value: number) {
  if (value === 1) return "1 hour";
  return `${value} hours`;
}

export function formatTravelerSummary(adults: number, children: number) {
  const parts = [`${adults} adult${adults === 1 ? "" : "s"}`];

  if (children > 0) {
    parts.push(`${children} child${children === 1 ? "" : "ren"}`);
  }

  return parts.join(", ");
}

function mapPreferredLanguageToApiCodes(preferredLanguage: string) {
  const tokens = preferredLanguage
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);

  if (tokens.length === 0) return [];

  return tokens.map((token) => {
    const normalized = normalize(token);

    if (normalized.includes("vietnam")) return "VN";
    if (normalized.includes("english")) return "EN";
    if (normalized.includes("korean")) return "KR";
    if (normalized.includes("japanese")) return "JP";

    return token.slice(0, 2).toUpperCase();
  });
}

function mapApiLanguageCodeToLabel(code?: string) {
  switch ((code ?? "").toUpperCase()) {
    case "VN":
      return "Vietnamese";
    case "KR":
      return "Korean";
    case "JP":
      return "Japanese";
    case "EN":
      return "English";
    default:
      return code?.toUpperCase() || "English";
  }
}

export function mapTripFormDataToCreateTripRequest(
  formData: TripRequestFormData,
): CreateTripRequest {
  const [startDatePart, startClock = "10:00"] = formData.startTime.split("T");

  return {
    city: formData.city,
    startDate: startDatePart ?? "",
    startTime: startClock.length === 5 ? `${startClock}:00` : startClock,
    durationHours: Math.max(1, formData.durationHours),
    adults: Math.max(1, formData.adults),
    children: Math.max(0, formData.children),
    preferredLanguages: mapPreferredLanguageToApiCodes(formData.preferredLanguage),
    notes: formData.notes.trim(),
  };
}

export function mapTripDtoToStoredTripRequest(
  trip: TripDto,
  fallbackFormData: TripRequestFormData,
): StoredTripRequest {
  return {
    ...fallbackFormData,
    id: trip.id,
    city: trip.city,
    startTime: `${trip.startDate}T${trip.startTime.slice(0, 5)}`,
    durationHours: Math.max(1, trip.durationHours),
    adults: Math.max(1, trip.adults),
    children: Math.max(0, trip.children),
    preferredLanguage: trip.preferredLanguages
      .map((languageCode) => mapApiLanguageCodeToLabel(languageCode))
      .join(", "),
    notes: trip.notes || "",
    createdAt: trip.createdAt,
    status: trip.status,
  };
}

export function saveLatestTripRequest(request: StoredTripRequest) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    TRIP_REQUEST_STORAGE_KEY,
    JSON.stringify(request),
  );
}

export function getLatestTripRequest(): StoredTripRequest | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(TRIP_REQUEST_STORAGE_KEY);
  if (!raw) return null;

  const parsed = safeJsonParse<StoredTripRequest>(raw);
  if (!parsed || typeof parsed !== "object") return null;
  if (!("city" in parsed) || !("startTime" in parsed)) return null;

  return parsed;
}

export function saveTripRequestDraft(formData: TripRequestFormData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    TRIP_REQUEST_DRAFT_STORAGE_KEY,
    JSON.stringify(formData),
  );
}

export function getTripRequestDraft(): TripRequestFormData | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(TRIP_REQUEST_DRAFT_STORAGE_KEY);
  if (!raw) return null;

  const parsed = safeJsonParse<TripRequestFormData>(raw);
  if (!parsed || typeof parsed !== "object") return null;
  if (!("city" in parsed) || !("startTime" in parsed)) return null;

  return parsed;
}

export function clearTripRequestDraft() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TRIP_REQUEST_DRAFT_STORAGE_KEY);
}
