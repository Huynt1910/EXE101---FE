import type {
  AdminBookingsQuery,
  AdminBuddiesQuery,
  AdminBuddiesWithSubscriptionQuery,
  AdminIncidentsQuery,
  AdminOverviewQuery,
  AdminOverviewSummaryQuery,
  AdminOverviewTopBuddiesQuery,
  AdminTripsQuery,
  AdminUsersQuery,
} from "@/features/admin/type";

export const adminQueryKeys = {
  all: ["admin"] as const,
  users: (params?: AdminUsersQuery) => [...adminQueryKeys.all, "users", params ?? {}] as const,
  userDetail: (id: string) => [...adminQueryKeys.all, "users", id] as const,
  buddies: (params?: AdminBuddiesQuery) =>
    [...adminQueryKeys.all, "buddies", params ?? {}] as const,
  buddyDetail: (id: string) => [...adminQueryKeys.all, "buddies", id] as const,
  buddiesWithSubscription: (params?: AdminBuddiesWithSubscriptionQuery) =>
    [...adminQueryKeys.all, "buddies-with-subscription", params ?? {}] as const,
  trips: (params?: AdminTripsQuery) => [...adminQueryKeys.all, "trips", params ?? {}] as const,
  tripDetail: (id: string) => [...adminQueryKeys.all, "trips", id] as const,
  tripBookings: (tripId: string) => [...adminQueryKeys.all, "trip-bookings", tripId] as const,
  bookings: (params?: AdminBookingsQuery) =>
    [...adminQueryKeys.all, "bookings", params ?? {}] as const,
  bookingDetail: (id: string) => [...adminQueryKeys.all, "bookings", id] as const,
  bookingReview: (bookingId: string) => [...adminQueryKeys.all, "booking-review", bookingId] as const,
  bookingIncidents: (bookingId: string) => [...adminQueryKeys.all, "booking-incidents", bookingId] as const,
  incidents: (params?: AdminIncidentsQuery) => [...adminQueryKeys.all, "incidents", params ?? {}] as const,
  overviewKpiCards: (params?: AdminOverviewQuery) =>
    [...adminQueryKeys.all, "overview-kpi-cards", params ?? {}] as const,
  overviewTripDemandTrend: (params?: AdminOverviewQuery) =>
    [...adminQueryKeys.all, "overview-trip-demand-trend", params ?? {}] as const,
  overviewBookingMix: (params?: AdminOverviewQuery) =>
    [...adminQueryKeys.all, "overview-booking-mix", params ?? {}] as const,
  overviewBottomStats: (params?: AdminOverviewQuery) =>
    [...adminQueryKeys.all, "overview-bottom-stats", params ?? {}] as const,
  overviewRevenue: (params?: AdminOverviewQuery) =>
    [...adminQueryKeys.all, "overview-revenue", params ?? {}] as const,
  overviewBuddyGrowthTrend: (params?: AdminOverviewQuery) =>
    [...adminQueryKeys.all, "overview-buddy-growth-trend", params ?? {}] as const,
  overviewBuddySubscriptionDistribution: (params?: AdminOverviewQuery) =>
    [...adminQueryKeys.all, "overview-buddy-subscription-distribution", params ?? {}] as const,
  overviewBuddyTopEarners: (params?: AdminOverviewTopBuddiesQuery) =>
    [...adminQueryKeys.all, "overview-buddy-top-earners", params ?? {}] as const,
  overviewBuddyTopRated: (params?: AdminOverviewTopBuddiesQuery) =>
    [...adminQueryKeys.all, "overview-buddy-top-rated", params ?? {}] as const,
  overviewBuddyRecentActivity: (params?: AdminOverviewQuery) =>
    [...adminQueryKeys.all, "overview-buddy-recent-activity", params ?? {}] as const,
  overviewSummary: (params?: AdminOverviewSummaryQuery) =>
    [...adminQueryKeys.all, "overview-summary", params ?? {}] as const,
  servicePackages: () => [...adminQueryKeys.all, "service-packages"] as const,
  servicePackageDetail: (id: string) =>
    [...adminQueryKeys.all, "service-packages", id] as const,
};
