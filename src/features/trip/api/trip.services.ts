import { httpClient } from "@/lib/http/client";
import type {
  CreateTripRequest,
  TripUpdateRequest,
  TripDto,
  GetTripsQuery,
} from "@/features/trip/type";
import type { ApiResponse, PaginatedResult } from "@/features/api-type";

const TRIP_BASE_PATH = "/Trips";

export const tripApi = {
  async createTrip(payload: CreateTripRequest) {
    const res = await httpClient.post<ApiResponse<TripDto>, CreateTripRequest>(
      `${TRIP_BASE_PATH}`,
      payload,
    );
    return res.data;
  },
  async updateTrip(id: string, payload: TripUpdateRequest) {
    const res = await httpClient.put<ApiResponse<TripDto>, TripUpdateRequest>(
      `${TRIP_BASE_PATH}/${id}`,
      payload,
    );
    return res.data;
  },

  async patchTrip(id: string, payload: TripUpdateRequest) {
    const res = await httpClient.patch<ApiResponse<TripDto>, TripUpdateRequest>(
      `${TRIP_BASE_PATH}/${id}`,
      payload,
    );
    return res.data;
  },

  async getTripById(id: string) {
    const res = await httpClient.get<ApiResponse<TripDto>>(
      `${TRIP_BASE_PATH}/${id}`,
    );
    return res.data;
  },

  async getMyTrips(params?: GetTripsQuery) {
    const res = await httpClient.get<
      ApiResponse<PaginatedResult<TripDto>>
    >(`${TRIP_BASE_PATH}/my`, params);
    return res.data;
  },

  async getTripsForAdmin(params?: GetTripsQuery) {
    const res = await httpClient.get<
      ApiResponse<PaginatedResult<TripDto>>
    >(TRIP_BASE_PATH,  params );
    return res.data;
  },

  async getOpenTrips(params?: GetTripsQuery) {
    const res = await httpClient.get<
      ApiResponse<PaginatedResult<TripDto>>
    >(`${TRIP_BASE_PATH}/open`,  params );
    return res.data;
  },

  async deleteTrip(id: string) {
    const res = await httpClient.delete<ApiResponse<null>>(
      `${TRIP_BASE_PATH}/${id}`,
    );
    return res.data;
  },
};
