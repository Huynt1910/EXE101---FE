import { GetTripsQuery } from "@/features/trip/type";

export const tripQueryKeys = {
  all: ["trips"] as const,

  lists: () => [...tripQueryKeys.all, "list"] as const,
  list: (params?: GetTripsQuery) => [...tripQueryKeys.lists(), params] as const,

  details: () => [...tripQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...tripQueryKeys.details(), id] as const,

  myTrips: (params?: GetTripsQuery) =>
    [...tripQueryKeys.all, "my", params] as const,

  openTrips: (params?: GetTripsQuery) =>
    [...tripQueryKeys.all, "open", params] as const,

  adminTrips: (params?: GetTripsQuery) =>
    [...tripQueryKeys.all, "admin", params] as const,
};
