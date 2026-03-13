import { buddiesData, type Buddy } from "@/lib/data/buddies";
import type { CreateTripRequest, TripDto } from "@/features/trip/type";

export const TRIP_REQUEST_STORAGE_KEY = "bonddy.latestTripRequest";
export const TRIP_REQUEST_DRAFT_STORAGE_KEY = "bonddy.tripRequestDraft";

export type TripRequestFormData = {
  city: string;
  startTime: string;
  durationMinutes: number;
  groupSize: number;
  preferredLanguage: string;
  budgetMin: number;
  budgetMax: number;
  meetingPoint: string;
  notes: string;
};

export type BookingStatus =
  | "OPEN"
  | "PENDING_BUDDY_CONFIRMATION"
  | "MATCHED"
  | "PROPOSAL_SENT"
  | "PAYMENT_PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "PROPOSAL_REJECTED";

export type PaymentStatus = "unpaid" | "pending" | "paid";

export type TimelineItem = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

export type ProposalData = {
  startTime: string;
  durationMinutes: number;
  meetingPoint: string;
  groupSize: number;
  preferredLanguage: string;
  itinerarySummary: string;
  finalPrice: number;
  cancellationPolicy: string;
  notes: string;
};

export type StoredTripRequest = TripRequestFormData & {
  id: string;
  createdAt: string;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  selectedBuddyId: number | null;
  recommendedBuddyIds: number[];
  proposal: ProposalData | null;
  timeline: TimelineItem[];
};

export type TripRequestValidationErrors = Partial<
  Record<keyof TripRequestFormData, string>
>;

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

const normalize = (value: string) => value.trim().toLowerCase();

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

function createTimelineItem(title: string, description: string): TimelineItem {
  return {
    id: `TL-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    title,
    description,
    createdAt: new Date().toISOString(),
  };
}

export function validateTripRequest(
  formData: TripRequestFormData,
): TripRequestValidationErrors {
  const errors: TripRequestValidationErrors = {};

  if (!formData.city.trim()) {
    errors.city = "Location is required.";
  }

  if (!formData.startTime) {
    errors.startTime = "Please choose a start time.";
  } else if (!isValidDateString(formData.startTime)) {
    errors.startTime = "Start time is invalid.";
  } else if (new Date(formData.startTime).getTime() <= Date.now()) {
    errors.startTime = "Start time must be in the future.";
  }

  if (
    !Number.isFinite(formData.durationMinutes) ||
    formData.durationMinutes <= 0
  ) {
    errors.durationMinutes = "Duration must be greater than 0.";
  }

  if (!Number.isFinite(formData.groupSize) || formData.groupSize < 1) {
    errors.groupSize = "Group size must be at least 1.";
  }

  if (!formData.preferredLanguage.trim()) {
    errors.preferredLanguage = "Preferred language is required.";
  }

  if (!Number.isFinite(formData.budgetMin) || formData.budgetMin < 0) {
    errors.budgetMin = "Budget min is invalid.";
  }

  if (!Number.isFinite(formData.budgetMax) || formData.budgetMax < 0) {
    errors.budgetMax = "Budget max is invalid.";
  }

  if (
    Number.isFinite(formData.budgetMin) &&
    Number.isFinite(formData.budgetMax) &&
    formData.budgetMin > formData.budgetMax
  ) {
    errors.budgetMin = "Budget min must not exceed budget max.";
    errors.budgetMax =
      "Budget max must be greater than or equal to budget min.";
  }

  if (formData.meetingPoint.trim().length < 8) {
    errors.meetingPoint = "Meeting point should be at least 8 characters.";
  }

  return errors;
}

export function getBookingStatusMeta(status: BookingStatus) {
  switch (status) {
    case "PENDING_BUDDY_CONFIRMATION":
      return {
        label: "Pending buddy confirmation",
        description:
          "The selected buddy has received the invite and has not confirmed yet.",
      };
    case "MATCHED":
      return {
        label: "Matched",
        description:
          "The buddy confirmed. You can continue in chat and align the plan.",
      };
    case "PROPOSAL_SENT":
      return {
        label: "Proposal sent",
        description: "A proposal is available for review before payment.",
      };
    case "PAYMENT_PENDING":
      return {
        label: "Payment pending",
        description: "The final plan is accepted. Payment is the next step.",
      };
    case "CONFIRMED":
      return {
        label: "Confirmed",
        description: "Payment is complete and the trip is confirmed.",
      };
    case "IN_PROGRESS":
      return {
        label: "In progress",
        description: "The trip is currently ongoing.",
      };
    case "COMPLETED":
      return {
        label: "Completed",
        description: "The trip is done. The user can leave a review.",
      };
    case "PROPOSAL_REJECTED":
      return {
        label: "Proposal rejected",
        description:
          "The current proposal was rejected. Return to chat or shortlist.",
      };
    case "OPEN":
    default:
      return {
        label: "Open",
        description: "The request is open and ready for buddy selection.",
      };
  }
}

export function formatTripRequestDateTime(value: string) {
  if (!isValidDateString(value)) return "Not available";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatBudgetRange(min: number, max: number) {
  return `${min.toLocaleString("en-US")} - ${max.toLocaleString("en-US")} USD`;
}

export function formatDurationMinutes(value: number) {
  if (value < 60) return `${value} minutes`;

  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  if (minutes === 0) return `${hours} hours`;
  return `${hours} hours ${minutes} minutes`;
}

export function getRecommendedBuddies(formData: TripRequestFormData): Buddy[] {
  const city = normalize(formData.city);
  const language = normalize(formData.preferredLanguage);
  const notes = normalize(formData.notes);

  return Object.values(buddiesData)
    .map((buddy) => {
      const haystack = normalize(
        [
          buddy.location,
          buddy.title,
          buddy.description,
          buddy.buddyBio,
          buddy.highlights.join(" "),
          buddy.activities.join(" "),
          buddy.groupSize,
        ].join(" "),
      );

      let score = buddy.buddyRating * 10;

      if (city && haystack.includes(city)) score += 50;
      if (language) {
        if (language.includes("english")) score += 12;
        if (language.includes("vietnamese")) score += 8;
      }
      if (notes) {
        for (const token of notes.split(/\s+/)) {
          if (token.length > 3 && haystack.includes(token)) score += 2;
        }
      }

      if (buddy.price * Math.max(formData.groupSize, 1) <= formData.budgetMax) {
        score += 10;
      }

      if (formData.groupSize <= 2 && buddy.groupSize.includes("1-")) score += 4;
      if (formData.groupSize >= 4 && buddy.groupSize.includes("10")) score += 4;

      return { buddy, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(({ buddy }) => buddy);
}

function createDefaultProposal(formData: TripRequestFormData): ProposalData {
  return {
    startTime: formData.startTime,
    durationMinutes: formData.durationMinutes,
    meetingPoint: formData.meetingPoint,
    groupSize: formData.groupSize,
    preferredLanguage: formData.preferredLanguage,
    itinerarySummary: `A curated local experience in ${formData.city} with flexible stops based on your notes and budget.`,
    finalPrice: Math.max(
      formData.budgetMin,
      Math.min(formData.budgetMax, formData.groupSize * 35),
    ),
    cancellationPolicy: "Free cancellation 24 hours before start time.",
    notes:
      formData.notes ||
      "Buddy can refine details in chat before final confirmation.",
  };
}

export function createStoredTripRequest(
  formData: TripRequestFormData,
): StoredTripRequest {
  const recommendedBuddyIds = getRecommendedBuddies(formData).map(
    (buddy) => buddy.id,
  );

  return {
    ...formData,
    id: `REQ-${Date.now()}`,
    createdAt: new Date().toISOString(),
    bookingStatus: "OPEN",
    paymentStatus: "unpaid",
    selectedBuddyId: null,
    recommendedBuddyIds,
    proposal: createDefaultProposal(formData),
    timeline: [
      createTimelineItem(
        "Request created",
        `Trip request for ${formData.city} was created and is now open for buddy selection.`,
      ),
    ],
  };
}

function mapPreferredLanguageToApiCodes(preferredLanguage: string) {
  const normalized = preferredLanguage.trim().toLowerCase();

  if (!normalized) return ["EN"];
  if (normalized.includes("vietnam")) return ["VN"];
  if (normalized.includes("english")) return ["EN"];
  if (normalized.includes("korean")) return ["KR"];
  if (normalized.includes("japanese")) return ["JP"];

  return [preferredLanguage.trim().slice(0, 2).toUpperCase() || "EN"];
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
    default:
      return "English";
  }
}

export function mapTripFormDataToCreateTripRequest(
  formData: TripRequestFormData,
): CreateTripRequest {
  const startDate = formData.startTime.split("T")[0] ?? "";
  const startTime = formData.startTime.split("T")[1]
    ? `${formData.startTime.split("T")[1]}:00`
    : "10:00:00";

  return {
    city: formData.city,
    startDate,
    startTime,
    durationHours: Math.max(1, Math.round(formData.durationMinutes / 60)),
    adults: Math.max(1, formData.groupSize),
    children: 0,
    preferredLanguages: mapPreferredLanguageToApiCodes(
      formData.preferredLanguage,
    ),
    notes: formData.notes || "",
  };
}

export function mapTripDtoToStoredTripRequest(
  trip: TripDto,
  fallbackFormData: TripRequestFormData,
): StoredTripRequest {
  const normalizedFormData: TripRequestFormData = {
    ...fallbackFormData,
    city: trip.city,
    startTime: `${trip.startDate}T${trip.startTime.slice(0, 5)}`,
    durationMinutes: Math.max(60, trip.durationHours * 60),
    groupSize: Math.max(1, trip.adults + trip.children),
    preferredLanguage: mapApiLanguageCodeToLabel(trip.preferredLanguages[0]),
    notes: trip.notes || fallbackFormData.notes,
  };

  const recommendedBuddyIds = getRecommendedBuddies(normalizedFormData).map(
    (buddy) => buddy.id,
  );

  return {
    ...normalizedFormData,
    id: trip.id,
    createdAt: trip.createdAt,
    bookingStatus: "OPEN",
    paymentStatus: "unpaid",
    selectedBuddyId: null,
    recommendedBuddyIds,
    proposal: createDefaultProposal(normalizedFormData),
    timeline: [
      createTimelineItem(
        "Request created",
        `Trip request for ${trip.city} was created successfully and is now open for buddy selection.`,
      ),
    ],
  };
}

export function saveLatestTripRequest(request: StoredTripRequest) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    TRIP_REQUEST_STORAGE_KEY,
    JSON.stringify(request),
  );
}

export function updateLatestTripRequest(
  updates: Partial<StoredTripRequest>,
): StoredTripRequest | null {
  const current = getLatestTripRequest();
  if (!current) return null;

  const next = { ...current, ...updates };
  saveLatestTripRequest(next);
  return next;
}

export function appendTripRequestTimeline(
  title: string,
  description: string,
): StoredTripRequest | null {
  const current = getLatestTripRequest();
  if (!current) return null;

  const next = {
    ...current,
    timeline: [...current.timeline, createTimelineItem(title, description)],
  };

  saveLatestTripRequest(next);
  return next;
}

export function chooseBuddyForLatestTripRequest(
  buddyId: number,
): StoredTripRequest | null {
  const current = getLatestTripRequest();
  if (!current) return null;

  const next = {
    ...current,
    selectedBuddyId: buddyId,
    bookingStatus: "PENDING_BUDDY_CONFIRMATION" as BookingStatus,
    timeline: [
      ...current.timeline,
      createTimelineItem(
        "Buddy selected",
        `Buddy #${buddyId} was selected and is pending confirmation.`,
      ),
    ],
  };

  saveLatestTripRequest(next);
  return next;
}

export function advanceBookingStatus(
  status: BookingStatus,
  description?: string,
): StoredTripRequest | null {
  const current = getLatestTripRequest();
  if (!current) return null;

  const titleMap: Record<BookingStatus, string> = {
    OPEN: "Request opened",
    PENDING_BUDDY_CONFIRMATION: "Buddy selected",
    MATCHED: "Buddy confirmed",
    PROPOSAL_SENT: "Proposal sent",
    PAYMENT_PENDING: "Payment pending",
    CONFIRMED: "Trip confirmed",
    IN_PROGRESS: "Trip in progress",
    COMPLETED: "Trip completed",
    PROPOSAL_REJECTED: "Proposal rejected",
  };

  const next = {
    ...current,
    bookingStatus: status,
    timeline: [
      ...current.timeline,
      createTimelineItem(
        titleMap[status],
        description ?? getBookingStatusMeta(status).description,
      ),
    ],
  };

  if (status === "PAYMENT_PENDING") {
    next.paymentStatus = "pending";
  }
  if (status === "CONFIRMED") {
    next.paymentStatus = "paid";
  }

  saveLatestTripRequest(next);
  return next;
}

export function updateLatestTripProposal(
  proposal: ProposalData,
): StoredTripRequest | null {
  const current = getLatestTripRequest();
  if (!current) return null;

  const next = {
    ...current,
    proposal,
    startTime: proposal.startTime,
    durationMinutes: proposal.durationMinutes,
    meetingPoint: proposal.meetingPoint,
    groupSize: proposal.groupSize,
    preferredLanguage: proposal.preferredLanguage,
  };

  saveLatestTripRequest(next);
  return next;
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
