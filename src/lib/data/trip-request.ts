import { z } from "zod";
import type {
  TripRequestFormData,
  TripRequestValidationErrors,
} from "@/lib/trip-request";

export const TRIP_REQUEST_CITIES = [
  "District 1",
  "District 2",
  "District 3",
  "District 4",
  "District 5",
  "District 6",
  "District 7",
  "District 8",
  "District 9",
  "District 10",
  "District 11",
  "District 12",
  "Phu Nhuan District",
  "Tan Binh District",
  "Binh Thanh District",
  "Go Vap District",
  "Nha Be District",
  "Cu Chi District",
  "Hoc Mon District",
] as const;

export const location = TRIP_REQUEST_CITIES;

export const defaultTripRequestFormData: TripRequestFormData = {
  city: "",
  startTime: "",
  durationHours: 3,
  adults: 1,
  children: 0,
  preferredLanguage: "English",
  notes: "",
};

function isValidDateString(value: string) {
  if (!value) return false;
  return !Number.isNaN(new Date(value).getTime());
}

export const tripRequestFormSchema = z
  .object({
    city: z.string().trim().min(1, "Location is required."),
    startTime: z.string(),
    durationHours: z.number().finite(),
    adults: z.number().finite(),
    children: z.number().finite(),
    preferredLanguage: z.string().trim(),
    notes: z.string(),
  })
  .superRefine((formData, ctx) => {
    if (!formData.startTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startTime"],
        message: "Please choose a start time.",
      });
    } else if (!isValidDateString(formData.startTime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startTime"],
        message: "Start time is invalid.",
      });
    } else if (new Date(formData.startTime).getTime() <= Date.now()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startTime"],
        message: "Start time must be in the future.",
      });
    }

    if (formData.durationHours <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["durationHours"],
        message: "Duration must be greater than 0.",
      });
    }

    if (formData.adults < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["adults"],
        message: "At least one adult traveler is required.",
      });
    }

    if (formData.children < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["children"],
        message: "Children count cannot be negative.",
      });
    }
  });

export function validateTripRequest(
  formData: TripRequestFormData,
): TripRequestValidationErrors {
  const parsed = tripRequestFormSchema.safeParse(formData);

  if (parsed.success) {
    return {};
  }

  const fieldErrors = parsed.error.flatten().fieldErrors;

  return Object.fromEntries(
    Object.entries(fieldErrors)
      .filter(([, messages]) => Array.isArray(messages) && messages.length > 0)
      .map(([field, messages]) => [field, messages[0]]),
  ) as TripRequestValidationErrors;
}
