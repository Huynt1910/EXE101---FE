"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminQueryKeys } from "@/features/admin/api/admin.query-key";
import { adminApi } from "@/features/admin/api/admin.services";
import type {
  AdminBookingStatusUpdateRequest,
  AdminBuddiesQuery,
  AdminBuddyRegisterRequest,
  AdminBuddyUpdateRequest,
  AdminIncidentsQuery,
  AdminIncidentResolveRequest,
  AdminServicePackageRequest,
  AdminTripsQuery,
  AdminUsersQuery,
  AdminUserUpdateRequest,
} from "@/features/admin/type";

export function useAdminUsers(params?: AdminUsersQuery) {
  return useQuery({
    queryKey: adminQueryKeys.users(params),
    queryFn: () => adminApi.getUsers(params),
    placeholderData: (previous) => previous,
  });
}

export function useAdminUserDetail(id?: string | null) {
  return useQuery({
    queryKey: adminQueryKeys.userDetail(id ?? ""),
    queryFn: () => adminApi.getUserById(id ?? ""),
    enabled: Boolean(id),
  });
}

export function useAdminBuddies(params?: AdminBuddiesQuery) {
  return useQuery({
    queryKey: adminQueryKeys.buddies(params),
    queryFn: () => adminApi.getBuddies(params),
    placeholderData: (previous) => previous,
  });
}

export function useAdminBuddyDetail(id?: string | null) {
  return useQuery({
    queryKey: adminQueryKeys.buddyDetail(id ?? ""),
    queryFn: () => adminApi.getBuddyById(id ?? ""),
    enabled: Boolean(id),
  });
}

export function useAdminTrips(params?: AdminTripsQuery) {
  return useQuery({
    queryKey: adminQueryKeys.trips(params),
    queryFn: () => adminApi.getTrips(params),
    placeholderData: (previous) => previous,
  });
}

export function useAdminTripDetail(id?: string | null) {
  return useQuery({
    queryKey: adminQueryKeys.tripDetail(id ?? ""),
    queryFn: () => adminApi.getTripById(id ?? ""),
    enabled: Boolean(id),
  });
}

export function useAdminTripBookings(tripId?: string | null) {
  return useQuery({
    queryKey: adminQueryKeys.tripBookings(tripId ?? ""),
    queryFn: () => adminApi.getTripBookings(tripId ?? ""),
    enabled: Boolean(tripId),
  });
}

export function useAdminBookingDetail(id?: string | null) {
  return useQuery({
    queryKey: adminQueryKeys.bookingDetail(id ?? ""),
    queryFn: () => adminApi.getBookingById(id ?? ""),
    enabled: Boolean(id),
  });
}

export function useAdminBookingReview(bookingId?: string | null) {
  return useQuery({
    queryKey: adminQueryKeys.bookingReview(bookingId ?? ""),
    queryFn: () => adminApi.getBookingReview(bookingId ?? ""),
    enabled: Boolean(bookingId),
  });
}

export function useAdminBookingIncidents(bookingId?: string | null) {
  return useQuery({
    queryKey: adminQueryKeys.bookingIncidents(bookingId ?? ""),
    queryFn: () => adminApi.getBookingIncidents(bookingId ?? ""),
    enabled: Boolean(bookingId),
  });
}

export function useAdminIncidents(params?: AdminIncidentsQuery) {
  return useQuery({
    queryKey: adminQueryKeys.incidents(params),
    queryFn: () => adminApi.getIncidents(params),
    placeholderData: (previous) => previous,
  });
}

export function useAdminServicePackages() {
  return useQuery({
    queryKey: adminQueryKeys.servicePackages(),
    queryFn: () => adminApi.getServicePackages(),
  });
}

export function useAdminServicePackageDetail(id?: string | null) {
  return useQuery({
    queryKey: adminQueryKeys.servicePackageDetail(id ?? ""),
    queryFn: () => adminApi.getServicePackageById(id ?? ""),
    enabled: Boolean(id),
  });
}

export function useAdminMutations() {
  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AdminUserUpdateRequest }) =>
      adminApi.updateUser(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...adminQueryKeys.all, "users"] });
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.userDetail(variables.id),
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...adminQueryKeys.all, "users"] });
    },
  });

  const registerBuddyMutation = useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: AdminBuddyRegisterRequest;
    }) => adminApi.registerBuddy(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...adminQueryKeys.all, "buddies"] });
      queryClient.invalidateQueries({ queryKey: [...adminQueryKeys.all, "users"] });
    },
  });

  const updateBuddyMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AdminBuddyUpdateRequest }) =>
      adminApi.updateBuddy(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...adminQueryKeys.all, "buddies"] });
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.buddyDetail(variables.id),
      });
    },
  });

  const deleteBuddyMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteBuddy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...adminQueryKeys.all, "buddies"] });
    },
  });

  const updateBookingStatusMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: AdminBookingStatusUpdateRequest;
    }) => adminApi.updateBookingStatus(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...adminQueryKeys.all, "trips"] });
      queryClient.invalidateQueries({ queryKey: [...adminQueryKeys.all, "trip-bookings"] });
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.bookingDetail(variables.id),
      });
    },
  });

  const resolveIncidentMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: AdminIncidentResolveRequest;
    }) => adminApi.resolveIncident(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...adminQueryKeys.all, "incidents"] });
      queryClient.invalidateQueries({ queryKey: [...adminQueryKeys.all, "booking-incidents"] });
    },
  });

  const createServicePackageMutation = useMutation({
    mutationFn: (payload: AdminServicePackageRequest) =>
      adminApi.createServicePackage(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.servicePackages(),
      });
    },
  });

  const updateServicePackageMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: AdminServicePackageRequest;
    }) => adminApi.updateServicePackage(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.servicePackages(),
      });
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.servicePackageDetail(variables.id),
      });
    },
  });

  const deleteServicePackageMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteServicePackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.servicePackages(),
      });
    },
  });

  return {
    updateUserMutation,
    deleteUserMutation,
    registerBuddyMutation,
    updateBuddyMutation,
    deleteBuddyMutation,
    updateBookingStatusMutation,
    resolveIncidentMutation,
    createServicePackageMutation,
    updateServicePackageMutation,
    deleteServicePackageMutation,
  };
}
