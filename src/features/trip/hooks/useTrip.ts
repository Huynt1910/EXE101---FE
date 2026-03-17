import { useMutation, useQuery } from "@tanstack/react-query";
import { tripApi } from "../api/trip.services";
import type { CreateTripRequest, GetOpenTripsQuery } from "../type";

export const tripQueryKeys = {
  all: ["trip"] as const,
  open: (params: GetOpenTripsQuery) => ["trip", "open", params] as const,
  detail: (tripId: string) => ["trip", "detail", tripId] as const,
};

export function useTrip(openTripsParams?: GetOpenTripsQuery) {
  const resolvedOpenTripsParams = openTripsParams ?? { page: 1, pageSize: 12 };

  const openTripsQuery = useQuery({
    queryKey: tripQueryKeys.open(resolvedOpenTripsParams),
    queryFn: () => tripApi.getOpenTrips(resolvedOpenTripsParams),
    enabled: Boolean(openTripsParams),
  });

  const createTripMutation = useMutation({
    mutationFn: (payload: CreateTripRequest) => tripApi.createTrip(payload),
  });

  return {
    openTripsQuery,
    createTripMutation,
  };
}

export type UseTripResult = ReturnType<typeof useTrip>;

export function useTripDetailQuery(tripId: string) {
  return useQuery({
    queryKey: tripQueryKeys.detail(tripId),
    queryFn: () => tripApi.getTripById(tripId),
    enabled: Boolean(tripId),
  });
}
