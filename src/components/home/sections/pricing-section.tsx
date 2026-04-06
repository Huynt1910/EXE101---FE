"use client";

import { useRouter } from "next/navigation";
import { ArrowUpRight, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import {
  useServicePackages,
  useSubscribeServicePackageMutation,
} from "@/features/service-package/hooks/useServicePackage";
import type { ServicePackage } from "@/features/service-package/type";
import { hasRole } from "@/lib/auth/route-access";
import { buildAuthUrl } from "@/lib/callback-url";
import { useAuthStore } from "@/lib/store/authStore";

type Plan = {
  id?: string;
  name: string;
  price: string;
  description: string;
  features: Array<{
    label: string;
    included: boolean;
  }>;
  cta: string;
  href: string;
  featured?: boolean;
};

type PricingSectionProps = {
  embedded?: boolean;
};

const REDIRECT_NOTICE_DELAY_MS = 1800;

function formatPlanPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatCommissionRate(rate: number) {
  return `${Math.round(rate * 100)}% commission`;
}

function dedupePlanFeatures(features: Plan["features"]) {
  const seenLabels = new Set<string>();

  return features.filter((feature) => {
    const key = feature.label.trim().toLowerCase();
    if (!key || seenLabels.has(key)) return false;

    seenLabels.add(key);
    return true;
  });
}

function mapServicePackageToPlan(servicePackage: ServicePackage): Plan {
  const featureSet = new Set(
    servicePackage.features.map((feature) => feature.trim()).filter(Boolean),
  );

  const baseFeatures = [
    {
      label: servicePackage.features[0] || "Profile visible on the platform",
      included: true,
    },
    {
      label: servicePackage.features[1] || "Unlimited booking requests",
      included: true,
    },
    {
      label:
        servicePackage.features.find((feature) =>
          feature.toLowerCase().includes("commission"),
        ) || formatCommissionRate(servicePackage.commissionRate),
      included: true,
    },
    {
      label:
        servicePackage.features.find((feature) =>
          feature.toLowerCase().includes("chat"),
        ) || "Chat with travelers in the app",
      included: servicePackage.hasChatAccess,
    },
    {
      label:
        [...featureSet].find((feature) =>
          feature.toLowerCase().includes("tìm kiếm"),
        ) || "Priority placement in search",
      included: servicePackage.hasSearchPriority,
    },
    {
      label:
        [...featureSet].find((feature) =>
          feature.toLowerCase().includes("hỗ trợ"),
        ) || "Priority support",
      included: servicePackage.hasPrioritySupport,
    },
  ];

  const founderSlotFeature =
    servicePackage.maxSlots && servicePackage.maxSlots > 0
      ? {
          label:
            servicePackage.features.find((feature) =>
              feature.toLowerCase().includes("suất"),
            ) || `Limited to ${servicePackage.maxSlots} slots`,
          included: true,
        }
      : null;

  return {
    id: servicePackage.id,
    name: servicePackage.name,
    price: formatPlanPrice(servicePackage.pricePerMonth),
    description:
      servicePackage.description || "Designed for buddies growing on Bonddy.",
    features: dedupePlanFeatures(
      servicePackage.name === "Founder" && founderSlotFeature
        ? [
            ...baseFeatures.slice(0, 5),
            {
              label:
                [...featureSet].find((feature) =>
                  feature.toLowerCase().includes("góp ý"),
                ) || "Input on product direction",
              included: servicePackage.hasProductFeedback,
            },
            founderSlotFeature,
          ]
        : baseFeatures,
    ),
    cta: `Choose ${servicePackage.name}`,
    href: "/buddy/apply",
    featured: servicePackage.name === "Pro",
  };
}

function getSubscribeRedirectUrl(payload: unknown): string | null {
  if (typeof payload === "string" && payload.startsWith("http")) {
    return payload;
  }

  if (!payload || typeof payload !== "object") return null;

  const value = payload as {
    approveUrl?: unknown;
    approvalUrl?: unknown;
    checkoutUrl?: unknown;
    data?: unknown;
    url?: unknown;
    paymentOrder?: { approveUrl?: unknown } | null;
  };

  const redirectUrl =
    value.checkoutUrl ||
    value.approveUrl ||
    value.approvalUrl ||
    value.url ||
    value.paymentOrder?.approveUrl;

  if (typeof redirectUrl === "string" && redirectUrl.startsWith("http")) {
    return redirectUrl;
  }

  return value.data ? getSubscribeRedirectUrl(value.data) : null;
}

function getSubscribeResponseMessage(
  message: string | null | undefined,
  payload: unknown,
): string | null {
  if (typeof message === "string" && message.trim()) {
    return message.trim();
  }

  if (!payload || typeof payload !== "object") return null;

  const value = payload as {
    message?: unknown;
    data?: unknown;
  };

  if (typeof value.message === "string" && value.message.trim()) {
    return value.message.trim();
  }

  return value.data ? getSubscribeResponseMessage(undefined, value.data) : null;
}

export default function PricingSection({
  embedded = false,
}: Readonly<PricingSectionProps>) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const userRoles = user?.roles ?? [];

  const servicePackagesQuery = useServicePackages();
  const subscribePackageMutation = useSubscribeServicePackageMutation();

  const plans = (servicePackagesQuery.data?.data ?? [])
    .filter((servicePackage) => servicePackage.isActive)
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map(mapServicePackageToPlan);

  const handleChoosePackage = async (plan: Plan) => {
    if (!isAuthenticated) {
      toast.error("Please log in before choosing a service package.", {
        description: "Login required",
      });
      router.push(buildAuthUrl("/login", "/buddy/package"));
      return;
    }

    if (!hasRole(userRoles, "Buddy")) {
      toast.error(
        "Please register as a buddy before subscribing to a package.",
        {
          description: "Buddy profile required",
        },
      );
      router.push(plan.href);
      return;
    }

    if (!plan.id) {
      toast.error("This package is not available for subscription right now.", {
        description: "Package unavailable",
      });
      return;
    }

    try {
      const response = await subscribePackageMutation.mutateAsync({
        servicePackageId: plan.id,
        preferredPaymentMethod: "PayOS",
      });
      const apiResponseMessage = getSubscribeResponseMessage(
        response.message,
        response.data,
      );
      const fallbackMessage = `Your subscription request for ${plan.name} was processed.`;
      const redirectUrl = getSubscribeRedirectUrl(response.data);

      if (redirectUrl) {
        if (apiResponseMessage) {
          toast.success(apiResponseMessage, {
            description: "Package selected",
          });

          globalThis.setTimeout(() => {
            globalThis.location.href = redirectUrl;
          }, REDIRECT_NOTICE_DELAY_MS);
          return;
        }

        globalThis.location.href = redirectUrl;
        return;
      }

      toast.success(apiResponseMessage || fallbackMessage, {
        description: "Service package updated",
      });
    } catch (error) {
      toast.error(
        error && typeof error === "object" && "message" in error
          ? String((error as { message?: string }).message)
          : "Please try again later.",
        {
          description: "Could not subscribe",
        },
      );
    }
  };

  const content = (
    <div className="mx-auto max-w-7xl">
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`flex min-h-[40rem] flex-col rounded-[2rem] border p-7 shadow-sm transition-all ${
              plan.featured
                ? "border-primary bg-primary text-primary-foreground shadow-[0_0_0_2px_color-mix(in_srgb,var(--primary)_28%,transparent)]"
                : "border-border bg-card text-foreground"
            }`}
          >
            <div>
              <p className="text-lg font-semibold">{plan.name}</p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-5xl font-semibold leading-none">
                  {plan.price}
                </span>
                <span
                  className={`pb-1 text-xl font-medium ${
                    plan.featured
                      ? "text-primary-foreground/75"
                      : "text-muted-foreground"
                  }`}
                >
                  VND / month
                </span>
              </div>
              <p
                className={`mt-4 max-w-xs text-lg leading-9 ${
                  plan.featured
                    ? "text-primary-foreground/75"
                    : "text-muted-foreground"
                }`}
              >
                {plan.description}
              </p>
            </div>

            <div
              className={`my-8 h-px ${
                plan.featured ? "bg-primary-foreground/10" : "bg-border"
              }`}
            />

            <ul className="space-y-4">
              {plan.features.map((feature, featureIndex) => (
                <li
                  key={`${plan.name}-${feature.label}-${featureIndex}`}
                  className="flex items-start gap-3 text-lg font-medium leading-9"
                >
                  {feature.included ? (
                    <CheckCircle2
                      className={`mt-1 h-5 w-5 shrink-0 ${
                        plan.featured
                          ? "text-accent-foreground"
                          : "text-primary"
                      }`}
                    />
                  ) : (
                    <XCircle
                      className={`mt-1 h-5 w-5 shrink-0 ${
                        plan.featured
                          ? "text-primary-foreground/40"
                          : "text-muted-foreground"
                      }`}
                    />
                  )}
                  <span
                    className={
                      feature.included
                        ? plan.featured
                          ? "text-primary-foreground"
                          : "text-foreground"
                        : plan.featured
                          ? "text-primary-foreground/65"
                          : "text-muted-foreground"
                    }
                  >
                    {feature.label}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-10">
              <button
                type="button"
                onClick={() => handleChoosePackage(plan)}
                disabled={subscribePackageMutation.isPending}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-5 py-4 text-2xl font-semibold transition ${
                  plan.featured
                    ? "border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/8"
                    : "border-border bg-secondary text-secondary-foreground hover:bg-background"
                } disabled:cursor-not-allowed disabled:opacity-70`}
              >
                {plan.cta}
                <ArrowUpRight className="h-5 w-5" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );

  if (embedded) {
    return <div className="space-y-6">{content}</div>;
  }

  return (
    <section id="pricing" className="px-4 py-16 sm:px-6 lg:px-8">
      {content}
    </section>
  );
}
