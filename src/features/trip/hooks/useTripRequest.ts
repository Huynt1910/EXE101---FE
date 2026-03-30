"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tripQueryKeys } from "@/features/trip/api/trip.query-key";
import { tripApi } from "@/features/trip/api/trip.services";
import { tripRequestApi } from "@/features/trip/api/trip-request.services";
import type {
  GetTripsQuery,
  SubmitTripRequestOfferPayload,
} from "@/features/trip/type";
import { useTripMutations } from "@/features/trip/hooks/useTripMutation";

type DetailQueryOptions = {
  enabled?: boolean;
  staleTime?: number;
};

type ListQueryOptions = {
  enabled?: boolean;
};

export function useTripDetail(id: string, options?: DetailQueryOptions) {
  return useQuery({
    queryKey: tripQueryKeys.detail(id),
    queryFn: () => tripApi.getTripById(id),
    enabled: options?.enabled ?? Boolean(id),
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
  });
}

export function useMyTrips(params?: GetTripsQuery, options?: ListQueryOptions) {
  return useQuery({
    queryKey: tripQueryKeys.myTrips(params),
    queryFn: () => tripApi.getMyTrips(params),
    enabled: options?.enabled ?? true,
    placeholderData: (previousData) => previousData,
  });
}

export function useOpenTrips(
  params?: GetTripsQuery,
  options?: ListQueryOptions,
) {
  return useQuery({
    queryKey: tripQueryKeys.openTrips(params),
    queryFn: () => tripApi.getOpenTrips(params),
    enabled: options?.enabled ?? true,
  });
}

export function useTripsForAdmin(
  params?: GetTripsQuery,
  options?: ListQueryOptions,
) {
  return useQuery({
    queryKey: tripQueryKeys.adminTrips(params),
    queryFn: () => tripApi.getTripsForAdmin(params),
    enabled: options?.enabled ?? true,
  });
}

type UseTripRequestOptions = {
  detailId?: string;
  myTripsParams?: GetTripsQuery;
  openTripsParams?: GetTripsQuery;
  adminTripsParams?: GetTripsQuery;
  enableDetail?: boolean;
  enableMyTrips?: boolean;
  enableOpenTrips?: boolean;
  enableAdminTrips?: boolean;
};

type SubmitTripRequestOfferVariables = {
  payload: SubmitTripRequestOfferPayload;
};

export function useTripRequest(options: UseTripRequestOptions = {}) {
  const queryClient = useQueryClient();
  const { createTripMutation, updateTripMutation, patchTripMutation } =
    useTripMutations();

  const detailId = options.detailId ?? "";
  const tripDetailQuery = useTripDetail(detailId, {
    enabled: options.enableDetail ?? Boolean(detailId),
    staleTime: 5 * 60 * 1000,
  });

  const myTripsQuery = useMyTrips(options.myTripsParams, {
    enabled: options.enableMyTrips ?? false,
  });

  const openTripsQuery = useOpenTrips(options.openTripsParams, {
    enabled: options.enableOpenTrips ?? false,
  });

  const tripsForAdminQuery = useTripsForAdmin(options.adminTripsParams, {
    enabled: options.enableAdminTrips ?? false,
  });

  const submitOfferMutation = useMutation({
    mutationFn: ({ payload }: SubmitTripRequestOfferVariables) =>
      tripRequestApi.submitOffer(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...tripQueryKeys.all, "open"] });
      queryClient.invalidateQueries({
        queryKey: tripQueryKeys.detail(variables.payload.tripId),
      });
    },
  });

  return {
    tripDetailQuery,
    myTripsQuery,
    openTripsQuery,
    tripsForAdminQuery,
    createTripMutation,
    updateTripMutation,
    patchTripMutation,
    submitOfferMutation,
  };
}
