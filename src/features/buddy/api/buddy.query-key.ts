export const buddyQueryKeys = {
  all: ["buddy"] as const,
  list: () => [...buddyQueryKeys.all, "list"] as const,
  pendingApplicants: () => [...buddyQueryKeys.all, "pending-applicants"] as const,
  detail: (id: string) => [...buddyQueryKeys.all, "detail", id] as const,
  reviews: (buddyId: string, page = 1, pageSize = 6) =>
    [...buddyQueryKeys.all, "reviews", buddyId, page, pageSize] as const,
  me: () => [...buddyQueryKeys.all, "me"] as const,
  myBookings: () => [...buddyQueryKeys.all, "my-bookings"] as const,
  myTripRequests: () => [...buddyQueryKeys.all, "my-trip-requests"] as const,
};
