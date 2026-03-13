"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  applyToBuddyRequest,
  getBuddyAppliedRequestIds,
  getBuddyAvailableRequests,
} from "@/lib/buddy-flow";
import {
  formatBudgetRange,
  formatDurationMinutes,
  formatTripRequestDateTime,
} from "@/lib/trip-request";

export default function BuddyRequestsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [budgetFilter, setBudgetFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All");
  const [appliedIds, setAppliedIds] = useState<string[]>(() => getBuddyAppliedRequestIds());
  const requests = useMemo(() => getBuddyAvailableRequests(), []);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const haystack = [request.city, request.notes, request.shortNotes, request.meetingPoint]
        .join(" ")
        .toLowerCase();

      if (searchQuery && !haystack.includes(searchQuery.toLowerCase())) return false;
      if (cityFilter !== "All" && request.city !== cityFilter) return false;
      if (languageFilter !== "All" && request.preferredLanguage !== languageFilter) return false;
      if (budgetFilter === "Budget" && request.budgetMax > 100) return false;
      if (budgetFilter === "Mid" && (request.budgetMax < 101 || request.budgetMax > 180)) return false;
      if (budgetFilter === "Premium" && request.budgetMax < 181) return false;
      if (timeFilter === "Morning" && new Date(request.startTime).getHours() >= 12) return false;
      if (timeFilter === "Afternoon" && (new Date(request.startTime).getHours() < 12 || new Date(request.startTime).getHours() >= 18)) return false;
      if (timeFilter === "Evening" && new Date(request.startTime).getHours() < 18) return false;

      return true;
    });
  }, [budgetFilter, cityFilter, languageFilter, requests, searchQuery, timeFilter]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f5fbfa_0%,#ffffff_40%,#fffaf3_100%)] text-foreground">
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Buddy flow</p>
            <h1 className="mt-2 text-3xl font-semibold md:text-5xl">Available requests</h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
              Filter open requests by city, time, language, and budget before applying.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full px-5">
            <Link href="/buddy-dashboard">Back to dashboard</Link>
          </Button>
        </div>

        <Card className="mt-8 rounded-[28px] border border-border bg-card p-5 shadow-sm md:p-6">
          <div className="grid gap-3 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
            <label className="relative block">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search city, note, meeting point" className="pl-9" />
            </label>
            <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={cityFilter} onChange={(event) => setCityFilter(event.target.value)}>
              <option>All</option>
              <option>Ho Chi Minh City</option>
              <option>Ha Long</option>
            </select>
            <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={timeFilter} onChange={(event) => setTimeFilter(event.target.value)}>
              <option>All</option>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
            </select>
            <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={languageFilter} onChange={(event) => setLanguageFilter(event.target.value)}>
              <option>All</option>
              <option>English</option>
              <option>Vietnamese</option>
            </select>
            <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={budgetFilter} onChange={(event) => setBudgetFilter(event.target.value)}>
              <option>All</option>
              <option>Budget</option>
              <option>Mid</option>
              <option>Premium</option>
            </select>
          </div>
        </Card>

        <div className="mt-6 grid gap-5">
          {filteredRequests.map((request) => {
            const applied = appliedIds.includes(request.id);

            return (
              <Card key={request.id} className="rounded-[28px] border border-border bg-card p-5 shadow-sm md:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="outline" className="rounded-full px-3 py-1">
                        {request.city}
                      </Badge>
                      <Badge variant="outline" className="rounded-full px-3 py-1">
                        {request.preferredLanguage}
                      </Badge>
                    </div>
                    <h2 className="mt-4 text-2xl font-semibold">{request.shortNotes}</h2>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>{formatTripRequestDateTime(request.startTime)}</span>
                      <span>{formatDurationMinutes(request.durationMinutes)}</span>
                      <span>{request.groupSize} pax</span>
                      <span>{formatBudgetRange(request.budgetMin, request.budgetMax)}</span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">{request.notes}</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-3">
                    <Button asChild variant="outline" className="rounded-full px-5">
                      <Link href={`/buddy-requests/${request.id}`}>View detail</Link>
                    </Button>
                    <Button
                      className="rounded-full px-5"
                      variant={applied ? "outline" : "default"}
                      disabled={applied}
                      onClick={() => {
                        applyToBuddyRequest(request.id);
                        setAppliedIds(getBuddyAppliedRequestIds());
                      }}
                    >
                      {applied ? "Applied" : "Apply"}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
