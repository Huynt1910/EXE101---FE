import type { ApiResponse, PaginatedResult } from "@/features/api-type";
import type { RequestParams } from "@/lib/http/client";

export type AdminGender = "Male" | "Female" | "Other" | string;
export type AdminBookingStatus =
  | "PendingCustomerConfirm"
  | "PendingPayment"
  | "Confirmed"
  | "InProgress"
  | "Completed"
  | "Cancelled"
  | "CancelledByTimeout"
  | "Expired"
  | string;
export type AdminTripStatus = "Draft" | "Open" | "Closed" | "Expired" | "Deleted" | string;
export type AdminIncidentStatus = "Open" | "InReview" | "Resolved" | "Closed" | string;
export type AdminIncidentType =
  | "NoShow"
  | "LateArrival"
  | "QualityIssue"
  | "SafetyIssue"
  | "PaymentIssue"
  | "Other"
  | string;

export interface AdminUsersQuery extends RequestParams {
  Gender?: AdminGender;
  IsEmailVerified?: boolean;
  CreatedFrom?: string;
  CreatedTo?: string;
  Search?: string;
  Page?: number;
  PageSize?: number;
  SortBy?: string;
  SortOrder?: string;
}

export interface AdminTripsQuery extends RequestParams {
  City?: string;
  Status?: AdminTripStatus;
  StartFrom?: string;
  StartTo?: string;
  Search?: string;
  Page?: number;
  PageSize?: number;
  SortBy?: string;
  SortOrder?: string;
}

export interface AdminBookingsQuery extends RequestParams {
  Status?: AdminBookingStatus;
  BuddyName?: string;
  TravelerName?: string;
  BookedFrom?: string;
  BookedTo?: string;
  Search?: string;
  Page?: number;
  PageSize?: number;
  SortBy?: string;
  SortOrder?: string;
}

export interface AdminBuddiesQuery extends RequestParams {
  Search?: string;
  Page?: number;
  PageSize?: number;
  SortBy?: string;
  SortOrder?: string;
}

export interface AdminIncidentsQuery extends RequestParams {
  Status?: AdminIncidentStatus;
  Type?: AdminIncidentType;
  BookingId?: string;
  Page?: number;
  PageSize?: number;
}

export interface AdminOverviewQuery extends RequestParams {
  from?: string;
  to?: string;
}

export interface AdminOverviewTopBuddiesQuery extends AdminOverviewQuery {
  top?: number;
}

export interface AdminOverviewSummaryQuery extends AdminOverviewQuery {}

export interface AdminUser {
  id: string;
  email: string | null;
  fullName: string | null;
  gender: AdminGender;
  roles: string[] | null;
  phoneNumber: string | null;
  address: string | null;
  dateOfBirth: string | null;
  aboutMe: string | null;
  profilePicture: string | null;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface AdminUserUpdateRequest {
  fullName?: string | null;
  gender?: AdminGender | null;
  phoneNumber?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
  aboutMe?: string | null;
}

export interface AdminBuddy {
  id: string;
  userId?: string | null;
  fullName?: string | null;
  name?: string | null;
  email?: string | null;
  avatar?: string | null;
  profilePicture?: string | null;
  gender?: AdminGender | null;
  phoneNumber?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
  aboutMe?: string | null;
  activities?: string[] | null;
  costPerHour?: number | null;
  rate?: number | null;
  languages?: string[] | null;
  bio?: string | null;
  isActive?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  subscription?: AdminBuddySubscription | null;
}

export interface AdminBuddySubscription {
  subscriptionId: string | null;
  servicePackageId: string | null;
  packageName: string | null;
  commissionRate: number | null;
  status: string | null;
  startDate: string | null;
  endDate: string | null;
  amountPaid: number | null;
  currency: string | null;
  paidAt: string | null;
}

export interface AdminBuddyRegisterRequest {
  activities?: string[] | null;
  costPerHour: number;
  languages?: string[] | null;
  bio?: string | null;
}

export interface AdminBuddyUpdateRequest {
  activities?: string[] | null;
  costPerHour?: number | null;
  languages?: string[] | null;
  bio?: string | null;
  isActive?: boolean | null;
}

export interface AdminTrip {
  id: string;
  city: string | null;
  startDate: string;
  startTime: string;
  durationHours: number;
  adults: number;
  children: number;
  activities?: string[] | null;
  preferredLanguages: string[] | null;
  notes: string | null;
  status: AdminTripStatus;
  travelerUserId: string;
  travelerName: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface AdminBooking {
  id: string;
  tripId?: string | null;
  tripRequestId?: string | null;
  buddyId?: string | null;
  buddyName?: string | null;
  buddyAvatar?: string | null;
  travelerUserId?: string | null;
  travelerName?: string | null;
  chatRoomId?: string | null;
  bookedDate?: string | null;
  bookedStartTime?: string | null;
  bookedDurationHours?: number | null;
  bookedAdults?: number | null;
  bookedChildren?: number | null;
  price?: number | null;
  currency?: string | null;
  platformFeeAmount?: number | null;
  totalAmount?: number | null;
  includes?: string | null;
  excludes?: string | null;
  noteForCustomer?: string | null;
  status?: AdminBookingStatus;
  statusName?: string | null;
  paymentDeadline?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AdminBookingStatusUpdateRequest {
  status: AdminBookingStatus;
}

export interface AdminReview {
  id: string;
  bookingId: string;
  reviewerUserId: string;
  reviewerName: string | null;
  rating: number;
  comment: string | null;
  isPublic: boolean;
  createdAt: string;
}

export interface AdminIncident {
  id: string;
  bookingId: string;
  reportedByUserId: string;
  reportedByName: string | null;
  type: AdminIncidentType;
  typeName?: string | null;
  description?: string | null;
  status: AdminIncidentStatus;
  statusName?: string | null;
  resolution?: string | null;
  createdAt: string;
  resolvedAt?: string | null;
}

export interface AdminIncidentResolveRequest {
  status?: AdminIncidentStatus;
  resolution?: string | null;
}

export interface AdminServicePackage {
  id: string;
  name: string;
  description: string | null;
  pricePerMonth: number;
  currency: string;
  commissionRate: number;
  hasChatAccess: boolean;
  hasSearchPriority: boolean;
  hasPrioritySupport: boolean;
  hasProductFeedback: boolean;
  maxSlots: number;
  currentSlots: number;
  sortOrder: number;
  isActive: boolean;
  features: string[];
  createdAt: string | null;
  updatedAt: string | null;
}

export interface AdminServicePackageRequest {
  name: string;
  description: string;
  pricePerMonth: number;
  currency: string;
  commissionRate: number;
  hasChatAccess: boolean;
  hasSearchPriority: boolean;
  hasPrioritySupport: boolean;
  hasProductFeedback: boolean;
  maxSlots: number;
  sortOrder: number;
  features: string[];
}

export interface AdminOverviewKpiCards {
  totalUsers: number;
  verifiedUsers: number;
  newUsersThisWindow: number;
  totalBuddies: number;
  activeBuddies: number;
  buddiesWithSubscription: number;
  totalTrips: number;
  openTrips: number;
  totalIncidents: number;
  unresolvedIncidents: number;
}

export interface AdminOverviewTrendWeek {
  weekLabel: string;
  weekStart: string | null;
  weekEnd: string | null;
  totalTrips: number;
  openTrips: number;
}

export interface AdminOverviewTripDemandTrend {
  weeks: AdminOverviewTrendWeek[];
}

export interface AdminOverviewBuddyGrowthWeek {
  weekLabel: string;
  weekStart: string | null;
  weekEnd: string | null;
  newBuddies: number;
  newSubscriptions: number;
  completedBookings: number;
}

export interface AdminOverviewBuddyGrowthTrend {
  weeks: AdminOverviewBuddyGrowthWeek[];
}

export interface AdminOverviewBuddySubscriptionDistributionPackage {
  packageId: string;
  packageName: string;
  pricePerMonth: number;
  currency: string;
  commissionRate: number;
  activeCount: number;
  percentage: number;
}

export interface AdminOverviewBuddySubscriptionDistribution {
  totalSubscribed: number;
  totalFree: number;
  packages: AdminOverviewBuddySubscriptionDistributionPackage[];
}

export interface AdminOverviewTopBuddy {
  buddyId: string;
  fullName: string | null;
  profilePicture: string | null;
  totalEarnings: number;
  completedBookings: number;
  rating: number;
  currentPackage: string | null;
}

export interface AdminOverviewRecentRegistration {
  buddyId: string;
  fullName: string | null;
  email: string | null;
  registeredAt: string | null;
}

export interface AdminOverviewRecentBuddyBooking {
  bookingId: string;
  buddyName: string | null;
  travelerName: string | null;
  statusName: string | null;
  totalAmount: number;
  createdAt: string | null;
}

export interface AdminOverviewRecentSubscription {
  buddyId: string;
  buddyName: string | null;
  packageName: string | null;
  amountPaid: number;
  currency: string | null;
  paidAt: string | null;
}

export interface AdminOverviewBuddyRecentActivity {
  recentRegistrations: AdminOverviewRecentRegistration[];
  recentBookings: AdminOverviewRecentBuddyBooking[];
  recentSubscriptions: AdminOverviewRecentSubscription[];
}

export interface AdminOverviewBookingMixItem {
  statusName: string;
  count: number;
  percentage: number;
}

export interface AdminOverviewBookingMix {
  totalBookings: number;
  statusBreakdown: AdminOverviewBookingMixItem[];
}

export interface AdminOverviewBottomStats {
  totalRevenue: number;
  platformFeeRevenue: number;
  currency: string | null;
  totalActiveBookings: number;
  directBookings: number;
  resolutionRate: number;
  resolvedIncidents: number;
  closedIncidents: number;
}

export interface AdminOverviewRevenueOverview {
  totalBookingRevenue: number;
  totalPlatformFees: number;
  totalSubscriptionRevenue: number;
  totalCombinedRevenue: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  growthPercentage: number;
}

export interface AdminOverviewRecentBooking {
  id: string;
  travelerName: string | null;
  buddyName: string | null;
  statusName: string | null;
  totalAmount: number;
  createdAt: string | null;
}

export interface AdminOverviewRecentIncident {
  id: string;
  typeName: string | null;
  statusName: string | null;
  reporterName: string | null;
  createdAt: string | null;
}

export interface AdminOverviewRecentUser {
  id: string;
  fullName: string | null;
  email: string | null;
  isEmailVerified: boolean;
  createdAt: string | null;
}

export interface AdminOverviewRecentActivity {
  recentBookings: AdminOverviewRecentBooking[];
  recentIncidents: AdminOverviewRecentIncident[];
  recentUsers: AdminOverviewRecentUser[];
}

export interface AdminOverviewSubscriptionByPackage {
  packageName: string;
  count: number;
}

export interface AdminOverviewPlatformHealth {
  userVerificationRate: number;
  inactiveUsers: number;
  averageBuddyRating: number;
  buddiesWithoutBookings: number;
  bookingCompletionRate: number;
  averageBookingValue: number;
  cancelledBookingsThisMonth: number;
  activeSubscriptions: number;
  pendingPaymentSubscriptions: number;
  subscriptionByPackage: AdminOverviewSubscriptionByPackage[];
  averageReviewRating: number;
  totalReviews: number;
}

export interface AdminOverviewSummary {
  kpiCards: AdminOverviewKpiCards;
  tripDemandTrend: AdminOverviewTripDemandTrend;
  bookingMix: AdminOverviewBookingMix;
  bottomStats: AdminOverviewBottomStats;
  revenueOverview: AdminOverviewRevenueOverview;
  recentActivity: AdminOverviewRecentActivity;
  platformHealth: AdminOverviewPlatformHealth;
}

export type AdminUserListResponse = ApiResponse<PaginatedResult<AdminUser>>;
export type AdminUserResponse = ApiResponse<AdminUser>;
export type AdminBuddyListResponse = ApiResponse<PaginatedResult<AdminBuddy>>;
export type AdminBuddyResponse = ApiResponse<AdminBuddy>;
export type AdminBuddiesWithSubscriptionResponse = ApiResponse<AdminBuddy[]>;
export type AdminTripListResponse = ApiResponse<PaginatedResult<AdminTrip>>;
export type AdminTripResponse = ApiResponse<AdminTrip>;
export type AdminBookingListResponse = ApiResponse<PaginatedResult<AdminBooking>>;
export type AdminTripBookingListResponse = ApiResponse<AdminBooking[]>;
export type AdminBookingResponse = ApiResponse<AdminBooking>;
export type AdminReviewResponse = ApiResponse<AdminReview | null>;
export type AdminIncidentListResponse = ApiResponse<PaginatedResult<AdminIncident>>;
export type AdminBookingIncidentListResponse = ApiResponse<AdminIncident[]>;
export type AdminIncidentResponse = ApiResponse<AdminIncident>;
export type AdminServicePackageListResponse = ApiResponse<AdminServicePackage[]>;
export type AdminServicePackageResponse = ApiResponse<AdminServicePackage>;
export type AdminOverviewKpiCardsResponse = ApiResponse<AdminOverviewKpiCards>;
export type AdminOverviewTripDemandTrendResponse = ApiResponse<AdminOverviewTripDemandTrend>;
export type AdminOverviewBookingMixResponse = ApiResponse<AdminOverviewBookingMix>;
export type AdminOverviewBottomStatsResponse = ApiResponse<AdminOverviewBottomStats>;
export type AdminOverviewRevenueOverviewResponse = ApiResponse<AdminOverviewRevenueOverview>;
export type AdminOverviewBuddyGrowthTrendResponse = ApiResponse<AdminOverviewBuddyGrowthTrend>;
export type AdminOverviewBuddySubscriptionDistributionResponse =
  ApiResponse<AdminOverviewBuddySubscriptionDistribution>;
export type AdminOverviewTopBuddiesResponse = ApiResponse<AdminOverviewTopBuddy[]>;
export type AdminOverviewBuddyRecentActivityResponse =
  ApiResponse<AdminOverviewBuddyRecentActivity>;
export type AdminOverviewSummaryResponse = ApiResponse<AdminOverviewSummary>;
