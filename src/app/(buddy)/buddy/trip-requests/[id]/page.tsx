"use client";

import { useParams } from "next/navigation";
import { useTripRequest } from "@/features/trip/hooks/useTripRequest";
import { Skeleton } from "@/components/ui/skeleton";
import { TripDetailBreadcrumb } from "./components/TripDetailBreadcrumb";
import { TripDetailHero } from "./components/TripDetailHero";
import { TripDetailLeftContent } from "./components/TripDetailLeftContent";
import { TripDetailRightCard } from "./components/TripDetailRightCard";

export default function TripRequestDetailPage() {
  const params = useParams<{ id: string }>();
  const tripId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { tripDetailQuery } = useTripRequest({
    detailId: tripId ?? "",
    enableDetail: Boolean(tripId),
    enableOpenTrips: false,
  });
  const trip = tripDetailQuery.data?.data;

  if (tripDetailQuery.isLoading) {
    return (
      <main className="min-h-[calc(100vh-84px)] bg-[linear-gradient(180deg,#f4f7f6_0%,#f7f7f8_55%,#f8f6f2_100%)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 md:py-10">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-44" />
          </div>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <Skeleton className="h-8 w-56" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-28 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />``
                </div>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                <Skeleton className="h-8 w-28 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,2fr)_380px]">
            <section className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <Skeleton className="h-7 w-44" />
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <Skeleton className="h-7 w-56" />
                <Skeleton className="mt-4 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-11/12" />
                <Skeleton className="mt-2 h-4 w-10/12" />
              </div>
            </section>

            <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <Skeleton className="h-7 w-36" />
              <div className="mt-4 space-y-3">
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
              <Skeleton className="mt-6 h-11 w-full rounded-xl" />
            </aside>
          </div>
        </div>
      </main>
    );
  }

  if (tripDetailQuery.isError || !trip) {
    return (
      <main className="min-h-[calc(100vh-84px)] bg-[linear-gradient(180deg,#f4f7f6_0%,#f7f7f8_55%,#f8f6f2_100%)]">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-10">
          <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
            Unable to load trip request details. Please try again.
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-84px)] bg-[linear-gradient(180deg,#f4f7f6_0%,#f7f7f8_55%,#f8f6f2_100%)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-10 flex flex-col gap-6">
        {/* Breadcrumb */}
        <TripDetailBreadcrumb />

        {/* Hero */}
        <TripDetailHero
          city={trip.city}
          status={trip.status}
          startDate={trip.startDate}
          startTime={trip.startTime}
          durationHours={trip.durationHours}
        />

        {/* 2-column body */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_380px] gap-8 items-start">
          {/* Left — main content */}
          <TripDetailLeftContent
            city={trip.city}
            startDate={trip.startDate}
            startTime={trip.startTime}
            durationHours={trip.durationHours}
            adults={trip.adults}
            childCount={trip.children}
            preferredLanguages={trip.preferredLanguages}
            travelerName={trip.travelerName}
            createdAt={trip.createdAt}
          />

          {/* Right — sticky card */}
          <TripDetailRightCard
            tripId={trip.id}
            startDate={trip.startDate}
            startTime={trip.startTime}
            durationHours={trip.durationHours}
            adults={trip.adults}
            childCount={trip.children}
            preferredLanguages={trip.preferredLanguages}
            notes={trip.notes}
            status={trip.status}
          />
        </div>
      </div>
    </main>
  );
}
