"use client";

import { tripQueryKeys } from "@/features/trip/api/trip.query-key";
import { tripApi } from "@/features/trip/api/trip.services";
import { TripRequest } from "@/features/trip/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useTripMutations() {
  const queryClient = useQueryClient();

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

  return {
    createTripMutation,
    updateTripMutation,
    patchTripMutation,
  };
}
