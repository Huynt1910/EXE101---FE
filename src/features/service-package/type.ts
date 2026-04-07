import type { ApiResponse } from "@/features/api-type";

export interface ServicePackage {
  id: string;
  name: string;
  description: string | null;
  pricePerMonth: number;
  currency: string;
  commissionRate: number;
  hasChatAccess: boolean;
  hasSearchPriority: boolean;
  hasPrioritySupport: boolean;
  hasProductFeedback: boolean;
  maxSlots: number | null;
  currentSlots: number;
  sortOrder: number;
  isActive: boolean;
  features: string[];
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ServicePackageSubscription {
  id: string;
  buddyId: string;
  servicePackageId: string;
  packageName: string;
  commissionRate: number;
  startDate: string | null;
  endDate: string | null;
  status: string;
  paymentMethod: string | null;
  amountPaid: number;
  currency: string;
  externalPaymentRef: string | null;
  paidAt: string | null;
  downgradeToPackageId: string | null;
  downgradeToPackageName: string | null;
  isCancelledAtEndOfCycle: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface SubscribeServicePackageRequest {
  servicePackageId: string;
  preferredPaymentMethod: string;
}

export type GetServicePackagesResponse = ApiResponse<ServicePackage[]>;
export type SubscribeServicePackageResponse = ApiResponse<unknown>;
export type UnsubscribeServicePackageResponse = ApiResponse<unknown>;
export type GetMyServiceSubscriptionResponse =
  ApiResponse<ServicePackageSubscription | null>;
