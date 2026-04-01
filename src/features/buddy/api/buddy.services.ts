import type {
  BuddyProfile,
  BuddyReview,
  BuddyReviewsList,
  BuddyReviewsQuery,
  GetBuddyDetailResponse,
  GetBuddyReviewsResponse,
  GetBuddiesResponse,
  RegisterAsBuddyRequest,
  RegisterAsBuddyResponse,
} from "@/features/buddy/type";
import { httpClient } from "@/lib/http/client";

const BUDDY_BASE_PATH = "/api/Buddies";

function normalizeText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function normalizeDate(value: unknown) {
  const text = normalizeText(value);
  if (!text || text.startsWith("0001-01-01")) return null;
  return text;
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && item.toLowerCase() !== "string");
}

function normalizeBuddy(item: unknown): BuddyProfile {
  const value = item as Partial<BuddyProfile>;

  return {
    id: normalizeText(value.id) ?? "",
    userId: normalizeText(value.userId),
    fullName: normalizeText(value.fullName),
    email: normalizeText(value.email),
    gender: normalizeText(value.gender),
    phoneNumber: normalizeText(value.phoneNumber),
    address: normalizeText(value.address),
    dateOfBirth: normalizeDate(value.dateOfBirth),
    aboutMe: normalizeText(value.aboutMe),
    profilePicture: normalizeText(value.profilePicture),
    activities: normalizeStringArray(value.activities),
    costPerHour:
      typeof value.costPerHour === "number" && Number.isFinite(value.costPerHour)
        ? value.costPerHour
        : null,
    rate:
      typeof value.rate === "number" && Number.isFinite(value.rate)
        ? value.rate
        : null,
    languages: normalizeStringArray(value.languages),
    bio: normalizeText(value.bio),
    isActive: value.isActive !== false,
    createdAt: normalizeDate(value.createdAt),
    updatedAt: normalizeDate(value.updatedAt),
  };
}

function normalizeBuddyReview(item: unknown): BuddyReview {
  const value = item as Partial<BuddyReview>;

  return {
    id: normalizeText(value.id) ?? "",
    bookingId: normalizeText(value.bookingId),
    reviewerUserId: normalizeText(value.reviewerUserId),
    reviewerName: normalizeText(value.reviewerName),
    rating:
      typeof value.rating === "number" && Number.isFinite(value.rating)
        ? value.rating
        : 0,
    comment: normalizeText(value.comment),
    isPublic: value.isPublic !== false,
    createdAt: normalizeDate(value.createdAt),
  };
}

function normalizeBuddyReviewsPayload(payload: unknown): BuddyReviewsList {
  if (payload && typeof payload === "object" && "items" in payload) {
    const value = payload as Partial<BuddyReviewsList>;
    const items = Array.isArray(value.items)
      ? value.items.map(normalizeBuddyReview)
      : [];
    const page = typeof value.page === "number" ? value.page : 1;
    const pageSize =
      typeof value.pageSize === "number" ? value.pageSize : Math.max(items.length, 1);
    const totalCount =
      typeof value.totalCount === "number" ? value.totalCount : items.length;
    const totalPages =
      typeof value.totalPages === "number"
        ? value.totalPages
        : Math.max(1, Math.ceil(totalCount / Math.max(pageSize, 1)));

    return {
      items,
      totalCount,
      page,
      pageSize,
      totalPages,
      hasPreviousPage:
        typeof value.hasPreviousPage === "boolean" ? value.hasPreviousPage : page > 1,
      hasNextPage:
        typeof value.hasNextPage === "boolean" ? value.hasNextPage : page < totalPages,
    };
  }

  const items = Array.isArray(payload) ? payload.map(normalizeBuddyReview) : [];

  return {
    items,
    totalCount: items.length,
    page: 1,
    pageSize: Math.max(items.length, 1),
    totalPages: items.length > 0 ? 1 : 0,
    hasPreviousPage: false,
    hasNextPage: false,
  };
}

export const buddyApi = {
  async getBuddies() {
    const res = await httpClient.get<GetBuddiesResponse>(BUDDY_BASE_PATH);

    return {
      ...res.data,
      data: Array.isArray(res.data.data) ? res.data.data.map(normalizeBuddy) : [],
    };
  },

  async getBuddyById(id: string) {
    const res = await httpClient.get<GetBuddyDetailResponse>(`${BUDDY_BASE_PATH}/${id}`);

    return {
      ...res.data,
      data: normalizeBuddy(res.data.data),
    };
  },

  async getBuddyReviews(buddyId: string, params?: BuddyReviewsQuery) {
    const res = await httpClient.get<GetBuddyReviewsResponse>(
      `${BUDDY_BASE_PATH}/${buddyId}/reviews`,
      params,
    );

    return {
      ...res.data,
      data: normalizeBuddyReviewsPayload(res.data.data),
    };
  },

  async registerAsBuddy(payload: RegisterAsBuddyRequest) {
    const res = await httpClient.post<RegisterAsBuddyResponse, RegisterAsBuddyRequest>(
      `${BUDDY_BASE_PATH}/register-as-buddy`,
      payload,
    );

    return {
      ...res.data,
      data: normalizeBuddy(res.data.data),
    };
  },
};
