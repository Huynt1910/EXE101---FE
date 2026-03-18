"use client";

import { useQuery } from "@tanstack/react-query";
import { tripQueryKeys } from "@/features/trip/api/trip.query-key";
import { tripApi } from "@/features/trip/api/trip.services";
import { GetTripsQuery } from "@/features/trip/type";

export function useTripDetail(id: string) {
  return useQuery({
    queryKey: tripQueryKeys.detail(id),
    queryFn: () => tripApi.getTripById(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMyTrips(params?: GetTripsQuery) {
  return useQuery({
    queryKey: tripQueryKeys.myTrips(params),
    queryFn: () => tripApi.getMyTrips(params),
  });
}

export function useOpenTrips(params?: GetTripsQuery) {
  return useQuery({
    queryKey: tripQueryKeys.openTrips(params),
    queryFn: () => tripApi.getOpenTrips(params),
  });
}

export function useTripsForAdmin(params?: GetTripsQuery) {
  return useQuery({
    queryKey: tripQueryKeys.adminTrips(params),
    queryFn: () => tripApi.getTripsForAdmin(params),
  });
}
