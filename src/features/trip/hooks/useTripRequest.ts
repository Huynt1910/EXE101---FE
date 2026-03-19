"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tripQueryKeys } from "@/features/trip/api/trip.query-key";
import { tripApi } from "@/features/trip/api/trip.services";
import { tripRequestApi } from "@/features/trip/api/trip-request.services";
import type {
  GetTripsQuery,
  SubmitTripRequestOfferPayload,
  TripRequest,
} from "@/features/trip/type";

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

  const detailId = options.detailId ?? "";
  const tripDetailQuery = useQuery({
    queryKey: tripQueryKeys.detail(detailId),
    queryFn: () => tripApi.getTripById(detailId),
    enabled: options.enableDetail ?? Boolean(detailId),
    staleTime: 5 * 60 * 1000,
  });

  const myTripsQuery = useQuery({
    queryKey: tripQueryKeys.myTrips(options.myTripsParams),
    queryFn: () => tripApi.getMyTrips(options.myTripsParams),
    enabled: options.enableMyTrips ?? false,
  });

  const openTripsQuery = useQuery({
    queryKey: tripQueryKeys.openTrips(options.openTripsParams),
    queryFn: () => tripApi.getOpenTrips(options.openTripsParams),
    enabled: options.enableOpenTrips ?? false,
  });

  const tripsForAdminQuery = useQuery({
    queryKey: tripQueryKeys.adminTrips(options.adminTripsParams),
    queryFn: () => tripApi.getTripsForAdmin(options.adminTripsParams),
    enabled: options.enableAdminTrips ?? false,
  });

  const createTripMutation = useMutation({
    mutationFn: (payload: TripRequest) => tripApi.createTrip(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.all });
    },
  });

  const updateTripMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TripRequest }) =>
      tripApi.updateTrip(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: tripQueryKeys.detail(variables.id),
      });
    },
  });

  const patchTripMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TripRequest }) =>
      tripApi.patchTrip(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: tripQueryKeys.detail(variables.id),
      });
    },
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
