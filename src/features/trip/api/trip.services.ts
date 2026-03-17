import { httpClient } from "@/lib/http/client";
import type {
  CreateTripRequest,
  CreateTripResponse,
  GetOpenTripsQuery,
  GetOpenTripsResponse,
  GetTripByIdResponse,
} from "../type";

const TRIP_BASE_PATH = "/Trips";

export const tripApi = {
  async createTrip(payload: CreateTripRequest) {
    const res = await httpClient.post<CreateTripResponse, CreateTripRequest>(
      `${TRIP_BASE_PATH}`,
      payload,
    );
    return res.data;
  },

  async getOpenTrips(params: GetOpenTripsQuery) {
    const res = await httpClient.get<GetOpenTripsResponse>(`${TRIP_BASE_PATH}/open`, {
      Page: params.page,
      PageSize: params.pageSize,
    });
    return res.data;
  },

  async getTripById(id: string) {
    const res = await httpClient.get<GetTripByIdResponse>(`${TRIP_BASE_PATH}/${id}`);
    return res.data;
  },
};
