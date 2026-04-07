import type { ApiResponse, PaginatedResult } from "@/features/api-type";
import {
  type AdminBooking,
  type AdminBookingListResponse,
  type AdminBookingIncidentListResponse,
  type AdminBookingResponse,
  type AdminBookingsQuery,
  type AdminBookingStatusUpdateRequest,
  type AdminBuddy,
  type AdminBuddySubscription,
  type AdminBuddiesQuery,
  type AdminBuddiesWithSubscriptionQuery,
  type AdminBuddiesWithSubscriptionResponse,
  type AdminBuddyListResponse,
  type AdminBuddyRegisterRequest,
  type AdminBuddyResponse,
  type AdminBuddyUpdateRequest,
  type AdminIncidentsQuery,
  type AdminIncident,
  type AdminIncidentListResponse,
  type AdminIncidentResolveRequest,
  type AdminIncidentResponse,
  type AdminOverviewBookingMix,
  type AdminOverviewBookingMixResponse,
  type AdminOverviewBottomStats,
  type AdminOverviewBottomStatsResponse,
  type AdminOverviewBuddyGrowthTrend,
  type AdminOverviewBuddyGrowthTrendResponse,
  type AdminOverviewBuddyRecentActivity,
  type AdminOverviewBuddyRecentActivityResponse,
  type AdminOverviewBuddySubscriptionDistribution,
  type AdminOverviewBuddySubscriptionDistributionResponse,
  type AdminOverviewKpiCards,
  type AdminOverviewKpiCardsResponse,
  type AdminOverviewQuery,
  type AdminOverviewRevenueOverview,
  type AdminOverviewRevenueOverviewResponse,
  type AdminOverviewSummary,
  type AdminOverviewSummaryQuery,
  type AdminOverviewSummaryResponse,
  type AdminOverviewTopBuddiesQuery,
  type AdminOverviewTopBuddy,
  type AdminOverviewTopBuddiesResponse,
  type AdminOverviewTripDemandTrend,
  type AdminOverviewTripDemandTrendResponse,
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

function normalizeNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function normalizeBoolean(value: unknown) {
  return value === true;
}

function normalizeBuddySubscription(item: unknown): AdminBuddySubscription | null {
  if (!item || typeof item !== "object") return null;

  const value = item as Partial<AdminBuddySubscription>;

  return {
    subscriptionId: normalizeText(value.subscriptionId),
    servicePackageId: normalizeText(value.servicePackageId),
    packageName: normalizeText(value.packageName),
    commissionRate:
      typeof value.commissionRate === "number" &&
      Number.isFinite(value.commissionRate)
        ? value.commissionRate
        : null,
    status: normalizeText(value.status),
    startDate: normalizeDate(value.startDate),
    endDate: normalizeDate(value.endDate),
    amountPaid:
      typeof value.amountPaid === "number" && Number.isFinite(value.amountPaid)
        ? value.amountPaid
        : null,
    currency: normalizeText(value.currency),
    paidAt: normalizeDate(value.paidAt),
  };
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
    subscription: normalizeBuddySubscription(value.subscription),
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

function normalizeBookingPagePayload(
  payload: unknown,
): PaginatedResult<AdminBooking> {
  const value = payload as Partial<PaginatedResult<AdminBooking>>;
  return {
    items: ensureArray<unknown>(value.items).map(normalizeBooking),
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

function normalizeUser(item: unknown): AdminUser {
  const value = item as Partial<AdminUser>;
  return {
    id: normalizeText(value.id) ?? "",
    email: normalizeText(value.email),
    fullName: normalizeText(value.fullName),
    gender: normalizeText(value.gender) ?? "Other",
    roles: Array.isArray(value.roles)
      ? value.roles.filter((role): role is string => typeof role === "string")
      : null,
    phoneNumber: normalizeText(value.phoneNumber),
    address: normalizeText(value.address),
    dateOfBirth: normalizeDate(value.dateOfBirth),
    aboutMe: normalizeText(value.aboutMe),
    profilePicture: normalizeText(value.profilePicture),
    isEmailVerified: value.isEmailVerified === true,
    isActive:
      typeof value.isActive === "boolean" ? value.isActive : true,
    createdAt: normalizeDate(value.createdAt) ?? "",
    updatedAt: normalizeDate(value.updatedAt),
  };
}

function normalizeUserPagePayload(payload: unknown): PaginatedResult<AdminUser> {
  const value = payload as Partial<PaginatedResult<AdminUser>>;
  return {
    items: ensureArray<unknown>(value.items).map(normalizeUser),
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

function normalizeOverviewKpiCards(item: unknown): AdminOverviewKpiCards {
  const value = (item ?? {}) as Partial<AdminOverviewKpiCards>;

  return {
    totalUsers: normalizeNumber(value.totalUsers),
    verifiedUsers: normalizeNumber(value.verifiedUsers),
    newUsersThisWindow: normalizeNumber(value.newUsersThisWindow),
    totalBuddies: normalizeNumber(value.totalBuddies),
    activeBuddies: normalizeNumber(value.activeBuddies),
    buddiesWithSubscription: normalizeNumber(value.buddiesWithSubscription),
    totalTrips: normalizeNumber(value.totalTrips),
    openTrips: normalizeNumber(value.openTrips),
    totalIncidents: normalizeNumber(value.totalIncidents),
    unresolvedIncidents: normalizeNumber(value.unresolvedIncidents),
  };
}

function normalizeOverviewTripDemandTrend(
  item: unknown,
): AdminOverviewTripDemandTrend {
  const value = (item ?? {}) as Partial<AdminOverviewTripDemandTrend>;

  return {
    weeks: ensureArray<unknown>(value.weeks).map((week) => {
      const weekValue =
        week as Partial<AdminOverviewTripDemandTrend["weeks"][number]>;

      return {
        weekLabel: normalizeText(weekValue.weekLabel) ?? "Unknown week",
        weekStart: normalizeDate(weekValue.weekStart),
        weekEnd: normalizeDate(weekValue.weekEnd),
        totalTrips: normalizeNumber(weekValue.totalTrips),
        openTrips: normalizeNumber(weekValue.openTrips),
      };
    }),
  };
}

function normalizeOverviewBookingMix(item: unknown): AdminOverviewBookingMix {
  const value = (item ?? {}) as Partial<AdminOverviewBookingMix>;

  return {
    totalBookings: normalizeNumber(value.totalBookings),
    statusBreakdown: ensureArray<unknown>(value.statusBreakdown).map((entry) => {
      const entryValue =
        entry as Partial<AdminOverviewBookingMix["statusBreakdown"][number]>;

      return {
        statusName: normalizeText(entryValue.statusName) ?? "Unknown",
        count: normalizeNumber(entryValue.count),
        percentage: normalizeNumber(entryValue.percentage),
      };
    }),
  };
}

function normalizeOverviewBottomStats(item: unknown): AdminOverviewBottomStats {
  const value = (item ?? {}) as Partial<AdminOverviewBottomStats>;

  return {
    totalRevenue: normalizeNumber(value.totalRevenue),
    platformFeeRevenue: normalizeNumber(value.platformFeeRevenue),
    currency: normalizeText(value.currency),
    totalActiveBookings: normalizeNumber(value.totalActiveBookings),
    directBookings: normalizeNumber(value.directBookings),
    resolutionRate: normalizeNumber(value.resolutionRate),
    resolvedIncidents: normalizeNumber(value.resolvedIncidents),
    closedIncidents: normalizeNumber(value.closedIncidents),
  };
}

function normalizeOverviewRevenue(
  item: unknown,
): AdminOverviewRevenueOverview {
  const value = (item ?? {}) as Partial<AdminOverviewRevenueOverview>;

  return {
    totalBookingRevenue: normalizeNumber(value.totalBookingRevenue),
    totalPlatformFees: normalizeNumber(value.totalPlatformFees),
    totalSubscriptionRevenue: normalizeNumber(value.totalSubscriptionRevenue),
    totalCombinedRevenue: normalizeNumber(value.totalCombinedRevenue),
    revenueThisMonth: normalizeNumber(value.revenueThisMonth),
    revenueLastMonth: normalizeNumber(value.revenueLastMonth),
    growthPercentage: normalizeNumber(value.growthPercentage),
  };
}

function normalizeOverviewBuddyGrowthTrend(
  item: unknown,
): AdminOverviewBuddyGrowthTrend {
  const value = (item ?? {}) as Partial<AdminOverviewBuddyGrowthTrend>;

  return {
    weeks: ensureArray<unknown>(value.weeks).map((week) => {
      const weekValue =
        week as Partial<AdminOverviewBuddyGrowthTrend["weeks"][number]>;

      return {
        weekLabel: normalizeText(weekValue.weekLabel) ?? "Unknown week",
        weekStart: normalizeDate(weekValue.weekStart),
        weekEnd: normalizeDate(weekValue.weekEnd),
        newBuddies: normalizeNumber(weekValue.newBuddies),
        newSubscriptions: normalizeNumber(weekValue.newSubscriptions),
        completedBookings: normalizeNumber(weekValue.completedBookings),
      };
    }),
  };
}

function normalizeOverviewBuddySubscriptionDistribution(
  item: unknown,
): AdminOverviewBuddySubscriptionDistribution {
  const value = (item ?? {}) as Partial<AdminOverviewBuddySubscriptionDistribution>;

  return {
    totalSubscribed: normalizeNumber(value.totalSubscribed),
    totalFree: normalizeNumber(value.totalFree),
    packages: ensureArray<unknown>(value.packages).map((pkg) => {
      const packageValue =
        pkg as Partial<AdminOverviewBuddySubscriptionDistribution["packages"][number]>;

      return {
        packageId: normalizeText(packageValue.packageId) ?? "",
        packageName: normalizeText(packageValue.packageName) ?? "Unknown package",
        pricePerMonth: normalizeNumber(packageValue.pricePerMonth),
        currency: normalizeText(packageValue.currency) ?? "VND",
        commissionRate: normalizeNumber(packageValue.commissionRate),
        activeCount: normalizeNumber(packageValue.activeCount),
        percentage: normalizeNumber(packageValue.percentage),
      };
    }),
  };
}

function normalizeOverviewTopBuddy(item: unknown): AdminOverviewTopBuddy {
  const value = (item ?? {}) as Partial<AdminOverviewTopBuddy>;

  return {
    buddyId: normalizeText(value.buddyId) ?? "",
    fullName: normalizeText(value.fullName),
    profilePicture: normalizeText(value.profilePicture),
    totalEarnings: normalizeNumber(value.totalEarnings),
    completedBookings: normalizeNumber(value.completedBookings),
    rating: normalizeNumber(value.rating),
    currentPackage: normalizeText(value.currentPackage),
  };
}

function normalizeOverviewBuddyRecentActivity(
  item: unknown,
): AdminOverviewBuddyRecentActivity {
  const value = (item ?? {}) as Partial<AdminOverviewBuddyRecentActivity>;

  return {
    recentRegistrations: ensureArray<unknown>(value.recentRegistrations).map(
      (registration) => {
        const entry =
          registration as Partial<AdminOverviewBuddyRecentActivity["recentRegistrations"][number]>;

        return {
          buddyId: normalizeText(entry.buddyId) ?? "",
          fullName: normalizeText(entry.fullName),
          email: normalizeText(entry.email),
          registeredAt: normalizeDate(entry.registeredAt),
        };
      },
    ),
    recentBookings: ensureArray<unknown>(value.recentBookings).map((booking) => {
      const entry =
        booking as Partial<AdminOverviewBuddyRecentActivity["recentBookings"][number]>;

      return {
        bookingId: normalizeText(entry.bookingId) ?? "",
        buddyName: normalizeText(entry.buddyName),
        travelerName: normalizeText(entry.travelerName),
        statusName: normalizeText(entry.statusName),
        totalAmount: normalizeNumber(entry.totalAmount),
        createdAt: normalizeDate(entry.createdAt),
      };
    }),
    recentSubscriptions: ensureArray<unknown>(value.recentSubscriptions).map(
      (subscription) => {
        const entry =
          subscription as Partial<AdminOverviewBuddyRecentActivity["recentSubscriptions"][number]>;

        return {
          buddyId: normalizeText(entry.buddyId) ?? "",
          buddyName: normalizeText(entry.buddyName),
          packageName: normalizeText(entry.packageName),
          amountPaid: normalizeNumber(entry.amountPaid),
          currency: normalizeText(entry.currency),
          paidAt: normalizeDate(entry.paidAt),
        };
      },
    ),
  };
}

function normalizeOverviewSummary(item: unknown): AdminOverviewSummary {
  const value = (item ?? {}) as Partial<AdminOverviewSummary>;
  const kpiCards = (value.kpiCards ?? {}) as Partial<AdminOverviewSummary["kpiCards"]>;
  const tripDemandTrend = (value.tripDemandTrend ?? {}) as Partial<AdminOverviewSummary["tripDemandTrend"]>;
  const bookingMix = (value.bookingMix ?? {}) as Partial<AdminOverviewSummary["bookingMix"]>;
  const bottomStats = (value.bottomStats ?? {}) as Partial<AdminOverviewSummary["bottomStats"]>;
  const revenueOverview = (value.revenueOverview ?? {}) as Partial<AdminOverviewSummary["revenueOverview"]>;
  const recentActivity = (value.recentActivity ?? {}) as Partial<AdminOverviewSummary["recentActivity"]>;
  const platformHealth = (value.platformHealth ?? {}) as Partial<AdminOverviewSummary["platformHealth"]>;

  return {
    kpiCards: normalizeOverviewKpiCards(kpiCards),
    tripDemandTrend: normalizeOverviewTripDemandTrend(tripDemandTrend),
    bookingMix: normalizeOverviewBookingMix(bookingMix),
    bottomStats: normalizeOverviewBottomStats(bottomStats),
    revenueOverview: normalizeOverviewRevenue(revenueOverview),
    recentActivity: {
      recentBookings: ensureArray<unknown>(recentActivity.recentBookings).map((item) => {
        const itemValue = item as Partial<AdminOverviewSummary["recentActivity"]["recentBookings"][number]>;
        return {
          id: normalizeText(itemValue.id) ?? "",
          travelerName: normalizeText(itemValue.travelerName),
          buddyName: normalizeText(itemValue.buddyName),
          statusName: normalizeText(itemValue.statusName),
          totalAmount: normalizeNumber(itemValue.totalAmount),
          createdAt: normalizeDate(itemValue.createdAt),
        };
      }),
      recentIncidents: ensureArray<unknown>(recentActivity.recentIncidents).map((item) => {
        const itemValue = item as Partial<AdminOverviewSummary["recentActivity"]["recentIncidents"][number]>;
        return {
          id: normalizeText(itemValue.id) ?? "",
          typeName: normalizeText(itemValue.typeName),
          statusName: normalizeText(itemValue.statusName),
          reporterName: normalizeText(itemValue.reporterName),
          createdAt: normalizeDate(itemValue.createdAt),
        };
      }),
      recentUsers: ensureArray<unknown>(recentActivity.recentUsers).map((item) => {
        const itemValue = item as Partial<AdminOverviewSummary["recentActivity"]["recentUsers"][number]>;
        return {
          id: normalizeText(itemValue.id) ?? "",
          fullName: normalizeText(itemValue.fullName),
          email: normalizeText(itemValue.email),
          isEmailVerified: normalizeBoolean(itemValue.isEmailVerified),
          createdAt: normalizeDate(itemValue.createdAt),
        };
      }),
    },
    platformHealth: {
      userVerificationRate: normalizeNumber(platformHealth.userVerificationRate),
      inactiveUsers: normalizeNumber(platformHealth.inactiveUsers),
      averageBuddyRating: normalizeNumber(platformHealth.averageBuddyRating),
      buddiesWithoutBookings: normalizeNumber(platformHealth.buddiesWithoutBookings),
      bookingCompletionRate: normalizeNumber(platformHealth.bookingCompletionRate),
      averageBookingValue: normalizeNumber(platformHealth.averageBookingValue),
      cancelledBookingsThisMonth: normalizeNumber(platformHealth.cancelledBookingsThisMonth),
      activeSubscriptions: normalizeNumber(platformHealth.activeSubscriptions),
      pendingPaymentSubscriptions: normalizeNumber(platformHealth.pendingPaymentSubscriptions),
      subscriptionByPackage: ensureArray<unknown>(platformHealth.subscriptionByPackage).map((item) => {
        const itemValue = item as Partial<AdminOverviewSummary["platformHealth"]["subscriptionByPackage"][number]>;
        return {
          packageName: normalizeText(itemValue.packageName) ?? "Unknown",
          count: normalizeNumber(itemValue.count),
        };
      }),
      averageReviewRating: normalizeNumber(platformHealth.averageReviewRating),
      totalReviews: normalizeNumber(platformHealth.totalReviews),
    },
  };
}

export const adminApi = {
  async getUsers(params?: AdminUsersQuery) {
    const res = await httpClient.get<AdminUserListResponse>(
      `${ADMIN_BASE_PATH}/users`,
      params,
    );
    return {
      ...res.data,
      data: normalizeUserPagePayload(res.data.data),
    };
  },

  async getUserById(id: string) {
    const res = await httpClient.get<AdminUserResponse>(
      `${ADMIN_BASE_PATH}/users/${id}`,
    );
    return {
      ...res.data,
      data: normalizeUser(res.data.data),
    };
  },

  async updateUser(id: string, payload: AdminUserUpdateRequest) {
    const res = await httpClient.put<AdminUserResponse, AdminUserUpdateRequest>(
      `${ADMIN_BASE_PATH}/users/${id}`,
      payload,
    );
    return {
      ...res.data,
      data: normalizeUser(res.data.data),
    };
  },

  async toggleUserStatus(id: string) {
    const res = await httpClient.patch<AdminUserResponse>(
      `${ADMIN_BASE_PATH}/users/${id}/toggle-status`,
    );
    return {
      ...res.data,
      data: normalizeUser(res.data.data),
    };
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

  async getBuddiesWithSubscription(params?: AdminBuddiesWithSubscriptionQuery) {
    const res = await httpClient.get<AdminBuddiesWithSubscriptionResponse>(
      `${ADMIN_BASE_PATH}/buddies/with-subscription`,
      params,
    );

    return {
      ...res.data,
      data: normalizeBuddyPagePayload(res.data.data),
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

  async approveBuddy(id: string) {
    const res = await httpClient.patch<AdminBuddyResponse>(
      `${ADMIN_BASE_PATH}/buddies/${id}/approve`,
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

  async getBookings(params?: AdminBookingsQuery) {
    const res = await httpClient.get<AdminBookingListResponse>(
      `${ADMIN_BASE_PATH}/bookings`,
      params,
    );
    return {
      ...res.data,
      data: normalizeBookingPagePayload(res.data.data),
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

  async getOverviewKpiCards(params?: AdminOverviewQuery) {
    const res = await httpClient.get<AdminOverviewKpiCardsResponse>(
      `${ADMIN_BASE_PATH}/overview/kpi-cards`,
      params,
    );

    return {
      ...res.data,
      data: normalizeOverviewKpiCards(res.data.data),
    };
  },

  async getOverviewTripDemandTrend(params?: AdminOverviewQuery) {
    const res = await httpClient.get<AdminOverviewTripDemandTrendResponse>(
      `${ADMIN_BASE_PATH}/overview/trip-demand-trend`,
      params,
    );

    return {
      ...res.data,
      data: normalizeOverviewTripDemandTrend(res.data.data),
    };
  },

  async getOverviewBookingMix(params?: AdminOverviewQuery) {
    const res = await httpClient.get<AdminOverviewBookingMixResponse>(
      `${ADMIN_BASE_PATH}/overview/booking-mix`,
      params,
    );

    return {
      ...res.data,
      data: normalizeOverviewBookingMix(res.data.data),
    };
  },

  async getOverviewBottomStats(params?: AdminOverviewQuery) {
    const res = await httpClient.get<AdminOverviewBottomStatsResponse>(
      `${ADMIN_BASE_PATH}/overview/bottom-stats`,
      params,
    );

    return {
      ...res.data,
      data: normalizeOverviewBottomStats(res.data.data),
    };
  },

  async getOverviewRevenue(params?: AdminOverviewQuery) {
    const res = await httpClient.get<AdminOverviewRevenueOverviewResponse>(
      `${ADMIN_BASE_PATH}/overview/revenue`,
      params,
    );

    return {
      ...res.data,
      data: normalizeOverviewRevenue(res.data.data),
    };
  },

  async getOverviewBuddyGrowthTrend(params?: AdminOverviewQuery) {
    const res = await httpClient.get<AdminOverviewBuddyGrowthTrendResponse>(
      `${ADMIN_BASE_PATH}/overview/buddy-growth-trend`,
      params,
    );

    return {
      ...res.data,
      data: normalizeOverviewBuddyGrowthTrend(res.data.data),
    };
  },

  async getOverviewBuddySubscriptionDistribution(params?: AdminOverviewQuery) {
    const res =
      await httpClient.get<AdminOverviewBuddySubscriptionDistributionResponse>(
        `${ADMIN_BASE_PATH}/overview/buddy-subscription-distribution`,
        params,
      );

    return {
      ...res.data,
      data: normalizeOverviewBuddySubscriptionDistribution(res.data.data),
    };
  },

  async getOverviewBuddyTopEarners(params?: AdminOverviewTopBuddiesQuery) {
    const res = await httpClient.get<AdminOverviewTopBuddiesResponse>(
      `${ADMIN_BASE_PATH}/overview/buddy-top-earners`,
      params,
    );

    return {
      ...res.data,
      data: ensureArray<unknown>(res.data.data).map(normalizeOverviewTopBuddy),
    };
  },

  async getOverviewBuddyTopRated(params?: AdminOverviewTopBuddiesQuery) {
    const res = await httpClient.get<AdminOverviewTopBuddiesResponse>(
      `${ADMIN_BASE_PATH}/overview/buddy-top-rated`,
      params,
    );

    return {
      ...res.data,
      data: ensureArray<unknown>(res.data.data).map(normalizeOverviewTopBuddy),
    };
  },

  async getOverviewBuddyRecentActivity(params?: AdminOverviewQuery) {
    const res = await httpClient.get<AdminOverviewBuddyRecentActivityResponse>(
      `${ADMIN_BASE_PATH}/overview/buddy-recent-activity`,
      params,
    );

    return {
      ...res.data,
      data: normalizeOverviewBuddyRecentActivity(res.data.data),
    };
  },

  async getOverviewSummary(params?: AdminOverviewSummaryQuery) {
    const res = await httpClient.get<AdminOverviewSummaryResponse>(
      `${ADMIN_BASE_PATH}/overview/summary`,
      params,
    );

    return {
      ...res.data,
      data: normalizeOverviewSummary(res.data.data),
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
