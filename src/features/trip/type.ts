import { RequestParams } from "@/lib/http/client";

export interface CreateTripRequest {
  city: string;
  startDate: string;
  startTime: string;
  durationHours: number;
  adults: number;
  children: number;
  activities: string[];
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
  activities?: string[];
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
  activities: string[];
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

export interface SubmitTripRequestOfferPayload {
  tripId: string;
  offeredPrice: number | null;
  isInboxOnly: boolean;
  note: string;
}

export interface TripRequestOfferResponse {
  id: string;
  trip: {
    id: string;
    city: string;
    startDate: string;
    startTime: string;
    durationHours: number;
    adults: number;
    children: number;
  };
  buddy: {
    id: string;
    name: string;
    avatar: string;
  };
  offer: {
    price: number;
    isInboxOnly: boolean;
    note: string;
  };
  isExpired: boolean;
  expiresAt: string;
  createdAt: string;
  existingChatRoomId: string | null;
}

export interface StartTripRequestChatResponse {
  chatRoomId: string;
  tripRequestId: string;
  buddyUserId: string;
  buddyName: string;
}
