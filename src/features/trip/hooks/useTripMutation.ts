"use client";

import { tripQueryKeys } from "@/features/trip/api/trip.query-key";
import { tripApi } from "@/features/trip/api/trip.services";
import {
  CreateTripRequest,
  TripUpdateRequest,
} from "@/features/trip/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useTripMutations() {
  const queryClient = useQueryClient();

  const createTripMutation = useMutation({
    mutationFn: (payload: CreateTripRequest) => tripApi.createTrip(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.all });
    },
  });

  const updateTripMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TripUpdateRequest }) =>
      tripApi.updateTrip(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: tripQueryKeys.detail(variables.id),
      });
    },
  });

  const patchTripMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TripUpdateRequest }) =>
      tripApi.patchTrip(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: tripQueryKeys.detail(variables.id),
      });
    },
  });

  const deleteTripMutation = useMutation({
    mutationFn: (id: string) => tripApi.deleteTrip(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.all });
    },
  });

  return {
    createTripMutation,
    updateTripMutation,
    patchTripMutation,
    deleteTripMutation,
  };
}
