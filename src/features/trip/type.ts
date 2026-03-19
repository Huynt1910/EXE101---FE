import { RequestParams } from "@/lib/http/client";

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

export interface TripUpdateRequest {
  city?: string;
  startDate?: string;
  startTime?: string;
  durationHours?: number;
  adults?: number;
  children?: number;
  preferredLanguages?: string[];
  notes?: string;
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

export type TripRequest = CreateTripRequest;
export type TripResponse = TripDto;

export interface GetTripsQuery extends RequestParams {
  City?: string;
  Status?: string;
  StartFrom?: string;
  StartTo?: string;
  Search?: string;
  Page?: number;
  PageSize?: number;
  SortBy?: string;
  SortOrder?: "asc" | "desc";
}
