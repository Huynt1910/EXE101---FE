"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { TripRequestsFilters } from "./components/TripRequestsFilters";
import { TripRequestsGrid } from "./components/TripRequestsGrid";
import type {
  DateFilter,
  PeopleFilter,
  SortMode,
  TripRequestViewModel,
} from "./components/types";
import { useOpenTrips } from "@/features/trip/hooks/useTripQueries";

function isWeekend(date: Date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isThisWeek(date: Date, now: Date) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(today);
  end.setDate(today.getDate() + 7);
  return date >= today && date <= end;
}

function matchesDateFilter(startTime: string, filter: DateFilter) {
  if (filter === "All") return true;
  const now = new Date();
  const date = new Date(startTime);
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  if (filter === "Today") return sameDay;
  if (filter === "ThisWeek") return isThisWeek(date, now);
  if (filter === "Weekend") return isWeekend(date);
  return true;
}

function matchesPeopleFilter(groupSize: number, filter: PeopleFilter) {
  if (filter === "All") return true;
  if (filter === "1-2") return groupSize >= 1 && groupSize <= 2;
  if (filter === "3-5") return groupSize >= 3 && groupSize <= 5;
  return groupSize >= 6;
}

function sortRequests(requests: TripRequestViewModel[], sortMode: SortMode) {
  const next = [...requests];
  if (sortMode === "Newest") {
    next.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return next;
  }
  if (sortMode === "Earliest") {
    next.sort(
      (a, b) =>
        new Date(`${a.startDate}T${a.startTime}`).getTime() -
        new Date(`${b.startDate}T${b.startTime}`).getTime(),
    );
    return next;
  }
  if (sortMode === "LargestGroup") {
    next.sort((a, b) => b.adults + b.children - (a.adults + a.children));
    return next;
  }
  next.sort((a, b) => b.matchScore - a.matchScore);
  return next;
}

function estimateMatchScore(
  durationHours: number,
  groupSize: number,
  languageCount: number,
) {
  const durationScore = Math.max(0, 100 - Math.min(durationHours * 10, 35));
  const groupScore = Math.max(0, 28 - groupSize * 2);
  const languageScore = Math.min(languageCount * 8, 24);
  return Math.min(
    99,
    45 + Math.floor((durationScore + groupScore + languageScore) / 3),
  );
}

function buildStartDateTime(startDate: string, startTime: string) {
  return new Date(`${startDate}T${startTime}`);
}

export default function BuddyTripRequestsPage() {
  const [dateFilter, setDateFilter] = useState<DateFilter>("All");
  const [peopleFilter, setPeopleFilter] = useState<PeopleFilter>("All");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [sortMode, setSortMode] = useState<SortMode>("Recommended");
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  const openTripsQuery = useOpenTrips({ PageSize: 50 });
  const tripItems = openTripsQuery.data?.data.items ?? [];

  const requests = useMemo(
    () =>
      tripItems.map<TripRequestViewModel>((trip) => ({
        id: trip.id,
        city: trip.city,
        startDate: trip.startDate,
        startTime: trip.startTime,
        durationHours: trip.durationHours,
        adults: trip.adults,
        children: trip.children,
        preferredLanguages: trip.preferredLanguages,
        notes: trip.notes,
        status: trip.status,
        travelerName: trip.travelerName,
        createdAt: trip.createdAt,
        isApplied: appliedIds.includes(trip.id),
        matchScore: estimateMatchScore(
          trip.durationHours,
          trip.adults + trip.children,
          trip.preferredLanguages.length,
        ),
      })),
    [appliedIds, tripItems],
  );

  const languageOptions = useMemo(
    () =>
      Array.from(
        new Set(
          requests
            .flatMap((request) => request.preferredLanguages)
            .filter(Boolean),
        ),
      ),
    [requests],
  );

  const viewData = useMemo(() => {
    const filtered = requests.filter((r) => {
      const startAt = buildStartDateTime(r.startDate, r.startTime);
      if (!matchesDateFilter(startAt.toISOString(), dateFilter)) return false;
      if (!matchesPeopleFilter(r.adults + r.children, peopleFilter))
        return false;
      if (
        languageFilter !== "All" &&
        !r.preferredLanguages.includes(languageFilter)
      ) {
        return false;
      }
      return true;
    });
    return sortRequests(filtered, sortMode);
  }, [dateFilter, languageFilter, peopleFilter, requests, sortMode]);

  const handleApplyContact = (requestId: string) => {
    setAppliedIds((current) =>
      current.includes(requestId) ? current : [...current, requestId],
    );
    toast.success(
      "You have contacted this traveler. Continue the conversation in Messages.",
    );
  };

  const highlightedCity = viewData[0]?.city ?? "Ho Chi Minh City";

  if (openTripsQuery.isLoading) {
    return (
      <main className="min-h-[calc(100vh-84px)] bg-[linear-gradient(180deg,#f4f7f6_0%,#f7f7f8_55%,#f8f6f2_100%)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
          <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 text-sm text-slate-600 shadow-sm">
            Loading trip requests...
          </section>
        </div>
      </main>
    );
  }

  if (openTripsQuery.isError) {
    return (
      <main className="min-h-[calc(100vh-84px)] bg-[linear-gradient(180deg,#f4f7f6_0%,#f7f7f8_55%,#f8f6f2_100%)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
          <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
            Unable to load open trips. Please try again.
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-84px)] bg-[linear-gradient(180deg,#f4f7f6_0%,#f7f7f8_55%,#f8f6f2_100%)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
        {/* Page heading */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Trip Requests</h1>
        </div>

        {/* Filters */}
        <TripRequestsFilters
          dateFilter={dateFilter}
          peopleFilter={peopleFilter}
          languageFilter={languageFilter}
          sortMode={sortMode}
          languageOptions={languageOptions}
          onDateFilterChange={setDateFilter}
          onPeopleFilterChange={setPeopleFilter}
          onLanguageFilterChange={setLanguageFilter}
          onSortModeChange={setSortMode}
        />

        {/* Grid */}
        <TripRequestsGrid
          requests={viewData}
          onApplyContact={handleApplyContact}
        />
      </div>
    </main>
  );
}
