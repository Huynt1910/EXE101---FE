import type { ApiResponse } from "@/features/api-type";

export interface CreateTripRequest {
  city: string;
  startDate: string;
  startTime: string;
  durationHours: number;
  adults: number;
  children: number;
  preferredLanguages: string[];
  notes: string;
}

export interface TripDto {
  id: string;
  city: string;
  startDate: string;
  startTime: string;
  durationHours: number;
  adults: number;
  children: number;
  preferredLanguages: string[];
  notes: string;
  status: string;
  travelerUserId: string;
  travelerName: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface TripListData {
  items: TripDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface GetOpenTripsQuery {
  page: number;
  pageSize: number;
}

export type TripResponse = TripDto;

export type CreateTripResponse = ApiResponse<TripDto>;
export type GetOpenTripsResponse = ApiResponse<TripListData>;
export type GetTripByIdResponse = ApiResponse<TripDto>;
