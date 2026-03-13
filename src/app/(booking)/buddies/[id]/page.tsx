"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CalendarRange,
  Globe2,
  MapPin,
  ShieldCheck,
  Star,
  UserCheck,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { buddiesData } from "@/lib/data/buddies";
import { getBuddyProfileData } from "@/lib/buddy-profile";
import {
  advanceBookingStatus,
  chooseBuddyForLatestTripRequest,
} from "@/lib/trip-request";

export default function BuddyProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const buddy = useMemo(() => buddiesData[Number(params.id)], [params.id]);
  const profile = useMemo(() => (buddy ? getBuddyProfileData(buddy) : null), [buddy]);

  if (!buddy || !profile) {
    return (
      <main className="min-h-screen bg-background px-4 py-16 lg:px-8">
        <Card className="mx-auto max-w-3xl rounded-[28px] p-8 text-center shadow-xl">
          <h1 className="text-3xl font-semibold">Buddy not found</h1>
          <div className="mt-6">
            <Button asChild className="rounded-full px-7">
              <Link href="/trip-request/buddies">Back to suggestions</Link>
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  const handleConfirm = () => {
    chooseBuddyForLatestTripRequest(buddy.id);
    advanceBookingStatus(
      "MATCHED",
      "Customer booked with a buddy and both sides can now continue in inbox.",
    );
    router.push("/inbox");
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffaf4_0%,#ffffff_45%,#f4fbfa_100%)] text-foreground">
      <section className="relative h-[280px] overflow-hidden md:h-[360px]">
        <img src={profile.coverImage} alt={buddy.buddy} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex items-end gap-4 text-white">
              <img src={buddy.buddyImage || "/placeholder-user.png"} alt={buddy.buddy} className="h-24 w-24 rounded-[28px] border-4 border-white/70 object-cover md:h-28 md:w-28" />
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-white/80">Buddy profile</p>
                <h1 className="mt-2 text-3xl font-semibold md:text-5xl">{buddy.buddy}</h1>
                <p className="mt-2 text-sm text-white/80">{buddy.title}</p>
              </div>
            </div>
            <Button type="button" className="rounded-full px-6" onClick={() => setConfirmOpen(true)}>
              Choose buddy for this trip
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Card className="rounded-[28px] border border-border bg-card p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-semibold">About this buddy</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{buddy.buddyBio}</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-border p-5"><p className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 text-primary" />City coverage</p><p className="mt-3 font-semibold">{profile.cityExpertise.join(", ")}</p></div>
                <div className="rounded-3xl border border-border p-5"><p className="flex items-center gap-2 text-sm text-muted-foreground"><Globe2 className="h-4 w-4 text-primary" />Languages</p><p className="mt-3 font-semibold">{profile.languages.join(", ")}</p></div>
                <div className="rounded-3xl border border-border p-5"><p className="flex items-center gap-2 text-sm text-muted-foreground"><UserCheck className="h-4 w-4 text-primary" />Trips completed</p><p className="mt-3 font-semibold">{profile.tripsLed}</p></div>
                <div className="rounded-3xl border border-border p-5"><p className="flex items-center gap-2 text-sm text-muted-foreground"><Star className="h-4 w-4 text-primary" />Average rating</p><p className="mt-3 font-semibold">{buddy.buddyRating} / 5</p></div>
              </div>
            </Card>
            <Card className="rounded-[28px] border border-border bg-card p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-semibold">Specialties</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.tags.concat(profile.styles).map((item) => (
                  <Badge key={item} variant="outline" className="rounded-full px-3 py-1 text-xs">{item}</Badge>
                ))}
              </div>
              <h3 className="mt-8 text-lg font-semibold">Past feedback</h3>
              <div className="mt-4 space-y-4">
                {profile.feedback.map((item) => (
                  <div key={item.author} className="rounded-3xl border border-border p-5">
                    <div className="flex items-center justify-between gap-3"><p className="font-semibold">{item.author}</p><span className="text-sm text-muted-foreground">{item.rating} stars</span></div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
              <h3 className="text-xl font-semibold">Decision support</h3>
              <div className="mt-4 space-y-4 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" />Reference price: ${buddy.price}/hour</p>
                <p className="flex items-center gap-2"><CalendarRange className="h-4 w-4 text-primary" />Availability: {profile.availability.join(" | ")}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button type="button" className="rounded-full px-5" onClick={() => setConfirmOpen(true)}>Choose buddy for this trip</Button>
                <Button asChild variant="outline" className="rounded-full px-5"><Link href="/trip-request/buddies">Back to list</Link></Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send invite to {buddy.buddy}?</AlertDialogTitle>
            <AlertDialogDescription>This will connect both sides in inbox so they can chat and review the proposal there.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Open inbox</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
