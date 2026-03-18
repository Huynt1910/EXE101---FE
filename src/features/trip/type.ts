import { RequestParams } from "@/lib/http/client";

export interface TripRequest {
  city: string;
  startDate: string;
  startTime: string;
  durationHours: number;
  adults: number;
  children: number;
  preferredLanguages: string[];
  notes: string;
}

export interface TripResponse {
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

export type CreateTripRequest = TripRequest;
export type TripDto = TripResponse;

export interface GetTripsQuery extends RequestParams {
  city?: string;
  status?: string;
  startFrom?: string;
  startTo?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
