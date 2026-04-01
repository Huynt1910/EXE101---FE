"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle2, XCircle } from "lucide-react";

type Plan = {
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

const plans: Plan[] = [
  {
    name: "Starter",
    price: "50,000",
    description:
      "For new buddies who want to try the platform and start with the essentials.",
    features: [
      { label: "Profile visible on the platform", included: true },
      { label: "Unlimited booking requests", included: true },
      { label: "20% commission", included: true },
      { label: "Chat with travelers in the app", included: true },
      { label: "Priority visibility", included: false },
      { label: "Priority support", included: false },
    ],
    cta: "Choose Starter",
    href: "/buddy/apply",
  },
  {
    name: "Pro",
    price: "100,000",
    description:
      "For buddies who want to grow income, stand out more, and build a stronger personal brand.",
    features: [
      { label: "Profile visible on the platform", included: true },
      { label: "Unlimited booking requests", included: true },
      { label: "Only 10% commission", included: true },
      { label: "Chat with travelers in the app", included: true },
      { label: "Priority placement in search", included: true },
      { label: "Priority support", included: false },
    ],
    cta: "Choose Pro",
    href: "/buddy/apply",
    featured: true,
  },
  {
    name: "Founder",
    price: "150,000",
    description:
      "Only 30 spots. Early adopter benefits for the first buddies joining Bonddy.",
    features: [
      { label: "Everything included in Pro", included: true },
      { label: "0% commission and keep 100% income", included: true },
      { label: "Top placement in search", included: true },
      { label: "Direct support from the Bonddy team", included: true },
      { label: "Input on product direction", included: true },
      { label: "Limited to 30 spots", included: true },
    ],
    cta: "Choose Founder",
    href: "/buddy/apply",
  },
];

export default function PricingSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex rounded-full border border-border bg-secondary px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary-foreground">
            Pricing
          </div>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Choose the plan that fits your growth on Bonddy
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Pricing built for buddies who want better visibility, stronger
            earnings, and more support as they grow on the platform.
          </p>
        </div>

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
                {plan.features.map((feature) => (
                  <li
                    key={feature.label}
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
                <Link
                  href={plan.href}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-5 py-4 text-2xl font-semibold transition ${
                    plan.featured
                      ? "border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/8"
                      : "border-border bg-secondary text-secondary-foreground hover:bg-background"
                  }`}
                >
                  {plan.cta}
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
