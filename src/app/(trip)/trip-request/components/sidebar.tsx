import { CheckCircle2, Coins, ShieldCheck, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  formatDurationHours,
  formatTravelerSummary,
  formatTripRequestDateTime,
  type TripRequestFormData,
} from "@/lib/trip-request";

export function PopularDistrictsCard({
  districts,
  onSelectDistrict,
}: {
  districts: readonly string[];
  onSelectDistrict: (district: string) => void;
}) {
  return (
    <Card className="booking-card-padded">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Ho Chi Minh City coverage
          </p>
          <h3 className="mt-2 text-xl font-semibold">
            Popular districts for matching
          </h3>
        </div>
        <span className="text-sm text-muted-foreground">Quick select</span>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
        {districts.slice(0, 6).map((district) => (
          <button
            key={district}
            type="button"
            onClick={() => onSelectDistrict(district)}
            className="rounded-3xl border border-border bg-background p-4 text-left transition hover:border-primary/30"
          >
            <p className="font-semibold">{district}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Popular pick for food, culture, and city walks.
            </p>
          </button>
        ))}
      </div>
    </Card>
  );
}

export function TripPreviewCard({
  formData,
  matchingEstimate,
}: {
  formData: TripRequestFormData;
  matchingEstimate: string | null;
}) {
  return (
    <Card className="booking-card-padded">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Trip preview
          </p>
          <h3 className="mt-2 text-xl font-semibold">Your trip at a glance</h3>
        </div>
        {matchingEstimate ? (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {matchingEstimate}
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3">
        <div className="rounded-2xl border border-border p-4">
          <p className="text-sm text-muted-foreground">City</p>
          <p className="mt-2 font-medium">
            {formData.city || "Choose your destination"}
          </p>
        </div>
        <div className="rounded-2xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Start time</p>
          <p className="mt-2 font-medium">
            {formatTripRequestDateTime(formData.startTime)}
          </p>
        </div>
        <div className="rounded-2xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Travelers</p>
          <p className="mt-2 font-medium">
            {formatTravelerSummary(formData.adults, formData.children)}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm text-muted-foreground">Languages</p>
            <p className="mt-2 font-medium">
              {formData.preferredLanguage || "Add preferred languages"}
            </p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="mt-2 font-medium">
              {formatDurationHours(formData.durationHours)}
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Notes</p>
          <p className="mt-2 font-medium">
            {formData.notes || "Add any extra details for your buddy"}
          </p>
        </div>
      </div>
    </Card>
  );
}

export function WhatHappensNextCard() {
  return (
    <Card className="booking-muted-panel p-5 md:p-6">
      <h3 className="text-xl font-semibold">What happens next</h3>
      <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
        <li>Get matched with suitable local buddies</li>
        <li>Review profiles, ratings, and specialties</li>
        <li>Chat and confirm the plan together</li>
        <li>Pay securely after the final agreement</li>
      </ul>
    </Card>
  );
}

export function MatchingTipsCard() {
  return (
    <Card className="booking-card-padded">
      <h3 className="text-xl font-semibold">Tips for a better match</h3>
      <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
        <li>Add clear notes about your interests</li>
        <li>Choose a realistic start time and duration</li>
        <li>Include the correct number of adults and children</li>
        <li>
          Mention food, culture, photography, shopping, or nightlife if relevant
        </li>
      </ul>
    </Card>
  );
}

export function TrustSignalsCard() {
  return (
    <Card className="booking-dark-panel p-5 md:p-6">
      <h3 className="text-xl font-semibold">Why travelers trust this flow</h3>
      <ul className="mt-4 space-y-3 text-sm text-white/85">
        <li className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          Verified local buddies
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Transparent pricing before payment
        </li>
        <li className="flex items-center gap-2">
          <Coins className="h-4 w-4" />
          Secure payment after confirmation
        </li>
        <li className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Ratings from previous trips
        </li>
      </ul>
    </Card>
  );
}
