"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pagination } from "@heroui/pagination";
import { TripRequestsFilters } from "./components/TripRequestsFilters";
import { TripRequestsGrid } from "./components/TripRequestsGrid";
import type {
  DateFilter,
  PeopleFilter,
  TripRequestViewModel,
} from "./components/types";
import { useTripRequest } from "@/features/trip/hooks/useTripRequest";
import type { ContactOfferPayload } from "./components/ContactOfferModal";
import { Skeleton } from "@/components/ui/skeleton";

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

function sortRequests(requests: TripRequestViewModel[]) {
  const next = [...requests];
  next.sort((a, b) => b.matchScore - a.matchScore);
  next.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
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
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState<DateFilter>("All");
  const [peopleFilter, setPeopleFilter] = useState<PeopleFilter>("All");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  const { openTripsQuery, submitOfferMutation } = useTripRequest({
    openTripsParams: { PageSize: 8, Page: currentPage },
    enableOpenTrips: true,
  });
  const paginationData = openTripsQuery.data?.data;
  const totalPages =
    paginationData?.totalPages ??
    Math.max(
      1,
      Math.ceil((paginationData?.totalCount ?? 0) / (paginationData?.pageSize ?? 8)),
    );
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
    return sortRequests(filtered);
  }, [dateFilter, languageFilter, peopleFilter, requests]);

  const handleApplyContact = async (
    requestId: string,
    payload: ContactOfferPayload,
  ) => {
    const selectedTrip = requests.find((item) => item.id === requestId);
    if (!selectedTrip) {
      toast.error("Could not find selected trip request.");
      return;
    }

    try {
      const offerRes = await submitOfferMutation.mutateAsync({
        payload: {
          tripId: requestId,
          offeredPrice: payload.offeredPrice,
          isInboxOnly: payload.isInboxOnly,
          note: payload.note,
        },
      });

      const roomId = offerRes.data?.existingChatRoomId;

      setAppliedIds((current) =>
        current.includes(requestId) ? current : [...current, requestId],
      );
      toast.success("Offer sent! Continue the conversation in Messages.");

      if (roomId) {
        router.push(`/buddy/messages?roomId=${encodeURIComponent(roomId)}`);
      } else {
        router.push("/buddy/messages");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send offer";
      toast.error(message);
      throw error;
    }
  };

  if (openTripsQuery.isLoading) {
    return (
      <main className="min-h-[calc(100vh-84px)] bg-[linear-gradient(180deg,#f4f7f6_0%,#f7f7f8_55%,#f8f6f2_100%)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
          <Skeleton className="h-9 w-48 rounded-xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <Skeleton className="h-52 w-full rounded-none" />
                <div className="flex flex-col gap-2.5 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-8 w-full" />
                  <div className="flex gap-1.5">
                    <Skeleton className="h-5 w-14 rounded-full" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </div>
                  <Skeleton className="mt-1 h-10 w-full rounded-xl" />
                </div>
              </div>
            ))}
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
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 pb-24 md:px-6 md:py-8 md:pb-8">
        {/* Page heading */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Trip Requests</h1>
        </div>

        {/* Filters */}
        <TripRequestsFilters
          dateFilter={dateFilter}
          peopleFilter={peopleFilter}
          languageFilter={languageFilter}
          languageOptions={languageOptions}
          onDateFilterChange={setDateFilter}
          onPeopleFilterChange={setPeopleFilter}
          onLanguageFilterChange={setLanguageFilter}
        />

        {/* Grid */}
        <TripRequestsGrid
          requests={viewData}
          onApplyContact={handleApplyContact}
        />

        {/* Pagination — only render when there are multiple pages */}
        {totalPages > 1 && (
          <div className="flex justify-center pt-2">
            <Pagination
              showControls
              initialPage={1}
              page={currentPage}
              total={totalPages}
              onChange={setCurrentPage}
              classNames={{
                item:
                  "transition-colors hover:bg-orange-100 hover:text-orange-700",
                prev:
                  "transition-colors hover:bg-orange-100 hover:text-orange-700",
                next:
                  "transition-colors hover:bg-orange-100 hover:text-orange-700",
                cursor: "bg-orange-600 text-white",
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
}
