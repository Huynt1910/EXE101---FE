"use client";

import { useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MapPin,
  Star,
  Users,
  MessageCircle,
  Share2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { BUDDIES } from "@/lib/data/buddies";
import { notFound } from "next/navigation";

/** Gợi ý mở rộng schema dữ liệu cho BUDDIES */
type Review = {
  id: string;
  user: string;
  avatar?: string;
  rating: number;
  date: string;
  text: string;
  language?: string;
};
type Experience = {
  id: string;
  title: string;
  durationHours: number;
  pricePerPerson: number;
  highlights: string[];
  photo?: string;
  level?: "Easy" | "Normal" | "Adventurous";
};
type Verification = { id: boolean; phone: boolean; email: boolean };

interface BuddyExt {
  id: string;
  name: string;
  image?: string;
  cities: string[];
  rating: number;
  maxGroup: number;
  styles: string[];
  languages: string[];
  // mới:
  hourlyRate?: number;
  responseTime?: string;
  verifications?: Verification;
  experiences?: Experience[];
  reviews?: Review[];
  photos?: string[];
}

interface BuddyProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function BuddyProfilePage({ params }: BuddyProfilePageProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const resolvedParams = use(params);
  const buddy = BUDDIES.find((b) => b.id === resolvedParams.id) as
    | BuddyExt
    | undefined;

  if (!buddy) notFound();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <Link
            href="/explore"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Explore</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
              }}
              title="Copy profile link"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => setIsFavorited(!isFavorited)}
            >
              <Heart
                className={`w-4 h-4 transition-all ${
                  isFavorited ? "fill-red-500 text-red-500 scale-110" : ""
                }`}
              />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Buddy Header */}
            <Card className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="relative mx-auto sm:mx-0">
                  <img
                    src={buddy?.image || "/placeholder.svg"}
                    alt={buddy?.name || "Buddy"}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover ring-2 ring-background"
                  />
                  <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-green-500 text-white text-[10px] sm:text-xs px-2 py-1 rounded-full">
                    Online
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    {buddy?.name}
                  </h1>

                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-3 sm:mb-4">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground text-sm sm:text-base">
                      {buddy?.cities?.join(", ")}
                    </span>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4 mb-3 sm:mb-4 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold">{buddy?.rating}</span>
                      <span className="text-muted-foreground text-sm">
                        (4.8/5)
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground text-sm">
                        Max {buddy?.maxGroup} people
                      </span>
                    </div>
                    {buddy?.responseTime && (
                      <span className="text-muted-foreground text-sm">
                        ⏱️ Responds in {buddy.responseTime}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3 sm:mb-4 justify-center sm:justify-start">
                    {buddy?.styles?.map((style) => (
                      <Badge
                        key={style}
                        variant="secondary"
                        className="text-xs sm:text-sm"
                      >
                        {style}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    {buddy?.languages?.map((lang) => (
                      <Badge
                        key={lang}
                        variant="outline"
                        className="text-xs sm:text-sm"
                      >
                        {lang}
                      </Badge>
                    ))}
                    {buddy?.verifications?.id && (
                      <Badge variant="outline" className="text-xs sm:text-sm">
                        ✅ ID Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Tabs: About / Experiences / Reviews / FAQ (đơn giản) */}
            <Card className="p-4 sm:p-6">
              <div className="flex gap-2 border-b pb-2 mb-4 overflow-x-auto">
                {/* fake tabs bằng buttons; có thể thay bằng Tabs của shadcn */}
                <TabButton label="About" active />
                <TabButton label="Experiences" />
                <TabButton label="Reviews" />
                <TabButton label="FAQ" />
              </div>

              {/* ABOUT */}
              <section className="space-y-3">
                <h2 className="text-lg sm:text-xl font-semibold">
                  About {buddy?.name?.split(" ")[0]}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  I'm a passionate local guide with 5 years of experience
                  showing travelers the authentic side of {buddy?.cities?.[0]}.
                  I specialize in {buddy?.styles?.join(", ").toLowerCase()}{" "}
                  experiences and love sharing my knowledge about local culture,
                  food, and hidden gems.
                </p>
                <ul className="text-sm text-muted-foreground grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <li>• Small groups for a flexible pace</li>
                  <li>• Hotel meetup or custom pickup</li>
                  <li>• Photo tips & hidden alleys</li>
                  <li>• Rain plan available</li>
                </ul>
              </section>

              {/* EXPERIENCES (mẫu hiển thị nếu có dữ liệu) */}
              {buddy?.experiences?.length ? (
                <section className="mt-6">
                  <h3 className="font-semibold mb-3">Popular Experiences</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {buddy.experiences.slice(0, 2).map((ex) => (
                      <div
                        key={ex.id}
                        className="rounded-xl border p-3 hover:shadow-sm transition"
                      >
                        <div className="flex gap-3">
                          <img
                            src={ex.photo || "/placeholder.svg"}
                            alt={ex.title}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="font-medium">{ex.title}</div>
                            <div className="text-xs text-muted-foreground mb-1">
                              {ex.durationHours}h • {ex.level || "Normal"}
                            </div>
                            <div className="text-sm mb-1 line-clamp-2">
                              {ex.highlights.slice(0, 3).join(" • ")}
                            </div>
                            <div className="text-sm font-semibold">
                              ${ex.pricePerPerson} / person
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {/* REVIEWS SUMMARY */}
              <section className="mt-6">
                <h3 className="font-semibold mb-3">Reviews</h3>
                <ReviewSummary
                  rating={buddy?.rating || 4.8}
                  counts={{ 5: 72, 4: 18, 3: 6, 2: 2, 1: 2 }}
                  total={100}
                />
                {/* Review items demo – thay bằng data thật */}
                <div className="mt-4 space-y-4">
                  {(buddy?.reviews || demoReviews).slice(0, 3).map((r) => (
                    <div key={r.id} className="border rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-full bg-muted overflow-hidden">
                          {r.avatar ? (
                            <img
                              src={r.avatar}
                              className="w-full h-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="text-sm font-medium">{r.user}</div>
                        <div className="ml-auto text-xs text-muted-foreground">
                          {r.date}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mb-1">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{r.text}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQ mini */}
              <section className="mt-6">
                <h3 className="font-semibold mb-2">FAQ</h3>
                <details className="rounded-lg border p-3 mb-2">
                  <summary className="cursor-pointer font-medium">
                    What if it rains?
                  </summary>
                  <p className="text-sm text-muted-foreground mt-2">
                    I have an indoor plan and flexible timing.
                  </p>
                </details>
                <details className="rounded-lg border p-3">
                  <summary className="cursor-pointer font-medium">
                    Is street food safe?
                  </summary>
                  <p className="text-sm text-muted-foreground mt-2">
                    We go to clean, local-fav spots I trust.
                  </p>
                </details>
              </section>
            </Card>
          </div>

          {/* Right Column – Sticky Booking */}
          <div className="space-y-4 sm:space-y-6">
            <BookingCard buddy={buddy} />
            {/* Contact */}
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Contact {buddy?.name?.split(" ")[0]}
              </h2>
              <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                Have questions? Send a message to discuss your trip details.
              </p>
              <Button variant="outline" className="w-full">
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </Card>

            {/* Apply for Trip */}
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Apply for Trip
              </h2>
              <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                Interested in this buddy? Apply to be matched with them for your
                trip.
              </p>
              <Link href={`/buddy/${buddy.id}/apply`}>
                <Button className="w-full" size="lg">
                  Apply Now
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------- Subcomponents ------- */

function TabButton({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted"
      }`}
      type="button"
    >
      {label}
    </button>
  );
}

function ReviewSummary({
  rating,
  counts,
  total,
}: {
  rating: number;
  counts: Record<number, number>;
  total: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="sm:col-span-1 flex items-center justify-center rounded-xl border p-4">
        <div className="text-center">
          <div className="text-4xl font-bold">{rating.toFixed(1)}</div>
          <div className="flex items-center justify-center gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {total} reviews
          </div>
        </div>
      </div>
      <div className="sm:col-span-2 space-y-1.5">
        {[5, 4, 3, 2, 1].map((n) => {
          const pct = Math.round(((counts[n] || 0) / total) * 100);
          return (
            <div key={n} className="flex items-center gap-2">
              <span className="w-5 text-xs">{n}★</span>
              <div className="h-2 flex-1 bg-muted rounded">
                <div
                  className="h-2 rounded bg-amber-400"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-10 text-right text-xs text-muted-foreground">
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BookingCard({ buddy }: { buddy: BuddyExt }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [hours, setHours] = useState(4);
  const [group, setGroup] = useState(2);
  const [addons, setAddons] = useState<{ food: boolean; photo: boolean }>({
    food: false,
    photo: false,
  });

  const baseHourly = buddy.hourlyRate ?? 18; // fallback
  const price = baseHourly * hours * Math.max(1, group * 0.8); // giảm theo nhóm
  const addOnPrice = (addons.food ? 8 * group : 0) + (addons.photo ? 12 : 0);
  const total = Math.round((price + addOnPrice) * 100) / 100;

  return (
    <Card className="p-4 sm:p-6 sticky top-[80px]">
      <h2 className="text-lg sm:text-xl font-semibold mb-3">Book this Buddy</h2>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs text-muted-foreground">
            Date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-2 py-1.5 text-sm"
            />
          </label>
          <label className="text-xs text-muted-foreground">
            Start time
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-2 py-1.5 text-sm"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs text-muted-foreground">
            Duration (hours)
            <input
              type="number"
              min={2}
              max={10}
              step={1}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="mt-1 w-full rounded-md border bg-background px-2 py-1.5 text-sm"
            />
          </label>
          <label className="text-xs text-muted-foreground">
            Group size
            <input
              type="number"
              min={1}
              max={buddy.maxGroup || 8}
              value={group}
              onChange={(e) => setGroup(Number(e.target.value))}
              className="mt-1 w-full rounded-md border bg-background px-2 py-1.5 text-sm"
            />
          </label>
        </div>

        <div className="border rounded-lg p-3">
          <div className="text-xs font-medium mb-2">Add-ons</div>
          <label className="flex items-center gap-2 text-sm mb-1">
            <input
              type="checkbox"
              checked={addons.food}
              onChange={(e) =>
                setAddons((a) => ({ ...a, food: e.target.checked }))
              }
            />
            Street-food tasting (+$8/person)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={addons.photo}
              onChange={(e) =>
                setAddons((a) => ({ ...a, photo: e.target.checked }))
              }
            />
            Photo package (+$12/group)
          </label>
        </div>

        <div className="text-sm">
          <div className="flex justify-between">
            <span>Base</span>
            <span>${(baseHourly * hours).toFixed(2)} x grp factor</span>
          </div>
          {addons.food && (
            <div className="flex justify-between">
              <span>Food add-on</span>
              <span>${(8 * group).toFixed(2)}</span>
            </div>
          )}
          {addons.photo && (
            <div className="flex justify-between">
              <span>Photo add-on</span>
              <span>${(12).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold mt-1 border-t pt-2">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={() => {
            if (!date) {
              alert("Please pick a date");
              return;
            }
            alert(
              `Requested: ${date} ${time} • ${hours}h • group ${group}\nTotal: $${total.toFixed(
                2
              )}`
            );
          }}
        >
          Check availability
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Free cancellation up to 24h before.
        </p>
      </div>
    </Card>
  );
}

/* demo reviews nếu chưa có data */
const demoReviews: Review[] = [
  {
    id: "r1",
    user: "Alex",
    rating: 5,
    date: "Aug 2025",
    text: "Amazing food tour with hidden alley gems!",
  },
  {
    id: "r2",
    user: "Mika",
    rating: 5,
    date: "Jul 2025",
    text: "Super friendly and flexible with our kids.",
  },
  {
    id: "r3",
    user: "Rahul",
    rating: 4,
    date: "Jun 2025",
    text: "Great route. Would book again for night market.",
  },
];
