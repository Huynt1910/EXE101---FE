import { buddiesData, type Buddy } from "@/lib/data/buddies";

export const TRIP_REQUEST_STORAGE_KEY = "bonddy.latestTripRequest";
export const TRIP_REQUEST_DRAFT_STORAGE_KEY = "bonddy.tripRequestDraft";

export type TripRequestFormData = {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  departureCity: string;
  budgetRange: string;
  travelStyles: string[];
  notes: string;
};

export type StoredTripRequest = TripRequestFormData & {
  id: string;
  createdAt: string;
  recommendedBuddyIds: number[];
};

const normalize = (value: string) => value.trim().toLowerCase();

const styleKeywords: Record<string, string[]> = {
  Food: ["food", "street food", "coffee", "cooking", "market"],
  Relaxation: ["relax", "slow", "beach", "river", "eco"],
  Adventure: ["adventure", "motorbike", "outdoor", "cycling", "mangrove"],
  Culture: ["culture", "history", "museum", "traditional", "art", "local"],
  Family: ["family", "safe", "group", "local life"],
  Photography: ["photo", "photography", "view", "art", "creative"],
};

export const defaultTripRequestFormData: TripRequestFormData = {
  destination: "",
  startDate: "",
  endDate: "",
  travelers: 2,
  departureCity: "",
  budgetRange: "",
  travelStyles: [],
  notes: "",
};

export function getRecommendedBuddies(formData: TripRequestFormData): Buddy[] {
  const destination = normalize(formData.destination);
  const notes = normalize(formData.notes);
  const departureCity = normalize(formData.departureCity);

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
        ].join(" "),
      );

      let score = buddy.buddyRating * 10;

      if (destination && haystack.includes(destination)) score += 60;
      if (departureCity && haystack.includes(departureCity)) score += 10;
      if (notes) {
        for (const token of notes.split(/\s+/)) {
          if (token.length > 3 && haystack.includes(token)) score += 2;
        }
      }

      for (const style of formData.travelStyles) {
        const keywords = styleKeywords[style] ?? [];
        if (keywords.some((keyword) => haystack.includes(keyword))) score += 18;
      }

      const budgetNumbers = formData.budgetRange.match(/\d+/g)?.map(Number) ?? [];
      const maxBudget =
        budgetNumbers.length > 1 ? Math.max(...budgetNumbers) : budgetNumbers[0];
      if (maxBudget && buddy.price * Math.max(formData.travelers, 1) <= maxBudget) {
        score += 8;
      }

      return { buddy, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ buddy }) => buddy);
}

export function createStoredTripRequest(
  formData: TripRequestFormData,
): StoredTripRequest {
  const recommendedBuddyIds = getRecommendedBuddies(formData).map(
    (buddy) => buddy.id,
  );

  return {
    ...formData,
    id: `TRIP-${Date.now()}`,
    createdAt: new Date().toISOString(),
    recommendedBuddyIds,
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

  try {
    return JSON.parse(raw) as StoredTripRequest;
  } catch {
    return null;
  }
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

  try {
    return JSON.parse(raw) as TripRequestFormData;
  } catch {
    return null;
  }
}

export function clearTripRequestDraft() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TRIP_REQUEST_DRAFT_STORAGE_KEY);
}
