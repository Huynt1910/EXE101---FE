"use client";

import { useParams } from "next/navigation";
import { useTripDetailQuery } from "@/features/trip/hooks/useTrip";
import { TripDetailBreadcrumb } from "./components/TripDetailBreadcrumb";
import { TripDetailHero } from "./components/TripDetailHero";
import { TripDetailLeftContent } from "./components/TripDetailLeftContent";
import { TripDetailRightCard } from "./components/TripDetailRightCard";

export default function TripRequestDetailPage() {
  const params = useParams<{ id: string }>();
  const tripId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const tripDetailQuery = useTripDetailQuery(tripId ?? "");
  const trip = tripDetailQuery.data?.data;

  if (tripDetailQuery.isLoading) {
    return (
      <main className="min-h-[calc(100vh-84px)] bg-[linear-gradient(180deg,#f4f7f6_0%,#f7f7f8_55%,#f8f6f2_100%)]">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-10">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
            Loading trip request details...
          </section>
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
