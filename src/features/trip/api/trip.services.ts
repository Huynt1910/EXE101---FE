import { httpClient } from "@/lib/http/client";
import type { CreateTripRequest, CreateTripResponse } from "../type";

const TRIP_BASE_PATH = "/Trips";

export const tripApi = {
  async createTrip(payload: CreateTripRequest) {
    const res = await httpClient.post<CreateTripResponse, CreateTripRequest>(
      `${TRIP_BASE_PATH}`,
      payload,
    );
    return res.data;
  },
};
