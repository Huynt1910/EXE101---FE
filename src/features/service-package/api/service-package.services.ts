import type { ApiResponse } from "@/features/api-type";
import type {
  GetMyServiceSubscriptionResponse,
  GetServicePackagesResponse,
  ServicePackage,
  ServicePackageSubscription,
  SubscribeServicePackageRequest,
  SubscribeServicePackageResponse,
} from "@/features/service-package/type";
import { type ApiError, httpClient } from "@/lib/http/client";

const SERVICE_PACKAGES_BASE_PATH = "/api/ServicePackages";

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

function normalizeServicePackage(item: unknown): ServicePackage {
  const value = item as Partial<ServicePackage>;

  return {
    id: normalizeText(value.id) ?? "",
    name: normalizeText(value.name) ?? "Unnamed package",
    description: normalizeText(value.description),
    pricePerMonth:
      typeof value.pricePerMonth === "number" &&
      Number.isFinite(value.pricePerMonth)
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
        : null,
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

function normalizeServiceSubscription(
  item: unknown,
): ServicePackageSubscription | null {
  if (!item || typeof item !== "object") return null;

  const value = item as Partial<ServicePackageSubscription>;

  return {
    id: normalizeText(value.id) ?? "",
    buddyId: normalizeText(value.buddyId) ?? "",
    servicePackageId: normalizeText(value.servicePackageId) ?? "",
    packageName: normalizeText(value.packageName) ?? "Unknown package",
    commissionRate:
      typeof value.commissionRate === "number" &&
      Number.isFinite(value.commissionRate)
        ? value.commissionRate
        : 0,
    startDate: normalizeDate(value.startDate),
    endDate: normalizeDate(value.endDate),
    status: normalizeText(value.status) ?? "Unknown",
    paymentMethod: normalizeText(value.paymentMethod),
    amountPaid:
      typeof value.amountPaid === "number" && Number.isFinite(value.amountPaid)
        ? value.amountPaid
        : 0,
    currency: normalizeText(value.currency) ?? "VND",
    externalPaymentRef: normalizeText(value.externalPaymentRef),
    paidAt: normalizeDate(value.paidAt),
    downgradeToPackageId: normalizeText(value.downgradeToPackageId),
    downgradeToPackageName: normalizeText(value.downgradeToPackageName),
    isCancelledAtEndOfCycle: value.isCancelledAtEndOfCycle === true,
    createdAt: normalizeDate(value.createdAt),
    updatedAt: normalizeDate(value.updatedAt),
  };
}

export const servicePackageApi = {
  async getServicePackages() {
    const res = await httpClient.get<GetServicePackagesResponse>(
      SERVICE_PACKAGES_BASE_PATH,
    );

    return {
      ...res.data,
      data: Array.isArray(res.data.data)
        ? res.data.data.map(normalizeServicePackage)
        : [],
    };
  },

  async subscribeServicePackage(payload: SubscribeServicePackageRequest) {
    const res = await httpClient.post<
      SubscribeServicePackageResponse,
      SubscribeServicePackageRequest
    >(`${SERVICE_PACKAGES_BASE_PATH}/subscribe`, payload);

    return res.data;
  },

  async getMySubscription() {
    try {
      const res = await httpClient.get<GetMyServiceSubscriptionResponse>(
        `${SERVICE_PACKAGES_BASE_PATH}/my-subscription`,
      );

      return {
        ...res.data,
        data: normalizeServiceSubscription(res.data.data),
      };
    } catch (error) {
      const apiError = error as ApiError;

      if (
        apiError.message === "No active subscription found." ||
        apiError.status === 404
      ) {
        return {
          success: false,
          code: null,
          message: "No active subscription found.",
          data: null,
          errors: null,
          timestamp: new Date().toISOString(),
        } satisfies ApiResponse<null>;
      }

      throw error;
    }
  },
};
