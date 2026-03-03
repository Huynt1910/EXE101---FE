"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  MapPin,
  PlaneTakeoff,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const TRIP_STYLES = [
  "Food",
  "Relaxation",
  "Adventure",
  "Culture",
  "Family",
  "Photography",
];

const TOP_DESTINATIONS = [
  { name: "Hanoi", image: "/places/ha-noi.png" },
  { name: "Da Nang", image: "/places/da-nang.png" },
  { name: "Nha Trang", image: "/places/nha-trang.png" },
  { name: "Hoi An", image: "/places/hoi-an.png" },
];

export default function TripRequestPage() {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const selectedLabel = useMemo(() => {
    if (selectedStyles.length === 0) return "No style selected";
    return selectedStyles.join(", ");
  }, [selectedStyles]);

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style)
        ? prev.filter((item) => item !== style)
        : [...prev, style],
    );
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-10">
        <div className="relative overflow-hidden rounded-[28px] bg-primary shadow-xl">
          <img
            src="/hero.png"
            alt="Create trip request"
            className="h-[320px] w-full object-cover opacity-80 md:h-[380px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/65 to-transparent" />

          <div className="absolute inset-0 flex items-center px-6 md:px-10">
            <div className="max-w-2xl text-primary-foreground">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs uppercase tracking-[0.18em]">
                <Sparkles className="h-3.5 w-3.5" />
                Bonddy Trip Planner
              </p>
              <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
                Create your trip request and get a personalized plan from a
                local buddy
              </h1>
              <p className="mt-4 max-w-xl text-sm text-primary-foreground/90 md:text-base">
                Share your destination, schedule, and preferences. Bonddy will
                match you with the most suitable buddy for quick consultation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-12 max-w-7xl px-4 pb-12 lg:px-8">
        <Card className="rounded-[24px] border border-border bg-card p-4 shadow-xl md:p-6">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="rounded-xl border border-border p-3">
              <span className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                Preferred destination
              </span>
              <Input
                placeholder="Example: Da Nang, Hoi An"
                className="border-0 px-0 shadow-none"
              />
            </label>

            <label className="rounded-xl border border-border p-3">
              <span className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                Start date
              </span>
              <Input type="date" className="border-0 px-0 shadow-none" />
            </label>

            <label className="rounded-xl border border-border p-3">
              <span className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                End date
              </span>
              <Input type="date" className="border-0 px-0 shadow-none" />
            </label>

            <label className="rounded-xl border border-border p-3">
              <span className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                Travelers
              </span>
              <Input
                type="number"
                min={1}
                defaultValue={2}
                className="border-0 px-0 shadow-none"
              />
            </label>
          </div>

          <div className="mt-4 flex justify-end">
            <Button className="rounded-full px-8">Create request</Button>
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-[24px] border border-border bg-card p-5 md:p-6">
            <div className="mb-5 flex items-center gap-2">
              <PlaneTakeoff className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Trip request details
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">
                  Departure city
                </span>
                <Input placeholder="Ho Chi Minh City" />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">
                  Budget range (USD)
                </span>
                <Input placeholder="500 - 1200" />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm text-muted-foreground">
                  Travel styles you prefer
                </span>
                <div className="flex flex-wrap gap-2">
                  {TRIP_STYLES.map((style) => {
                    const active = selectedStyles.includes(style);
                    return (
                      <button
                        key={style}
                        type="button"
                        onClick={() => toggleStyle(style)}
                        className={[
                          "rounded-full border px-3 py-1.5 text-sm transition",
                          active
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:bg-muted",
                        ].join(" ")}
                      >
                        {style}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Selected: {selectedLabel}
                </p>
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm text-muted-foreground">
                  Additional notes
                </span>
                <Textarea
                  rows={5}
                  placeholder="Tell us your must-visit places, preferred activities, pace, and any special requests..."
                />
              </label>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button className="rounded-full px-7">Submit request</Button>
              <Button variant="outline" className="rounded-full px-7">
                Save draft
              </Button>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-[24px] border border-border bg-card p-5 md:p-6">
              <h3 className="text-lg font-semibold">Popular destinations</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Quick-select to speed up your request.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {TOP_DESTINATIONS.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    className="overflow-hidden rounded-xl border border-border text-left transition hover:shadow-sm"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-full object-cover"
                    />
                    <div className="p-2.5">
                      <p className="text-sm font-medium text-foreground">
                        {item.name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="rounded-[24px] border-0 bg-primary p-5 text-primary-foreground md:p-6">
              <h3 className="text-lg font-semibold">How your request is handled</h3>
              <ol className="mt-3 space-y-2 text-sm text-primary-foreground/90">
                <li>1. You submit your trip request form.</li>
                <li>2. Bonddy suggests the best matching buddy within 24 hours.</li>
                <li>3. You chat directly to finalize your itinerary.</li>
                <li>4. Start your journey with a personalized local plan.</li>
              </ol>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
