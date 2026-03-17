"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function TripDetailBreadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-slate-500">
      <Link
        href="/buddy"
        className="hover:text-slate-800 transition-colors duration-150"
      >
        Buddy
      </Link>
      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
      <Link
        href="/buddy/trip-requests"
        className="hover:text-slate-800 transition-colors duration-150"
      >
        Trip Requests
      </Link>
      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
      <span className="text-slate-800 font-medium">Trip Detail</span>
    </nav>
  );
}
