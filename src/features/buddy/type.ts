import type { ApiResponse, PaginatedResult } from "@/features/api-type";
import type { RequestParams } from "@/lib/http/client";

export interface BuddyProfile {
  id: string;
  userId: string | null;
  fullName: string | null;
  email: string | null;
  gender: string | null;
  phoneNumber: string | null;
  address: string | null;
  dateOfBirth: string | null;
  aboutMe: string | null;
  profilePicture: string | null;
  activities: string[];
  costPerHour: number | null;
  rate: number | null;
  languages: string[];
  bio: string | null;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface BuddyReview {
  id: string;
  bookingId: string | null;
  reviewerUserId: string | null;
  reviewerName: string | null;
  rating: number;
  comment: string | null;
  isPublic: boolean;
  createdAt: string | null;
}

export interface BuddyReviewsQuery extends RequestParams {
  page?: number;
  pageSize?: number;
}

export interface BuddyReviewsList extends PaginatedResult<BuddyReview> {}

export interface RegisterAsBuddyRequest {
  activities: string[];
  costPerHour: number;
  languages: string[];
  bio: string;
}

export type GetBuddiesResponse = ApiResponse<BuddyProfile[]>;
export type GetBuddyDetailResponse = ApiResponse<BuddyProfile>;
export type GetBuddyReviewsResponse = ApiResponse<BuddyReviewsList | BuddyReview[]>;
export type RegisterAsBuddyResponse = ApiResponse<BuddyProfile>;
export interface Buddy {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  gender: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  aboutMe: string;
  profilePicture: string;
  activities: string[];
  costPerHour: number;
  rate: number;
  languages: string[];
  bio: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}
