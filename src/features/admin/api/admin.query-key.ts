import type { AdminIncidentsQuery, AdminTripsQuery, AdminUsersQuery } from "@/features/admin/type";

export const adminQueryKeys = {
  all: ["admin"] as const,
  users: (params?: AdminUsersQuery) => [...adminQueryKeys.all, "users", params ?? {}] as const,
  userDetail: (id: string) => [...adminQueryKeys.all, "users", id] as const,
  buddies: () => [...adminQueryKeys.all, "buddies"] as const,
  buddyDetail: (id: string) => [...adminQueryKeys.all, "buddies", id] as const,
  trips: (params?: AdminTripsQuery) => [...adminQueryKeys.all, "trips", params ?? {}] as const,
  tripDetail: (id: string) => [...adminQueryKeys.all, "trips", id] as const,
  tripBookings: (tripId: string) => [...adminQueryKeys.all, "trip-bookings", tripId] as const,
  bookingDetail: (id: string) => [...adminQueryKeys.all, "bookings", id] as const,
  bookingReview: (bookingId: string) => [...adminQueryKeys.all, "booking-review", bookingId] as const,
  bookingIncidents: (bookingId: string) => [...adminQueryKeys.all, "booking-incidents", bookingId] as const,
  incidents: (params?: AdminIncidentsQuery) => [...adminQueryKeys.all, "incidents", params ?? {}] as const,
};
