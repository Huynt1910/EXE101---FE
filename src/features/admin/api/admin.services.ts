import type { ApiResponse, PaginatedResult } from "@/features/api-type";
import {
  type AdminBooking,
  type AdminBookingIncidentListResponse,
  type AdminBookingResponse,
  type AdminBookingStatusUpdateRequest,
  type AdminBuddy,
  type AdminBuddiesQuery,
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
  type AdminServicePackage,
  type AdminServicePackageListResponse,
  type AdminServicePackageRequest,
  type AdminServicePackageResponse,
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
const SERVICE_PACKAGES_BASE_PATH = "/api/ServicePackages";

function ensureArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function normalizeText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function normalizeDate(value: unknown) {
  const text = normalizeText(value);
  if (!text || text.startsWith("0001-01-01")) return null;
  return text;
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && item.toLowerCase() !== "string");
}

function normalizeBuddy(item: unknown): AdminBuddy {
  const value = item as Partial<AdminBuddy>;
  return {
    id: normalizeText(value.id) ?? "",
    userId: normalizeText(value.userId),
    fullName: normalizeText(value.fullName),
    name: normalizeText(value.name),
    email: normalizeText(value.email),
    avatar: normalizeText(value.avatar),
    profilePicture: normalizeText(value.profilePicture),
    gender: normalizeText(value.gender),
    phoneNumber: normalizeText(value.phoneNumber),
    address: normalizeText(value.address),
    dateOfBirth: normalizeDate(value.dateOfBirth),
    aboutMe: normalizeText(value.aboutMe),
    activities: normalizeStringArray(value.activities),
    costPerHour:
      typeof value.costPerHour === "number" && Number.isFinite(value.costPerHour)
        ? value.costPerHour
        : null,
    rate:
      typeof value.rate === "number" && Number.isFinite(value.rate)
        ? value.rate
        : null,
    languages: normalizeStringArray(value.languages),
    bio: normalizeText(value.bio),
    isActive: value.isActive !== false,
    createdAt: normalizeDate(value.createdAt),
    updatedAt: normalizeDate(value.updatedAt),
  };
}

function normalizeBuddyListPayload(payload: unknown): AdminBuddy[] {
  return ensureArray<unknown>(payload).map(normalizeBuddy);
}

function normalizeBuddyPagePayload(payload: unknown): PaginatedResult<AdminBuddy> {
  const value = payload as Partial<PaginatedResult<AdminBuddy>>;
  return {
    items: normalizeBuddyListPayload(value.items),
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

function normalizeServicePackage(item: unknown): AdminServicePackage {
  const value = item as Partial<AdminServicePackage>;

  return {
    id: normalizeText(value.id) ?? "",
    name: normalizeText(value.name) ?? "Unnamed package",
    description: normalizeText(value.description),
    pricePerMonth:
      typeof value.pricePerMonth === "number" && Number.isFinite(value.pricePerMonth)
        ? value.pricePerMonth
        : 0,
    currency: normalizeText(value.currency) ?? "VND",
    commissionRate:
      typeof value.commissionRate === "number" &&
      Number.isFinite(value.commissionRate)
        ? value.commissionRate
        : 0,
    hasChatAccess: value.hasChatAccess === true,
    hasSearchPriority: value.hasSearchPriority === true,
    hasPrioritySupport: value.hasPrioritySupport === true,
    hasProductFeedback: value.hasProductFeedback === true,
    maxSlots:
      typeof value.maxSlots === "number" && Number.isFinite(value.maxSlots)
        ? value.maxSlots
        : 0,
    currentSlots:
      typeof value.currentSlots === "number" &&
      Number.isFinite(value.currentSlots)
        ? value.currentSlots
        : 0,
    sortOrder:
      typeof value.sortOrder === "number" && Number.isFinite(value.sortOrder)
        ? value.sortOrder
        : 0,
    isActive: value.isActive !== false,
    features: normalizeStringArray(value.features),
    createdAt: normalizeDate(value.createdAt),
    updatedAt: normalizeDate(value.updatedAt),
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

  async getBuddies(params?: AdminBuddiesQuery) {
    const res = await httpClient.get<AdminBuddyListResponse>(
      `${ADMIN_BASE_PATH}/buddies`,
      params,
    );
    return {
      ...res.data,
      data: normalizeBuddyPagePayload(res.data.data),
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

  async getServicePackages() {
    const res = await httpClient.get<AdminServicePackageListResponse>(
      `${SERVICE_PACKAGES_BASE_PATH}/all`,
    );

    return {
      ...res.data,
      data: ensureArray<unknown>(res.data.data).map(normalizeServicePackage),
    };
  },

  async getServicePackageById(id: string) {
    const res = await httpClient.get<AdminServicePackageResponse>(
      `${SERVICE_PACKAGES_BASE_PATH}/${id}`,
    );

    return {
      ...res.data,
      data: normalizeServicePackage(res.data.data),
    };
  },

  async createServicePackage(payload: AdminServicePackageRequest) {
    const res = await httpClient.post<
      AdminServicePackageResponse,
      AdminServicePackageRequest
    >(SERVICE_PACKAGES_BASE_PATH, payload);

    return {
      ...res.data,
      data: normalizeServicePackage(res.data.data),
    };
  },

  async updateServicePackage(id: string, payload: AdminServicePackageRequest) {
    const res = await httpClient.put<
      AdminServicePackageResponse,
      AdminServicePackageRequest
    >(`${SERVICE_PACKAGES_BASE_PATH}/${id}`, payload);

    return {
      ...res.data,
      data: normalizeServicePackage(res.data.data),
    };
  },

  async deleteServicePackage(id: string) {
    const res = await httpClient.delete<ApiResponse<null>>(
      `${SERVICE_PACKAGES_BASE_PATH}/${id}`,
    );
    return res.data;
  },
};
