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
  subscription: BuddySubscription | null;
}

export interface BuddySubscription {
  subscriptionId: string | null;
  servicePackageId: string | null;
  packageName: string | null;
  commissionRate: number | null;
  startDate: string | null;
  endDate: string | null;
  status: string | null;
  paymentMethod: string | null;
  amountPaid: number | null;
  currency: string | null;
  externalPaymentRef: string | null;
  paidAt: string | null;
  downgradeToPackageId: string | null;
  downgradeToPackageName: string | null;
  isCancelledAtEndOfCycle: boolean;
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

export interface UpdateBuddyProfileRequest {
  fullName: string;
  gender: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string | null;
  aboutMe: string;
  activities: string[];
  costPerHour: number;
  languages: string[];
  bio: string;
}

// GET /api/Bookings/my/buddy
export interface BuddyBooking {
  id: string;
  tripId: string;
  tripRequestId: string;
  buddyId: string;
  buddyName: string;
  buddyAvatar: string;
  travelerUserId: string;
  travelerName: string;
  chatRoomId: string;
  bookedDate: string;
  bookedStartTime: string;
  bookedDurationHours: number;
  bookedAdults: number;
  bookedChildren: number;
  price: number;
  currency: string;
  platformFeeAmount: number;
  totalAmount: number;
  includes: string;
  excludes: string;
  noteForCustomer: string;
  status: string;
  statusName: string;
  paymentDeadline: string;
  createdAt: string;
  updatedAt: string;
}

// GET /api/TripRequests/my
export interface MyTripRequestTrip {
  id: string;
  city: string;
  startDate: string;
  startTime: string;
  durationHours: number;
  adults: number;
  children: number;
}

export interface MyTripRequestOffer {
  price: number;
  isInboxOnly: boolean;
  note: string;
}

export interface MyTripRequest {
  id: string;
  trip: MyTripRequestTrip;
  buddy: {
    id: string;
    name: string;
    avatar: string;
  };
  offer: MyTripRequestOffer;
  isExpired: boolean;
  expiresAt: string;
  createdAt: string;
  existingChatRoomId: string | null;
}

export type GetBuddiesResponse = ApiResponse<BuddyProfile[]>;
export type GetBuddyDetailResponse = ApiResponse<BuddyProfile>;
export type GetBuddyReviewsResponse = ApiResponse<BuddyReviewsList | BuddyReview[]>;
export type RegisterAsBuddyResponse = ApiResponse<BuddyProfile>;
export type GetBuddyMeResponse = ApiResponse<BuddyProfile>;
export type GetMyBuddyBookingsResponse = ApiResponse<BuddyBooking[]>;
export type GetMyTripRequestsResponse = ApiResponse<MyTripRequest[]>;
export type UpdateBuddyProfileResponse = ApiResponse<BuddyProfile>;
export type UploadBuddyAvatarResponse = ApiResponse<BuddyProfile>;
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
  subscription?: BuddySubscription | null;
}
