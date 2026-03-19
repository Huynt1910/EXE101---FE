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

export interface GetTripsQuery extends RequestParams {
  City?: string;
  Status?: string;
  StartForm?: string;
  StartTo?: string;
  Search?: string;
  Page?: number;
  PageSize?: number;
  SortBy?: string;
  SortOder?: "asc" | "desc";
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
