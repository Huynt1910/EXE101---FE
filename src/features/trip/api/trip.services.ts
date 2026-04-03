import { httpClient } from "@/lib/http/client";
import type {
  CreateTripRequest,
  TripUpdateRequest,
  TripDto,
  GetTripsQuery,
} from "@/features/trip/type";
import type { ApiResponse, PaginatedResult } from "@/features/api-type";

const TRIP_BASE_PATH = "/api/Trips";

function normalizeTrip(item: unknown): TripDto {
  const value = item as Partial<TripDto>;

  return {
    id: typeof value.id === "string" ? value.id : "",
    city: typeof value.city === "string" ? value.city : "",
    startDate: typeof value.startDate === "string" ? value.startDate : "",
    startTime: typeof value.startTime === "string" ? value.startTime : "",
    durationHours:
      typeof value.durationHours === "number" ? value.durationHours : 0,
    adults: typeof value.adults === "number" ? value.adults : 0,
    children: typeof value.children === "number" ? value.children : 0,
    activities: Array.isArray(value.activities) ? value.activities : [],
    preferredLanguages: Array.isArray(value.preferredLanguages)
      ? value.preferredLanguages
      : [],
    notes: typeof value.notes === "string" ? value.notes : "",
    status: typeof value.status === "string" ? value.status : "",
    travelerUserId:
      typeof value.travelerUserId === "string" ? value.travelerUserId : "",
    travelerName:
      typeof value.travelerName === "string" ? value.travelerName : "",
    createdAt: typeof value.createdAt === "string" ? value.createdAt : "",
    updatedAt:
      typeof value.updatedAt === "string" ? value.updatedAt : null,
  };
}

function normalizeTripPage(payload: ApiResponse<PaginatedResult<TripDto>>) {
  return {
    ...payload,
    data: {
      ...payload.data,
      items: Array.isArray(payload.data?.items)
        ? payload.data.items.map(normalizeTrip)
        : [],
    },
  };
}

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
    return {
      ...res.data,
      data: normalizeTrip(res.data.data),
    };
  },

  async getMyTrips(params?: GetTripsQuery) {
    const res = await httpClient.get<
      ApiResponse<PaginatedResult<TripDto>>
    >(`${TRIP_BASE_PATH}/my`, params);
    return normalizeTripPage(res.data);
  },

  async getTripsForAdmin(params?: GetTripsQuery) {
    const res = await httpClient.get<
      ApiResponse<PaginatedResult<TripDto>>
    >(TRIP_BASE_PATH,  params );
    return normalizeTripPage(res.data);
  },

  async getOpenTrips(params?: GetTripsQuery) {
    const res = await httpClient.get<
      ApiResponse<PaginatedResult<TripDto>>
    >(`${TRIP_BASE_PATH}/open`,  params );
    return normalizeTripPage(res.data);
  },

  async deleteTrip(id: string) {
    const res = await httpClient.delete<ApiResponse<null>>(
      `${TRIP_BASE_PATH}/${id}`,
    );
    return res.data;
  },
};
