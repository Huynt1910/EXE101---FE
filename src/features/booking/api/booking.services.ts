import { httpClient } from "@/lib/http/client";
import type {
  ConfirmBookingAndPayResponse,
  CreateBookingPayload,
  CreateBookingOfferPayload,
  CreateBookingOfferResponse,
  GetBookingDetailResponse,
} from "@/features/booking/type";

const TRIP_REQUEST_BOOKING_BASE_PATH = "/api/TripRequests";
const BOOKING_BASE_PATH = "/api/Bookings";

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

  async confirmAndCreatePaypalOrder(bookingId: string) {
    const res = await httpClient.post<ConfirmBookingAndPayResponse>(
      `${BOOKING_BASE_PATH}/${bookingId}/confirm-and-create-paypal-order`,
    );

    return res.data;
  },
};
