import type { ApiResponse, PaginatedResult } from "@/features/api-type";
import {
  type AdminBooking,
  type AdminBookingIncidentListResponse,
  type AdminBookingResponse,
  type AdminBookingStatusUpdateRequest,
  type AdminBuddy,
  type AdminBuddyListResponse,
  type AdminBuddyRegisterRequest,
  type AdminBuddyResponse,
  type AdminBuddyUpdateRequest,
  type AdminIncidentsQuery,
  type AdminIncident,
  type AdminIncidentListResponse,
  type AdminIncidentResolveRequest,
  type AdminIncidentResponse,
  type AdminReview,
  type AdminReviewResponse,
  type AdminTrip,
  type AdminTripBookingListResponse,
  type AdminTripListResponse,
  type AdminTripResponse,
  type AdminTripsQuery,
  type AdminUser,
  type AdminUserListResponse,
  type AdminUserResponse,
  type AdminUsersQuery,
  type AdminUserUpdateRequest,
} from "@/features/admin/type";
import { httpClient } from "@/lib/http/client";

const ADMIN_BASE_PATH = "/api/admin";
const INCIDENTS_BASE_PATH = "/api/Incidents";

function ensureArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function normalizeBuddy(item: unknown): AdminBuddy {
  const value = item as Partial<AdminBuddy>;
  return {
    id: typeof value.id === "string" ? value.id : "",
    userId: typeof value.userId === "string" ? value.userId : null,
    fullName: typeof value.fullName === "string" ? value.fullName : null,
    name: typeof value.name === "string" ? value.name : null,
    email: typeof value.email === "string" ? value.email : null,
    avatar: typeof value.avatar === "string" ? value.avatar : null,
    profilePicture:
      typeof value.profilePicture === "string" ? value.profilePicture : null,
    activities: Array.isArray(value.activities) ? value.activities : [],
    costPerHour:
      typeof value.costPerHour === "number" ? value.costPerHour : null,
    languages: Array.isArray(value.languages) ? value.languages : [],
    bio: typeof value.bio === "string" ? value.bio : null,
    isActive: typeof value.isActive === "boolean" ? value.isActive : null,
    createdAt: typeof value.createdAt === "string" ? value.createdAt : null,
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : null,
  };
}

function normalizeBuddyListPayload(payload: unknown): AdminBuddy[] {
  return ensureArray<unknown>(payload).map(normalizeBuddy);
}

function normalizeBooking(item: unknown): AdminBooking {
  const value = item as Partial<AdminBooking>;
  return {
    id: typeof value.id === "string" ? value.id : "",
    tripId: typeof value.tripId === "string" ? value.tripId : null,
    tripRequestId:
      typeof value.tripRequestId === "string" ? value.tripRequestId : null,
    buddyId: typeof value.buddyId === "string" ? value.buddyId : null,
    buddyName: typeof value.buddyName === "string" ? value.buddyName : null,
    buddyAvatar:
      typeof value.buddyAvatar === "string" ? value.buddyAvatar : null,
    travelerUserId:
      typeof value.travelerUserId === "string" ? value.travelerUserId : null,
    travelerName:
      typeof value.travelerName === "string" ? value.travelerName : null,
    chatRoomId: typeof value.chatRoomId === "string" ? value.chatRoomId : null,
    bookedDate: typeof value.bookedDate === "string" ? value.bookedDate : null,
    bookedStartTime:
      typeof value.bookedStartTime === "string" ? value.bookedStartTime : null,
    bookedDurationHours:
      typeof value.bookedDurationHours === "number"
        ? value.bookedDurationHours
        : null,
    bookedAdults:
      typeof value.bookedAdults === "number" ? value.bookedAdults : null,
    bookedChildren:
      typeof value.bookedChildren === "number" ? value.bookedChildren : null,
    price: typeof value.price === "number" ? value.price : null,
    currency: typeof value.currency === "string" ? value.currency : null,
    platformFeeAmount:
      typeof value.platformFeeAmount === "number" ? value.platformFeeAmount : null,
    totalAmount:
      typeof value.totalAmount === "number" ? value.totalAmount : null,
    includes: typeof value.includes === "string" ? value.includes : null,
    excludes: typeof value.excludes === "string" ? value.excludes : null,
    noteForCustomer:
      typeof value.noteForCustomer === "string" ? value.noteForCustomer : null,
    status: typeof value.status === "string" ? value.status : undefined,
    statusName:
      typeof value.statusName === "string" ? value.statusName : null,
    paymentDeadline:
      typeof value.paymentDeadline === "string" ? value.paymentDeadline : null,
    createdAt: typeof value.createdAt === "string" ? value.createdAt : null,
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : null,
  };
}

function normalizeIncident(item: unknown): AdminIncident {
  const value = item as Partial<AdminIncident>;
  return {
    id: typeof value.id === "string" ? value.id : "",
    bookingId: typeof value.bookingId === "string" ? value.bookingId : "",
    reportedByUserId:
      typeof value.reportedByUserId === "string" ? value.reportedByUserId : "",
    reportedByName:
      typeof value.reportedByName === "string" ? value.reportedByName : null,
    type: typeof value.type === "string" ? value.type : "Other",
    typeName: typeof value.typeName === "string" ? value.typeName : null,
    description:
      typeof value.description === "string" ? value.description : null,
    status: typeof value.status === "string" ? value.status : "Open",
    statusName: typeof value.statusName === "string" ? value.statusName : null,
    resolution:
      typeof value.resolution === "string" ? value.resolution : null,
    createdAt: typeof value.createdAt === "string" ? value.createdAt : "",
    resolvedAt: typeof value.resolvedAt === "string" ? value.resolvedAt : null,
  };
}

function normalizeIncidentListPayload(payload: unknown): PaginatedResult<AdminIncident> {
  const value = payload as Partial<PaginatedResult<AdminIncident>>;
  return {
    items: ensureArray<unknown>(value.items).map(normalizeIncident),
    totalCount: typeof value.totalCount === "number" ? value.totalCount : 0,
    page: typeof value.page === "number" ? value.page : 1,
    pageSize: typeof value.pageSize === "number" ? value.pageSize : 10,
    totalPages: typeof value.totalPages === "number" ? value.totalPages : 0,
    hasPreviousPage:
      typeof value.hasPreviousPage === "boolean" ? value.hasPreviousPage : false,
    hasNextPage:
      typeof value.hasNextPage === "boolean" ? value.hasNextPage : false,
  };
}

export const adminApi = {
  async getUsers(params?: AdminUsersQuery) {
    const res = await httpClient.get<AdminUserListResponse>(
      `${ADMIN_BASE_PATH}/users`,
      params,
    );
    return res.data;
  },

  async getUserById(id: string) {
    const res = await httpClient.get<AdminUserResponse>(
      `${ADMIN_BASE_PATH}/users/${id}`,
    );
    return res.data;
  },

  async updateUser(id: string, payload: AdminUserUpdateRequest) {
    const res = await httpClient.put<AdminUserResponse, AdminUserUpdateRequest>(
      `${ADMIN_BASE_PATH}/users/${id}`,
      payload,
    );
    return res.data;
  },

  async deleteUser(id: string) {
    const res = await httpClient.delete<ApiResponse<null>>(
      `${ADMIN_BASE_PATH}/users/${id}`,
    );
    return res.data;
  },

  async getBuddies() {
    const res = await httpClient.get<AdminBuddyListResponse>(
      `${ADMIN_BASE_PATH}/buddies`,
    );
    return {
      ...res.data,
      data: normalizeBuddyListPayload(res.data.data),
    };
  },

  async getBuddyById(id: string) {
    const res = await httpClient.get<AdminBuddyResponse>(
      `${ADMIN_BASE_PATH}/buddies/${id}`,
    );
    return {
      ...res.data,
      data: normalizeBuddy(res.data.data),
    };
  },

  async registerBuddy(userId: string, payload: AdminBuddyRegisterRequest) {
    const res = await httpClient.post<AdminBuddyResponse, AdminBuddyRegisterRequest>(
      `${ADMIN_BASE_PATH}/buddies/${userId}`,
      payload,
    );
    return {
      ...res.data,
      data: normalizeBuddy(res.data.data),
    };
  },

  async updateBuddy(id: string, payload: AdminBuddyUpdateRequest) {
    const res = await httpClient.put<AdminBuddyResponse, AdminBuddyUpdateRequest>(
      `${ADMIN_BASE_PATH}/buddies/${id}`,
      payload,
    );
    return {
      ...res.data,
      data: normalizeBuddy(res.data.data),
    };
  },

  async deleteBuddy(id: string) {
    const res = await httpClient.delete<ApiResponse<null>>(
      `${ADMIN_BASE_PATH}/buddies/${id}`,
    );
    return res.data;
  },

  async getTrips(params?: AdminTripsQuery) {
    const res = await httpClient.get<AdminTripListResponse>(
      `${ADMIN_BASE_PATH}/trips`,
      params,
    );
    return res.data;
  },

  async getTripById(id: string) {
    const res = await httpClient.get<AdminTripResponse>(
      `${ADMIN_BASE_PATH}/trips/${id}`,
    );
    return res.data;
  },

  async getTripBookings(tripId: string) {
    const res = await httpClient.get<AdminTripBookingListResponse>(
      `${ADMIN_BASE_PATH}/trips/${tripId}/bookings`,
    );
    return {
      ...res.data,
      data: ensureArray<unknown>(res.data.data).map(normalizeBooking),
    };
  },

  async getBookingById(id: string) {
    const res = await httpClient.get<AdminBookingResponse>(
      `${ADMIN_BASE_PATH}/bookings/${id}`,
    );
    return {
      ...res.data,
      data: normalizeBooking(res.data.data),
    };
  },

  async updateBookingStatus(id: string, payload: AdminBookingStatusUpdateRequest) {
    const res = await httpClient.patch<AdminBookingResponse, AdminBookingStatusUpdateRequest>(
      `${ADMIN_BASE_PATH}/bookings/${id}/status`,
      payload,
    );
    return {
      ...res.data,
      data: normalizeBooking(res.data.data),
    };
  },

  async getBookingReview(bookingId: string) {
    const res = await httpClient.get<AdminReviewResponse>(
      `${ADMIN_BASE_PATH}/bookings/${bookingId}/review`,
    );
    return res.data;
  },

  async getBookingIncidents(bookingId: string) {
    const res = await httpClient.get<AdminBookingIncidentListResponse>(
      `${ADMIN_BASE_PATH}/bookings/${bookingId}/incidents`,
    );
    return {
      ...res.data,
      data: ensureArray<unknown>(res.data.data).map(normalizeIncident),
    };
  },

  async getIncidents(params?: AdminIncidentsQuery) {
    const res = await httpClient.get<AdminIncidentListResponse>(
      INCIDENTS_BASE_PATH,
      params,
    );
    return {
      ...res.data,
      data: normalizeIncidentListPayload(res.data.data),
    };
  },

  async resolveIncident(id: string, payload: AdminIncidentResolveRequest) {
    const res = await httpClient.patch<AdminIncidentResponse, AdminIncidentResolveRequest>(
      `${ADMIN_BASE_PATH}/incidents/${id}/resolve`,
      payload,
    );
    return {
      ...res.data,
      data: normalizeIncident(res.data.data),
    };
  },
};
