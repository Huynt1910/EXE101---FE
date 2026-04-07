'use client';

import { memo, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  CheckCircle,
  Clock,
  MapPin,
  Star,
  Target,
  TrendingUpIcon,
  Trophy,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
  useBuddyMeQuery,
  useMyBuddyBookingsQuery,
  useMyTripRequestsQuery,
} from '@/features/buddy/hooks/useBuddy';
import type { BuddyBooking, MyTripRequest } from '@/features/buddy/type';

// ─── Helpers ─────────────────────────────────────────────────────────────────

type DateFilterMode = 'All' | 'Today' | 'ThisWeek' | 'ThisMonth' | 'Custom';
type SortBy = 'bookedDate' | 'travelerName' | 'status' | 'totalAmount';
type SortOrder = 'asc' | 'desc';

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(dateStr),
  );
}

function formatDateBtn(date?: Date) {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

function getDateRange(mode: DateFilterMode, startDate?: Date, endDate?: Date) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  switch (mode) {
    case 'Today':
      return { start: today, end: new Date(today.getTime() + 86400000 - 1) };
    case 'ThisWeek': {
      const s = new Date(today); s.setDate(today.getDate() - today.getDay());
      return { start: s, end: new Date(s.getTime() + 7 * 86400000 - 1) };
    }
    case 'ThisMonth':
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
      };
    case 'Custom': {
      if (!startDate || !endDate) return { start: undefined, end: undefined };
      const e = new Date(endDate); e.setHours(23, 59, 59, 999);
      return { start: startDate, end: e };
    }
    default:
      return { start: undefined, end: undefined };
  }
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-400 space-y-6 px-4 py-6 sm:px-6">
      <div>
        <Skeleton className="h-8 w-64 sm:h-10 sm:w-80" />
        <Skeleton className="mt-2 h-4 w-48" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-2 bg-white/50 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="mt-2 h-9 w-20" />
              <Skeleton className="mt-2 h-4 w-32" />
            </CardHeader>
            <CardContent className="pt-0"><Skeleton className="h-4 w-28" /></CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-2 bg-white/50 shadow-sm">
        <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-8">
            <Skeleton className="h-56 w-56 rounded-full sm:h-64 sm:w-64" />
            <div className="w-full max-w-sm space-y-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-12" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 bg-white/50 shadow-sm">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── 4 Metric Cards ───────────────────────────────────────────────────────────

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  badge?: { text: string; icon?: React.ReactNode };
  footer?: string;
  footerIcon?: React.ReactNode;
}

function MetricCard({ title, value, description, icon, badge, footer, footerIcon }: MetricCardProps) {
  return (
    <Card className="border-2 bg-white/50 shadow-sm backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-end justify-between">
          <CardDescription className="text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <div>{icon}</div>
              <Badge className="bg-accent text-xs font-medium text-accent-foreground hover:bg-accent/80">
                {title}
              </Badge>
            </div>
          </CardDescription>
          {badge && (
            <Badge className="bg-accent text-xs font-medium text-accent-foreground hover:bg-accent/80">
              {badge.icon && <span className="mr-1">{badge.icon}</span>}
              {badge.text}
            </Badge>
          )}
        </div>
        <CardTitle className="text-3xl font-bold tracking-tight">{value}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      {footer && (
        <CardContent className="pt-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {footerIcon && <span>{footerIcon}</span>}
            <span className="font-medium">{footer}</span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function BuddySectionCards({
  bookings,
  requests,
  rating,
}: {
  bookings: BuddyBooking[];
  requests: MyTripRequest[];
  rating: number;
}) {
  const activeOffers = requests.filter((r) => !r.isExpired).length;
  const confirmed = bookings.filter((b) => b.status === 'Confirmed').length;
  const completed = bookings.filter((b) => b.status === 'Completed').length;
  const totalBookings = bookings.length;

  const completionRate = totalBookings > 0 ? (completed / totalBookings) * 100 : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Active Offers"
        value={activeOffers}
        icon={<Target className="h-5 w-5 text-red-500" />}
        badge={{ text: `Total: ${requests.length}`, icon: <TrendingUpIcon className="h-3 w-3" /> }}
        footer={`Expired: ${requests.length - activeOffers}`}
        footerIcon={<TrendingUpIcon className="h-4 w-4" />}
      />
      <MetricCard
        title="Confirmed Bookings"
        value={confirmed}
        icon={<CheckCircle className="h-5 w-5 text-amber-600" />}
        footer={`Total bookings: ${totalBookings}`}
        footerIcon={<TrendingUpIcon className="h-4 w-4" />}
      />
      <MetricCard
        title="Completed"
        value={completed}
        icon={<Trophy className="h-5 w-5 text-emerald-600" />}
        badge={{ text: `${completionRate.toFixed(1)}%`, icon: <TrendingUpIcon className="h-3 w-3" /> }}
        footer={`Pending payment: ${bookings.filter((b) => b.status === 'PendingPayment').length}`}
      />
      <MetricCard
        title="Your Rating"
        value={rating > 0 ? `${rating.toFixed(1)}★` : '—'}
        icon={<Star className="h-5 w-5 text-purple-600" />}
        badge={
          rating > 0
            ? { text: 'Active', icon: <TrendingUpIcon className="h-3 w-3" /> }
            : undefined
        }
        footer={rating > 0 ? 'Avg. traveler rating' : 'No ratings yet'}
      />
    </div>
  );
}

// ─── Activity Donut Chart ─────────────────────────────────────────────────────

const CHART_SEGMENTS = [
  { key: 'activeOffers',   label: 'Active Offers',   color: '#3b82f6' },
  { key: 'confirmed',      label: 'Confirmed',        color: '#f59e0b' },
  { key: 'completed',      label: 'Completed',        color: '#8b5cf6' },
  { key: 'pendingPayment', label: 'Pending Payment',  color: '#10b981' },
  { key: 'cancelled',      label: 'Cancelled',        color: '#ef4444' },
] as const;

type SegmentKey = (typeof CHART_SEGMENTS)[number]['key'];

const MetricLegend = memo(({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <div className="h-4 w-4 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
    <span className="text-lg font-bold">{value}</span>
  </div>
));
MetricLegend.displayName = 'MetricLegend';

function BuddyActivityChart({ bookings, requests }: { bookings: BuddyBooking[]; requests: MyTripRequest[] }) {
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | undefined>(undefined);

  const counts: Record<SegmentKey, number> = {
    activeOffers:   requests.filter((r) => !r.isExpired).length,
    confirmed:      bookings.filter((b) => b.status === 'Confirmed').length,
    completed:      bookings.filter((b) => b.status === 'Completed').length,
    pendingPayment: bookings.filter((b) => b.status === 'PendingPayment').length,
    cancelled:      bookings.filter((b) => b.status === 'Cancelled').length,
  };

  const chartData = CHART_SEGMENTS.map((s) => ({ ...s, value: counts[s.key] }));
  const total = chartData.reduce((sum, d) => sum + d.value, 0);
  const hasData = total > 0;
  const displayData = hasData
    ? chartData.filter((d) => d.value > 0)
    : chartData.map((d) => ({ ...d, value: 1 }));

  const chartConfig = Object.fromEntries(CHART_SEGMENTS.map((s) => [s.key, { label: s.label, color: s.color }]));

  return (
    <Card className="border-2 bg-white/50 shadow-sm backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Activity overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:gap-8">
          {/* Donut */}
          <div className="relative h-56 w-56 shrink-0 sm:h-64 sm:w-64">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  {hasData && (
                    <ChartTooltip
                      content={<ChartTooltipContent hideLabel />}
                      offset={12}
                      allowEscapeViewBox={{ x: true, y: true }}
                      position={tooltipPos}
                      wrapperStyle={{ pointerEvents: 'none' }}
                    />
                  )}
                  <Pie
                    data={displayData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    onMouseMove={(data) => {
                      const d = data as { cx?: number; cy?: number; midAngle?: number; outerRadius?: number };
                      if (typeof d.cx === 'number' && typeof d.cy === 'number' && typeof d.midAngle === 'number' && typeof d.outerRadius === 'number') {
                        const rad = Math.PI / 180;
                        const r = d.outerRadius + 20;
                        setTooltipPos({ x: d.cx + r * Math.cos(-d.midAngle * rad), y: d.cy + r * Math.sin(-d.midAngle * rad) });
                      }
                    }}
                    onMouseLeave={() => setTooltipPos(undefined)}
                  >
                    {displayData.map((entry, i) => (
                      <Cell key={i} fill={hasData ? entry.color : `${entry.color}60`} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="pointer-events-none absolute inset-0 z-[-999] flex flex-col items-center justify-center">
              <div className="text-4xl font-bold">{total}</div>
              <div className="text-sm text-muted-foreground">Total activity</div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex w-full min-w-50 flex-col gap-4 sm:gap-6 lg:w-auto">
            {chartData.map((item) => (
              <MetricLegend key={item.key} label={item.label} value={item.value} color={item.color} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Bookings Table ───────────────────────────────────────────────────────────

function BookingStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    Confirmed:      { label: 'Confirmed',      className: 'border-green-200 bg-green-100 text-green-800',   icon: <CheckCircle className="h-3 w-3" /> },
    PendingPayment: { label: 'Pending Payment', className: 'border-amber-200 bg-amber-100 text-amber-800',  icon: <Clock className="h-3 w-3" /> },
    Completed:      { label: 'Completed',       className: 'border-blue-200 bg-blue-100 text-blue-800',     icon: <Trophy className="h-3 w-3" /> },
    Cancelled:      { label: 'Cancelled',       className: 'border-red-200 bg-red-100 text-red-800',        icon: <XCircle className="h-3 w-3" /> },
    InProgress:     { label: 'In Progress',     className: 'border-purple-200 bg-purple-100 text-purple-800', icon: <Clock className="h-3 w-3" /> },
  };
  const config = map[status] ?? { label: status, className: 'border-gray-200 bg-gray-100 text-gray-700', icon: null };
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.className}`}>
      {config.icon}
      {config.label}
    </div>
  );
}

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: currency === 'VND' ? 0 : 2,
  }).format(amount);
}

function BuddyBookingsTable({ bookings }: { bookings: BuddyBooking[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilterMode, setDateFilterMode] = useState<DateFilterMode>('All');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [sortBy, setSortBy] = useState<SortBy>('bookedDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const pageSize = 10;

  const clearFilter = () => {
    setStartDate(undefined); setEndDate(undefined); setDateFilterMode('All'); setCurrentPage(1);
  };

  const applyFilter = (mode: DateFilterMode) => {
    setDateFilterMode(mode); setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (dateFilterMode === 'All') return true;
      const { start, end } = getDateRange(dateFilterMode, startDate, endDate);
      if (!start || !end) return true;
      const d = new Date(b.bookedDate);
      return d >= start && d <= end;
    });
  }, [bookings, dateFilterMode, startDate, endDate]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av: string | number = '';
      let bv: string | number = '';
      if (sortBy === 'bookedDate')    { av = new Date(a.bookedDate).getTime(); bv = new Date(b.bookedDate).getTime(); }
      if (sortBy === 'travelerName')  { av = a.travelerName.toLowerCase(); bv = b.travelerName.toLowerCase(); }
      if (sortBy === 'status')        { av = a.status; bv = b.status; }
      if (sortBy === 'totalAmount')   { av = a.totalAmount; bv = b.totalAmount; }
      if (sortOrder === 'asc') return av > bv ? 1 : av < bv ? -1 : 0;
      return av < bv ? 1 : av > bv ? -1 : 0;
    });
  }, [filtered, sortBy, sortOrder]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIdx = (currentPage - 1) * pageSize;
  const paged = sorted.slice(startIdx, startIdx + pageSize);

  const handleSort = (col: SortBy) => {
    if (sortBy === col) setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(col); setSortOrder('desc'); }
    setCurrentPage(1);
  };

  if (total === 0 && dateFilterMode === 'All') {
    return (
      <Card className="border-0 bg-white/50 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <MapPin className="mb-3 h-12 w-12 text-muted-foreground/40" />
          <h3 className="text-lg font-semibold">No bookings yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Bookings from travelers will appear here.
          </p>
          <Button asChild className="mt-4 bg-red-500 hover:bg-red-600">
            <Link href="/buddy/trip-requests">Browse trip requests</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-white/50 shadow-sm backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Date filters */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Filter by date:</span>
            <div className="flex gap-2">
              {(['All', 'Today', 'ThisWeek', 'ThisMonth'] as DateFilterMode[]).map((m) => (
                <Button
                  key={m}
                  variant={dateFilterMode === m ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => applyFilter(m)}
                >
                  {m === 'All' ? 'All time' : m === 'ThisWeek' ? 'This week' : m === 'ThisMonth' ? 'This month' : m}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={dateFilterMode === 'Custom' ? 'default' : 'outline'}
                    size="sm"
                    className={cn('justify-start text-left font-normal', !startDate && 'text-muted-foreground')}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {startDate ? formatDateBtn(startDate) : 'From date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} />
                </PopoverContent>
              </Popover>
              <span className="text-muted-foreground">-</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={dateFilterMode === 'Custom' ? 'default' : 'outline'}
                    size="sm"
                    className={cn('justify-start text-left font-normal', !endDate && 'text-muted-foreground')}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {endDate ? formatDateBtn(endDate) : 'To date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} />
                </PopoverContent>
              </Popover>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyFilter('Custom')}
                disabled={!startDate || !endDate}
              >
                Apply
              </Button>
            </div>
            {dateFilterMode !== 'All' && (
              <Button variant="ghost" size="sm" onClick={clearFilter} className="text-red-600 hover:text-red-700">
                <X className="mr-1 h-4 w-4" /> Clear filter
              </Button>
            )}
          </div>

          {/* Active filter badge */}
          {dateFilterMode !== 'All' && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filter:</span>
              <Badge variant="secondary" className="gap-1">
                <CalendarDays className="h-3 w-3" />
                {dateFilterMode === 'Today' && 'Today'}
                {dateFilterMode === 'ThisWeek' && 'This week'}
                {dateFilterMode === 'ThisMonth' && 'This month'}
                {dateFilterMode === 'Custom' && `${formatDateBtn(startDate)} → ${formatDateBtn(endDate)}`}
              </Badge>
            </div>
          )}

          {/* Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort('travelerName')}>
                    <div className="flex items-center gap-1">
                      Traveler {sortBy === 'travelerName' && <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort('bookedDate')}>
                    <div className="flex items-center gap-1">
                      Date {sortBy === 'bookedDate' && <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                    </div>
                  </TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1"><Users className="h-3.5 w-3.5" /> People</div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort('totalAmount')}>
                    <div className="flex items-center gap-1">
                      Amount {sortBy === 'totalAmount' && <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort('status')}>
                    <div className="flex items-center gap-1">
                      Status {sortBy === 'status' && <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      No bookings found for this filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  paged.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell>
                        <div className="font-medium">{b.travelerName}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(b.bookedDate)}</div>
                        <div className="text-xs text-muted-foreground">{b.bookedStartTime.slice(0, 5)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          {b.bookedDurationHours}h
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          {b.bookedAdults + b.bookedChildren}
                          {b.bookedChildren > 0 && (
                            <span className="text-xs text-muted-foreground">({b.bookedChildren}C)</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{formatAmount(b.totalAmount, b.currency)}</div>
                      </TableCell>
                      <TableCell>
                        <BookingStatusBadge status={b.status} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>Showing {startIdx + 1} to {Math.min(startIdx + pageSize, total)} of {total} bookings</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                Previous
              </Button>
              <span>Page {currentPage} of {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BuddyOverviewPage() {
  const { data: meData, isLoading: meLoading, isError: meError } = useBuddyMeQuery();
  const { data: bookingsData, isLoading: bookingsLoading, isError: bookingsError } = useMyBuddyBookingsQuery();
  const { data: requestsData, isLoading: requestsLoading } = useMyTripRequestsQuery();

  const isLoading = meLoading || bookingsLoading || requestsLoading;
  const isError = meError || bookingsError;

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <div className="mx-auto max-w-400 px-4 py-6 sm:px-6">
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertDescription>Unable to load dashboard. Please check your connection and try again.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const me = meData?.data;
  const bookings: BuddyBooking[] = bookingsData?.data ?? [];
  const requests: MyTripRequest[] = requestsData?.data ?? [];
  const activeOffers = requests.filter((r) => !r.isExpired).length;

  return (
    <div className="flex h-full flex-col">
      <main className="flex-1 w-full overflow-auto px-4 py-4 scrollbar-hide sm:px-6 sm:py-6 pb-24 md:pb-6 bg-[#f2f2f2]">
        <div className="mx-auto max-w-400 space-y-6 sm:space-y-8">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold tracking-tight sm:text-xl lg:text-2xl">
                Welcome back, {me?.fullName ?? 'Buddy'}!
              </h1>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Manage all {activeOffers} of your active offers in one place.
              </p>
            </div>
          </div>

          {/* 4 metric cards */}
          <BuddySectionCards bookings={bookings} requests={requests} rating={me?.rate ?? 0} />

          {/* Donut chart */}
          <BuddyActivityChart bookings={bookings} requests={requests} />

          {/* Bookings table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold sm:text-lg">My Bookings</h2>
            </div>
            <BuddyBookingsTable bookings={bookings} />
          </div>

        </div>
      </main>
    </div>
  );
}
