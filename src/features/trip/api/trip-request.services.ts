import type { ApiResponse } from "@/features/api-type";
import type {
  StartTripRequestChatResponse,
  SubmitTripRequestOfferPayload,
  TripRequestOfferResponse,
} from "@/features/trip/type";
import { httpClient } from "@/lib/http/client";

const TRIP_REQUEST_BASE_PATH = "/api/TripRequests";

export const tripRequestApi = {
  async submitOffer(payload: SubmitTripRequestOfferPayload) {
    const res = await httpClient.post<
      ApiResponse<TripRequestOfferResponse>,
      SubmitTripRequestOfferPayload
    >(TRIP_REQUEST_BASE_PATH, payload);

    return res.data;
  },

  async startChat(tripRequestId: string) {
    const res = await httpClient.post<
      ApiResponse<StartTripRequestChatResponse>
    >(`${TRIP_REQUEST_BASE_PATH}/${tripRequestId}/start-chat`);

    return res.data;
  },
};
