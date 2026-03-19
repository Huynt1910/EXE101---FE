import type { ApiResponse } from "@/features/api-type";
import type {
  SubmitTripRequestOfferPayload,
  TripRequestOfferResponse,
} from "@/features/trip/type";
import { httpClient } from "@/lib/http/client";

const TRIP_REQUEST_BASE_PATH = "/TripRequests";

export const tripRequestApi = {
  async submitOffer(payload: SubmitTripRequestOfferPayload) {
    const res = await httpClient.post<
      ApiResponse<TripRequestOfferResponse>,
      SubmitTripRequestOfferPayload
    >(TRIP_REQUEST_BASE_PATH, payload);

    return res.data;
  },
};
