import { httpClient } from "@/lib/http/client";
import type {
  ConfirmBookingAndPayResponse,
  CreateBookingPayload,
  CreateBookingOfferPayload,
  CreateBookingOfferResponse,
  CreateBookingReviewPayload,
  CreateBookingReviewResponse,
  GetBookingDetailResponse,
  GetBookingReviewResponse,
  GetTravelerBookingsResponse,
  TravelerBookingsList,
  BookingOffer,
  BookingReview,
} from "@/features/booking/type";

const TRIP_REQUEST_BOOKING_BASE_PATH = "/api/TripRequests";
const BOOKING_BASE_PATH = "/api/Bookings";

function normalizeBookingReview(payload: unknown): BookingReview {
  const value = (payload ?? {}) as Partial<BookingReview>;

  return {
    id: typeof value.id === "string" ? value.id : "",
    bookingId: typeof value.bookingId === "string" ? value.bookingId : null,
    reviewerUserId:
      typeof value.reviewerUserId === "string" ? value.reviewerUserId : null,
    reviewerName:
      typeof value.reviewerName === "string" ? value.reviewerName : null,
    rating:
      typeof value.rating === "number" && Number.isFinite(value.rating)
        ? value.rating
        : 0,
    comment: typeof value.comment === "string" ? value.comment : null,
    isPublic: value.isPublic !== false,
    createdAt: typeof value.createdAt === "string" ? value.createdAt : null,
  };
}

function normalizeTravelerBookingsPayload(payload: unknown): TravelerBookingsList {
  if (payload && typeof payload === "object" && "items" in payload) {
    const candidate = payload as Partial<TravelerBookingsList>;
    const items = Array.isArray(candidate.items)
      ? (candidate.items as BookingOffer[])
      : [];
    const page = candidate.page ?? 1;
    const pageSize = candidate.pageSize ?? Math.max(items.length, 1);
    const totalCount = candidate.totalCount ?? items.length;
    const totalPages =
      candidate.totalPages ?? Math.max(1, Math.ceil(totalCount / Math.max(pageSize, 1)));

    return {
      items,
      totalCount,
      page,
      pageSize,
      totalPages,
      hasPreviousPage: candidate.hasPreviousPage ?? page > 1,
      hasNextPage: candidate.hasNextPage ?? page < totalPages,
    };
  }

  const items = Array.isArray(payload) ? (payload as BookingOffer[]) : [];

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

export const bookingApi = {
  async createBooking(payload: CreateBookingPayload) {
    const res = await httpClient.post<
      CreateBookingOfferResponse,
      CreateBookingPayload
    >(BOOKING_BASE_PATH, payload);

    return res.data;
  },

  async createOfferByTripRequest(tripRequestId: string, payload: CreateBookingOfferPayload) {
    const res = await httpClient.post<
      CreateBookingOfferResponse,
      CreateBookingOfferPayload
    >(`${TRIP_REQUEST_BOOKING_BASE_PATH}/${tripRequestId}/booking`, payload);

    return res.data;
  },

  async getBookingDetail(bookingId: string) {
    const res = await httpClient.get<GetBookingDetailResponse>(
      `${BOOKING_BASE_PATH}/${bookingId}`,
    );

    return res.data;
  },

  async getMyTravelerBookings() {
    const res = await httpClient.get<GetTravelerBookingsResponse>(
      `${BOOKING_BASE_PATH}/my/traveler`,
    );

    return {
      ...res.data,
      data: normalizeTravelerBookingsPayload(res.data.data),
    };
  },

  async confirmAndCreatePaypalOrder(bookingId: string) {
    const res = await httpClient.post<ConfirmBookingAndPayResponse>(
      `${BOOKING_BASE_PATH}/${bookingId}/confirm-and-create-paypal-order`,
    );

    return res.data;
  },

  async getBookingReview(bookingId: string) {
    const res = await httpClient.get<GetBookingReviewResponse>(
      `${BOOKING_BASE_PATH}/${bookingId}/review`,
    );

    return {
      ...res.data,
      data: res.data.data ? normalizeBookingReview(res.data.data) : null,
    };
  },

  async createBookingReview(
    bookingId: string,
    payload: CreateBookingReviewPayload,
  ) {
    const res = await httpClient.post<
      CreateBookingReviewResponse,
      CreateBookingReviewPayload
    >(`${BOOKING_BASE_PATH}/${bookingId}/review`, payload);

    return {
      ...res.data,
      data: normalizeBookingReview(res.data.data),
    };
  },
};
