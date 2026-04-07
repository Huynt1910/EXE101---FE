"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CalendarClock,
  CalendarCheck2,
  CircleCheckBig,
  CalendarX2,
  CreditCard,
  Play,
  TimerOff,
  Settings,
  Filter,
} from "lucide-react";
import { useMyBuddyBookingsQuery } from "@/features/buddy/hooks/useBuddy";
import type { BuddyBooking } from "@/features/buddy/type";
import { Calendar } from "@/components/ui/calendar";
import AppointmentDetail from "./AppointmentDetail";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Status config                                                      */
/* ------------------------------------------------------------------ */

const STATUS_FILTERS = [
  {
    key: "all",
    label: "All Appointments",
    description: "Show all appointments",
    icon: CalendarDays,
    color: "border-blue-500 bg-blue-500",
  },
  {
    key: "PendingCustomerConfirm",
    label: "Pending Confirmation",
    description: "Waiting for customer to confirm",
    icon: CalendarClock,
    color: "border-amber-500 bg-amber-500",
  },
  {
    key: "PendingPayment",
    label: "Pending Payment",
    description: "Confirmed, awaiting payment",
    icon: CreditCard,
    color: "border-orange-500 bg-orange-500",
  },
  {
    key: "Confirmed",
    label: "Paid",
    description: "Payment successful, awaiting trip date",
    icon: CalendarCheck2,
    color: "border-blue-600 bg-blue-600",
  },
  {
    key: "InProgress",
    label: "In Progress",
    description: "Tour is currently ongoing",
    icon: Play,
    color: "border-purple-500 bg-purple-500",
  },
  {
    key: "Completed",
    label: "Completed",
    description: "Tour has been completed",
    icon: CircleCheckBig,
    color: "border-green-500 bg-green-500",
  },
  {
    key: "Cancelled",
    label: "Cancelled",
    description: "Cancelled by either party",
    icon: CalendarX2,
    color: "border-red-500 bg-red-500",
  },
  {
    key: "Expired",
    label: "Expired",
    description: "Booking has expired",
    icon: TimerOff,
    color: "border-gray-500 bg-gray-500",
  },
] as const;

type StatusFilterKey = (typeof STATUS_FILTERS)[number]["key"];

const STATUS_DOT_MAP: Record<string, string> = {
  PendingCustomerConfirm: "bg-amber-500",
  PendingPayment: "bg-orange-500",
  Confirmed: "bg-blue-600",
  InProgress: "bg-purple-500",
  Completed: "bg-green-500",
  Cancelled: "bg-red-500",
  Expired: "bg-gray-500",
};

const LEGEND_ITEMS = [
  { label: "Pending", color: "bg-amber-500" },
  { label: "Awaiting Payment", color: "bg-orange-500" },
  { label: "Paid", color: "bg-blue-600" },
  { label: "In Progress", color: "bg-purple-500" },
  { label: "Completed", color: "bg-green-500" },
  { label: "Cancelled", color: "bg-red-500" },
  { label: "Expired", color: "bg-gray-500" },
];

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay(); // 0=Sun
  const totalDays = lastDay.getDate();

  const cells: { date: Date; isCurrentMonth: boolean }[] = [];

  // Previous month fill
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    cells.push({ date: d, isCurrentMonth: false });
  }

  // Current month
  for (let d = 1; d <= totalDays; d++) {
    cells.push({ date: new Date(year, month, d), isCurrentMonth: true });
  }

  // Next month fill
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      cells.push({ date: new Date(year, month + 1, d), isCurrentMonth: false });
    }
  }

  return cells;
}

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function bookingDateKey(bookedDate: string) {
  // bookedDate from API: "2026-04-08T00:00:00" or "2026-04-08"
  return bookedDate.slice(0, 10);
}

const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatMonthYear(year: number, month: number) {
  return `${MONTHS_EN[month]} ${year}`;
}

function isToday(d: Date) {
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function formatSafeCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "VND" ? 0 : 2,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString("en-US")} ${currency}`.trim();
  }
}

function toAmPm(totalMinutes: number) {
  const minutesInDay = 24 * 60;
  const normalized = ((totalMinutes % minutesInDay) + minutesInDay) % minutesInDay;
  const hour24 = Math.floor(normalized / 60);
  const minute = normalized % 60;
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;

  return `${String(hour12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`;
}

function formatBookingTimeRange(bookedStartTime?: string, bookedDurationHours?: number) {
  if (!bookedStartTime) return "--:--";

  const [rawHour, rawMinute] = bookedStartTime.split(":");
  const hour = Number(rawHour);
  const minute = Number(rawMinute);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return bookedStartTime.slice(0, 5);
  }

  const startMinutes = hour * 60 + minute;
  const durationMinutes = Math.round((bookedDurationHours ?? 0) * 60);
  const endMinutes = startMinutes + durationMinutes;

  return `${toAmPm(startMinutes)} > ${toAmPm(endMinutes)}`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function BuddyAppointmentPage() {
  const { data, isLoading } = useMyBuddyBookingsQuery();
  const bookings: BuddyBooking[] = data?.data ?? [];

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [statusFilter, setStatusFilter] = useState<StatusFilterKey>("all");
  const [viewMode, setViewMode] = useState<"month" | "day">("month");
  const [selectedBooking, setSelectedBooking] = useState<BuddyBooking | null>(null);
  const lastTapRef = useRef<{ key: string; time: number } | null>(null);

  // Group bookings by date
  const bookingsByDate = useMemo(() => {
    const map: Record<string, BuddyBooking[]> = {};
    for (const b of bookings) {
      const key = bookingDateKey(b.bookedDate);
      if (!map[key]) map[key] = [];
      map[key].push(b);
    }
    return map;
  }, [bookings]);

  // Filtered bookings
  const filteredByDate = useMemo(() => {
    const filtered =
      statusFilter === "all"
        ? bookings
        : bookings.filter((b) => b.status === statusFilter);

    const map: Record<string, BuddyBooking[]> = {};
    for (const b of filtered) {
      const key = bookingDateKey(b.bookedDate);
      if (!map[key]) map[key] = [];
      map[key].push(b);
    }
    return map;
  }, [bookings, statusFilter]);

  const totalFiltered = useMemo(() => {
    return Object.values(filteredByDate).reduce((sum, arr) => sum + arr.length, 0);
  }, [filteredByDate]);

  const grid = useMemo(
    () => getMonthGrid(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const prevMonth = useCallback(() => {
    setCurrentMonth((m) => {
      if (m === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);

  const nextMonth = useCallback(() => {
    setCurrentMonth((m) => {
      if (m === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, []);

  const goToToday = useCallback(() => {
    const now = new Date();
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
    setSelectedDate(now);
  }, []);

  const prevDay = useCallback(() => {
    setSelectedDate((d) => {
      const prev = new Date(d);
      prev.setDate(prev.getDate() - 1);
      setCurrentMonth(prev.getMonth());
      setCurrentYear(prev.getFullYear());
      return prev;
    });
  }, []);

  const nextDay = useCallback(() => {
    setSelectedDate((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      setCurrentMonth(next.getMonth());
      setCurrentYear(next.getFullYear());
      return next;
    });
  }, []);

  const HOURS = Array.from({ length: 24 }, (_, i) => toAmPm(i * 60));

  const dayBookingsForView = useMemo(() => {
    if (viewMode !== "day") return [];
    const key = dateKey(selectedDate);
    return filteredByDate[key] ?? [];
  }, [viewMode, selectedDate, filteredByDate]);

  const bookingsByHour = useMemo(() => {
    const map: Record<number, BuddyBooking[]> = {};
    for (const b of dayBookingsForView) {
      const hour = parseInt(b.bookedStartTime?.slice(0, 2) ?? "0", 10);
      if (!map[hour]) map[hour] = [];
      map[hour].push(b);
    }
    return map;
  }, [dayBookingsForView]);

  const handleMiniCalendarSelect = useCallback((date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    setCurrentMonth(date.getMonth());
    setCurrentYear(date.getFullYear());
  }, []);

  const handleMonthCellClick = useCallback((date: Date, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;

    setSelectedDate(date);

    // Mobile browsers often do not emit onDoubleClick reliably, so detect double-tap manually.
    const key = dateKey(date);
    const now = Date.now();
    const lastTap = lastTapRef.current;

    if (lastTap && lastTap.key === key && now - lastTap.time <= 400) {
      setViewMode("day");
      lastTapRef.current = null;
      return;
    }

    lastTapRef.current = { key, time: now };
  }, []);

  const closeBookingDetail = useCallback(() => {
    setSelectedBooking(null);
  }, []);

  return (
    <>
      <section className="h-[calc(100dvh-80px)] overflow-hidden bg-[#fffbf8] px-4 py-6 md:h-[calc(100dvh-112px)] md:px-8">
        <div className="mx-auto flex h-full w-full max-w-[1600px] gap-6">
          {/* ===================== LEFT SIDEBAR ===================== */}
          <aside className="hidden w-[260px] shrink-0 lg:flex">
            <div className="scrollbar-hover flex h-full w-full flex-col overflow-y-auto rounded-xl border border-[#f3d8c9] bg-white shadow-sm">
              {/* Mini calendar */}
              <div className="border-b border-[#f3d8c9] p-3">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleMiniCalendarSelect}
                  defaultMonth={new Date(currentYear, currentMonth)}
                  month={new Date(currentYear, currentMonth)}
                  onMonthChange={(d) => {
                    setCurrentMonth(d.getMonth());
                    setCurrentYear(d.getFullYear());
                  }}
                  locale={{
                    localize: {
                      day: (n: number) =>
                        ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][n],
                      month: (n: number) => MONTHS_EN[n],
                      ordinalNumber: (n: number) => String(n),
                      era: () => "",
                      quarter: () => "",
                      dayPeriod: () => "",
                    } as never,
                    formatLong: {
                      date: () => "dd/MM/yyyy",
                      time: () => "HH:mm",
                      dateTime: () => "dd/MM/yyyy HH:mm",
                    } as never,
                    match: {} as never,
                    options: { weekStartsOn: 1 as const },
                    code: "en",
                  }}
                  className="w-full"
                  classNames={{
                    month_caption: "flex items-center justify-center font-semibold text-sm py-1",
                    nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between",
                    button_previous: "rounded-lg p-1.5 hover:bg-gray-100 transition-colors inline-flex items-center justify-center",
                    button_next: "rounded-xl p-1.5 hover:bg-gray-100 transition-colors inline-flex items-center justify-center",
                    today: "rounded-full bg-red-500 text-white",
                    day: "group/day relative aspect-square h-full w-full p-0 text-center select-none [&_button]:rounded-full [&_button]:hover:rounded-full [&_button]:hover:bg-gray-100 [&_button]:hover:text-primary [&_button]:transition-all",
                    selected: "[&_button]:bg-primary [&_button]:!text-white [&_button]:rounded-full [&_button]:hover:bg-primary/90 [&_button]:hover:!text-white",
                  }}
                  components={{
                    Chevron: ({ orientation }) => {
                      if (orientation === "left") {
                        return <ChevronLeft className="h-5 w-5 text-gray-600" />;
                      }
                      return <ChevronRight className="h-5 w-5 text-gray-600" />;
                    },
                  }}
                />
              </div>

              {/* Status filter */}
              <div className="p-4">
                <h3 className="mb-3 text-sm font-semibold text-[#2a2a2a]">
                  Status Filter
                </h3>
                <div className="flex flex-col gap-2">
                  {STATUS_FILTERS.map((f) => {
                    const Icon = f.icon;
                    const isActive = statusFilter === f.key;
                    return (
                      <button
                        key={f.key}
                        type="button"
                        onClick={() => setStatusFilter(f.key)}
                        className={cn(
                          "flex items-start gap-3 rounded-lg border p-3 text-left transition-all",
                          isActive
                            ? "border-[#f3d8c9] bg-[#fffbf8] shadow-sm"
                            : "border-transparent hover:bg-gray-50"
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                            isActive ? f.color : "border-gray-300 bg-white"
                          )}
                        >
                          {isActive && (
                            <span className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <Icon className="h-3.5 w-3.5 text-gray-500" />
                            <span className="text-sm font-medium text-[#2a2a2a]">
                              {f.label}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-gray-400">
                            {f.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </aside>

          {/* ===================== MAIN CALENDAR ===================== */}
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-[#f3d8c9] bg-white shadow-sm">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
                {/* Nav */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={viewMode === "month" ? prevMonth : prevDay}
                    className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <h2 className="min-w-[180px] text-center text-lg font-semibold text-[#2a2a2a]">
                    {viewMode === "month"
                      ? formatMonthYear(currentYear, currentMonth)
                      : selectedDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                  </h2>
                  <button
                    type="button"
                    onClick={viewMode === "month" ? nextMonth : nextDay}
                    className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      goToToday();
                      if (viewMode === "day") setViewMode("month");
                    }}
                    className="ml-2 rounded-lg border border-orange-400 px-3 py-1 text-sm font-medium text-orange-500 hover:bg-orange-50 transition-colors"
                  >
                    Today
                  </button>
                </div>

                {/* Legend + actions */}
                <div className="hidden items-center gap-4 md:flex">
                  <span className="text-sm text-gray-500">
                    {totalFiltered} appointment{totalFiltered !== 1 ? "s" : ""}
                  </span>
                  {LEGEND_ITEMS.map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      <span
                        className={cn("h-2.5 w-2.5 rounded-full", item.color)}
                      />
                      <span className="text-xs text-gray-500">{item.label}</span>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="h-4.5 w-4.5 text-gray-400" />
                  </button>
                  <button
                    type="button"
                    className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
                  >
                    <Filter className="h-4.5 w-4.5 text-gray-400" />
                  </button>
                </div>
              </div>

              {viewMode === "month" ? (
                <div className="scrollbar-hover flex min-h-0 flex-1 flex-col overflow-y-auto">
                  {/* Weekday header */}
                  <div className="sticky top-0 z-10 grid grid-cols-7 border-b border-gray-100 bg-white">
                    {WEEKDAYS.map((day) => (
                      <div
                        key={day}
                        className="py-2 text-center text-[11px] font-medium text-gray-500 sm:py-3 sm:text-sm"
                      >
                        <span className="sm:hidden">{day.slice(0, 3)}</span>
                        <span className="hidden sm:inline">{day}</span>
                      </div>
                    ))}
                  </div>

                  {/* Calendar grid */}
                  {isLoading ? (
                    <div className="flex flex-1 items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-300 border-t-orange-600" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-7" style={{ gridAutoRows: "minmax(120px, 1fr)" }}>
                      {grid.map((cell, idx) => {
                        const key = dateKey(cell.date);
                        const dayBookings = filteredByDate[key] ?? [];
                        const isTodayCell = isToday(cell.date);
                        const isSelected =
                          selectedDate &&
                          dateKey(selectedDate) === key &&
                          cell.isCurrentMonth;

                        return (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => handleMonthCellClick(cell.date, cell.isCurrentMonth)}
                            onDoubleClick={() => {
                              if (cell.isCurrentMonth) {
                                setSelectedDate(cell.date);
                                setViewMode("day");
                              }
                            }}
                            className={cn(
                              "relative flex touch-manipulation flex-col border-b border-r border-gray-100 p-2 text-left transition-colors",
                              cell.isCurrentMonth
                                ? "bg-white hover:bg-gray-50"
                                : "bg-gray-50/50",
                              isSelected && "ring-2 ring-inset ring-orange-300"
                            )}
                          >
                            {/* Day number */}
                            <span
                              className={cn(
                                "inline-flex h-7 w-7 items-center justify-center rounded-md text-sm",
                                !cell.isCurrentMonth && "text-gray-300",
                                cell.isCurrentMonth && "text-[#2a2a2a]",
                                isTodayCell &&
                                  cell.isCurrentMonth &&
                                  "bg-red-500 font-semibold text-white",
                                isSelected &&
                                  !isTodayCell &&
                                  "bg-orange-100 font-semibold text-orange-700"
                              )}
                            >
                              {cell.date.getDate()}
                            </span>

                            {/* Booking dots / pills */}
                            {dayBookings.length > 0 && (
                              <div className="mt-1 flex flex-col gap-0.5">
                                {dayBookings.slice(0, 3).map((b) => (
                                  <div
                                    key={b.id}
                                    className={cn(
                                      "flex items-center gap-1 rounded px-1 py-0.5 text-[10px] leading-tight",
                                      STATUS_DOT_MAP[b.status]
                                        ? "bg-opacity-10"
                                        : ""
                                    )}
                                    title={`${b.travelerName} - ${b.statusName}`}
                                  >
                                    <span
                                      className={cn(
                                        "h-1.5 w-1.5 shrink-0 rounded-full",
                                        STATUS_DOT_MAP[b.status] ?? "bg-gray-400"
                                      )}
                                    />
                                    <span className="truncate text-gray-600">
                                      {b.travelerName || b.statusName}
                                    </span>
                                  </div>
                                ))}
                                {dayBookings.length > 3 && (
                                  <span className="px-1 text-[10px] text-gray-400">
                                    +{dayBookings.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* =============== DAY VIEW =============== */
                <>
                  {/* Day column header */}
                  <div className="border-b border-gray-100 py-3 text-center">
                    <span className="text-sm font-semibold uppercase text-gray-500">
                      {WEEKDAYS[selectedDate.getDay()].toUpperCase()}
                    </span>
                    <span className="mx-2 text-gray-300">&bull;</span>
                    <span className="text-sm text-gray-500">
                      {MONTHS_EN[selectedDate.getMonth()]} {selectedDate.getDate()}
                    </span>
                  </div>

                  {/* Hourly time slots 12:00 AM-11:00 PM */}
                  <div className="scrollbar-hover flex-1 overflow-y-auto">
                    {HOURS.map((hour, hourIdx) => {
                      const hourBookings = bookingsByHour[hourIdx] ?? [];
                      return (
                        <div
                          key={hour}
                          className="flex min-h-[72px] border-b border-gray-100"
                        >
                          {/* Time label */}
                          <div className="flex w-[80px] shrink-0 items-start justify-end pr-4 pt-2">
                            <span className="text-xs text-gray-400">{hour}</span>
                          </div>

                          {/* Slot content */}
                          <div className="relative flex-1 border-l border-gray-100 p-1">
                            {hourBookings.map((b) => (
                              <button
                                type="button"
                                key={b.id}
                                onClick={() => setSelectedBooking(b)}
                                className={cn(
                                  "mb-1 w-full rounded-lg border-l-[3px] px-3 py-2 text-left transition-colors hover:bg-gray-100",
                                  STATUS_DOT_MAP[b.status]
                                    ? STATUS_DOT_MAP[b.status].replace("bg-", "border-l-") + " bg-gray-50"
                                    : "border-l-gray-400 bg-gray-50"
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className={cn(
                                      "h-2 w-2 shrink-0 rounded-full",
                                      STATUS_DOT_MAP[b.status] ?? "bg-gray-400"
                                    )}
                                  />
                                  <span className="text-sm font-medium text-[#2a2a2a]">
                                    {b.travelerName}
                                  </span>
                                </div>
                                <p className="mt-1 pl-4 text-xs text-gray-500">
                                  {formatBookingTimeRange(
                                    b.bookedStartTime,
                                    b.bookedDurationHours
                                  )} &middot;{" "}
                                  {b.bookedAdults} adult{b.bookedAdults > 1 ? "s" : ""}
                                  {b.bookedChildren > 0 &&
                                    `, ${b.bookedChildren} child${b.bookedChildren > 1 ? "ren" : ""}`}
                                </p>
                                <div className="mt-1 flex items-center justify-between pl-4">
                                  <span className="text-xs font-semibold text-[#2a2a2a]">
                                    {formatSafeCurrency(b.totalAmount, b.currency)}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </section>

      <AppointmentDetail
        booking={selectedBooking}
        open={Boolean(selectedBooking)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            closeBookingDetail();
          }
        }}
        onClose={closeBookingDetail}
      />
    </>
  );
}
