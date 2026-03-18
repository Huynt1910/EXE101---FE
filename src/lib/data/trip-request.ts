import { z } from "zod";
import type {
  TripRequestFormData,
  TripRequestValidationErrors,
} from "@/lib/trip-request";

export const TRIP_REQUEST_CITIES = [
  "Ha Noi",
  "Ho Chi Minh City",
  "Da Nang",
  "Hoi An",
  "Da Lat",
  "Nha Trang",
  "Sa Pa",
] as const;

export const location = TRIP_REQUEST_CITIES;

export const defaultTripRequestFormData: TripRequestFormData = {
  city: "",
  startTime: "",
  durationMinutes: 180,
  groupSize: 1,
  preferredLanguage: "English",
  budgetMin: 20,
  budgetMax: 120,
  meetingPoint: "",
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
    durationMinutes: z.number().finite(),
    groupSize: z.number().finite(),
    preferredLanguage: z
      .string()
      .trim()
      .min(1, "Preferred language is required."),
    budgetMin: z.number().finite(),
    budgetMax: z.number().finite(),
    meetingPoint: z.string(),
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

    if (formData.durationMinutes <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["durationMinutes"],
        message: "Duration must be greater than 0.",
      });
    }

    if (formData.groupSize < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["groupSize"],
        message: "Group size must be at least 1.",
      });
    }

    if (formData.budgetMin < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["budgetMin"],
        message: "Budget min is invalid.",
      });
    }

    if (formData.budgetMax < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["budgetMax"],
        message: "Budget max is invalid.",
      });
    }

    if (formData.budgetMin > formData.budgetMax) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["budgetMin"],
        message: "Budget min must not exceed budget max.",
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["budgetMax"],
        message: "Budget max must be greater than or equal to budget min.",
      });
    }

    if (formData.meetingPoint.trim().length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["meetingPoint"],
        message: "Meeting point should be at least 8 characters.",
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
