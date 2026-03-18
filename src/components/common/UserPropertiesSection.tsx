'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  Bookmark,
  Building2,
  CalendarDays,
  CheckCircle,
  Clock,
  Heart,
  Star,
  X,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

type PropertyStatus = 'Available' | 'Rented' | 'Sold' | 'Inactive';
type TransactionType = 'ForRent' | 'ForSale';
type DateFilterMode = 'All' | 'Today' | 'ThisWeek' | 'ThisMonth' | 'Custom';
type SortBy = 'createdAt' | 'title' | 'status' | 'price';
type SortOrder = 'asc' | 'desc';

type Property = {
  id: string;
  title: string;
  status: PropertyStatus;
  transactionType: TransactionType;
  rentalPrice: number;
  salePrice: number;
  type: string;
  collectedCount: number;
  totalFavorites: number;
  createdAt: string;
};

const MOCK_PROPERTIES: Property[] = [
  {
    id: 'p-01',
    title: '2-bedroom apartment in District 7',
    status: 'Available',
    transactionType: 'ForRent',
    rentalPrice: 14500000,
    salePrice: 0,
    type: 'Apartment',
    collectedCount: 18,
    totalFavorites: 27,
    createdAt: '2026-03-14T08:20:00.000Z',
  },
  {
    id: 'p-02',
    title: 'Townhouse in Thu Duc',
    status: 'Rented',
    transactionType: 'ForRent',
    rentalPrice: 28000000,
    salePrice: 0,
    type: 'Townhouse',
    collectedCount: 11,
    totalFavorites: 21,
    createdAt: '2026-03-10T03:35:00.000Z',
  },
  {
    id: 'p-03',
    title: 'Riverside villa in District 2',
    status: 'Sold',
    transactionType: 'ForSale',
    rentalPrice: 0,
    salePrice: 19500000000,
    type: 'Villa',
    collectedCount: 34,
    totalFavorites: 56,
    createdAt: '2026-02-28T10:10:00.000Z',
  },
  {
    id: 'p-04',
    title: 'Land plot in Long An',
    status: 'Inactive',
    transactionType: 'ForSale',
    rentalPrice: 0,
    salePrice: 2300000000,
    type: 'Land',
    collectedCount: 5,
    totalFavorites: 9,
    createdAt: '2026-01-21T12:45:00.000Z',
  },
  {
    id: 'p-05',
    title: 'Studio in Phu Nhuan',
    status: 'Available',
    transactionType: 'ForRent',
    rentalPrice: 9200000,
    salePrice: 0,
    type: 'Studio',
    collectedCount: 14,
    totalFavorites: 31,
    createdAt: '2026-03-16T01:00:00.000Z',
  },
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

function formatDateForButton(date?: Date) {
  if (!date) return '';

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

function UserPropertiesError({ message }: { message: string }) {
  return (
    <Card className="border-0 bg-white/50 shadow-sm backdrop-blur-sm">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">Unable to load properties</h3>
            <p className="max-w-md text-sm text-muted-foreground">{message}</p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: PropertyStatus }) {
  const config = {
    Available: {
      label: 'Available',
      className: 'border-green-200 bg-green-100 text-green-800',
      icon: <CheckCircle className="h-3 w-3" />,
    },
    Rented: {
      label: 'Rented',
      className: 'border-blue-200 bg-blue-100 text-blue-800',
      icon: <Clock className="h-3 w-3" />,
    },
    Sold: {
      label: 'Sold',
      className: 'border-yellow-200 bg-yellow-100 text-yellow-800',
      icon: <Star className="h-3 w-3" />,
    },
    Inactive: {
      label: 'Inactive',
      className: 'border-red-200 bg-red-100 text-red-800',
      icon: <XCircle className="h-3 w-3" />,
    },
  }[status];

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      {config.icon}
      {config.label}
    </div>
  );
}

function getDateRange(mode: DateFilterMode, startDate?: Date, endDate?: Date) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (mode) {
    case 'Today':
      return { start: today, end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1) };
    case 'ThisWeek': {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
      return { start: startOfWeek, end: endOfWeek };
    }
    case 'ThisMonth': {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      return { start: startOfMonth, end: endOfMonth };
    }
    case 'Custom': {
      if (!startDate || !endDate) return { start: undefined, end: undefined };
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      return { start: startDate, end: endOfDay };
    }
    default:
      return { start: undefined, end: undefined };
  }
}

export function UserPropertiesSection() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [dateFilterMode, setDateFilterMode] = useState<DateFilterMode>('All');
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const pageSize = 10;

  const properties = MOCK_PROPERTIES;
  const isLoading = false;
  const error = null;

  const clearDateFilter = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setDateFilterMode('All');
    setCurrentPage(1);
  };

  const applyDateFilter = (mode: DateFilterMode) => {
    if (mode === 'Custom') {
      if (!startDate || !endDate) {
        toast.error('Select both a start date and an end date.');
        return;
      }

      if (startDate > endDate) {
        toast.error('The start date cannot be after the end date.');
        return;
      }

      const { start, end } = getDateRange('Custom', startDate, endDate);
      if (start && end) {
        const hasPropertiesInRange = properties.some((property) => {
          const propertyDate = new Date(property.createdAt);
          return propertyDate >= start && propertyDate <= end;
        });

        if (!hasPropertiesInRange) {
          toast.warning('No properties were found in the selected date range.');
          return;
        }
      }
    }

    setDateFilterMode(mode);
    setCurrentPage(1);

    const label =
      mode === 'Today'
        ? 'Today'
        : mode === 'ThisWeek'
          ? 'This week'
          : mode === 'ThisMonth'
            ? 'This month'
            : mode === 'Custom'
              ? 'Custom range'
              : 'All time';

    toast.success(`Applied filter: ${label}`);
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      if (dateFilterMode === 'All') return true;

      const { start, end } = getDateRange(dateFilterMode, startDate, endDate);
      if (!start || !end) return true;

      const propertyDate = new Date(property.createdAt);
      if (Number.isNaN(propertyDate.getTime())) return true;

      return propertyDate >= start && propertyDate <= end;
    });
  }, [dateFilterMode, endDate, properties, startDate]);

  const sortedProperties = useMemo(() => {
    return [...filteredProperties].sort((a, b) => {
      let aValue: number | string = '';
      let bValue: number | string = '';

      switch (sortBy) {
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'price':
          aValue = a.transactionType === 'ForRent' ? a.rentalPrice : a.salePrice;
          bValue = b.transactionType === 'ForRent' ? b.rentalPrice : b.salePrice;
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }

      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    });
  }, [filteredProperties, sortBy, sortOrder]);

  const totalCount = sortedProperties.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProperties = sortedProperties.slice(startIndex, startIndex + pageSize);

  const handleSort = (column: SortBy) => {
    if (sortBy === column) {
      setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  if (isLoading) {
    return null;
  }

  if (error) {
    return <UserPropertiesError message="Please try again in a moment." />;
  }

  if (totalCount === 0) {
    if (dateFilterMode !== 'All') {
      return (
        <Card className="border-0 bg-white/50 shadow-sm backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <Building2 className="h-8 w-8 text-orange-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">No properties found</h3>
                <p className="max-w-md text-sm text-muted-foreground">
                  No properties matched the active date filter. Try a different range or clear the
                  filter.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="border-0 bg-white/50 shadow-sm backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">No properties yet</h3>
              <p className="max-w-md text-sm text-muted-foreground">
                You have not created any property listings yet. Start by publishing your first
                listing.
              </p>
            </div>
            <Button onClick={() => router.push('/hosting/property/new')}>
              <Building2 className="mr-2 h-4 w-4" />
              Create your first listing
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-white/50 shadow-sm backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Filter by date:</span>

              <div className="flex gap-2">
                <Button
                  variant={dateFilterMode === 'All' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => applyDateFilter('All')}
                >
                  All time
                </Button>
                <Button
                  variant={dateFilterMode === 'Today' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => applyDateFilter('Today')}
                >
                  Today
                </Button>
                <Button
                  variant={dateFilterMode === 'ThisWeek' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => applyDateFilter('ThisWeek')}
                >
                  This week
                </Button>
                <Button
                  variant={dateFilterMode === 'ThisMonth' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => applyDateFilter('ThisMonth')}
                >
                  This month
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={dateFilterMode === 'Custom' ? 'default' : 'outline'}
                      size="sm"
                      className={cn(
                        'justify-start text-left font-normal',
                        !startDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {startDate ? formatDateForButton(startDate) : 'From date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>

                <span className="text-muted-foreground">-</span>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={dateFilterMode === 'Custom' ? 'default' : 'outline'}
                      size="sm"
                      className={cn(
                        'justify-start text-left font-normal',
                        !endDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {endDate ? formatDateForButton(endDate) : 'To date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyDateFilter('Custom')}
                  disabled={!startDate || !endDate}
                >
                  Apply
                </Button>
              </div>

              {dateFilterMode !== 'All' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearDateFilter}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="mr-1 h-4 w-4" />
                  Clear filter
                </Button>
              )}
            </div>

            {dateFilterMode !== 'All' && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Active filter:</span>
                <Badge variant="secondary" className="gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {dateFilterMode === 'Today' && 'Today'}
                  {dateFilterMode === 'ThisWeek' && 'This week'}
                  {dateFilterMode === 'ThisMonth' && 'This month'}
                  {dateFilterMode === 'Custom' &&
                    `${formatDateForButton(startDate)} to ${formatDateForButton(endDate)}`}
                </Badge>
              </div>
            )}

            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort('title')}>
                      <div className="flex items-center gap-1">
                        Property
                        {sortBy === 'title' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort('status')}>
                      <div className="flex items-center gap-1">
                        Status
                        {sortBy === 'status' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort('price')}>
                      <div className="flex items-center gap-1">
                        Price
                        {sortBy === 'price' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-center">Saves</TableHead>
                    <TableHead className="text-center">Likes</TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center gap-1">
                        Created
                        {sortBy === 'createdAt' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{property.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {property.transactionType === 'ForRent' ? 'For rent' : 'For sale'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={property.status} />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatCurrency(
                            property.transactionType === 'ForRent'
                              ? property.rentalPrice
                              : property.salePrice,
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {property.transactionType === 'ForRent' ? 'Rental price' : 'Sale price'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{property.type}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Bookmark className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{property.collectedCount}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Heart className="h-4 w-4 text-red-600" />
                          <span className="font-medium">{property.totalFavorites}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(property.createdAt)}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing {startIndex + 1} to {Math.min(startIndex + pageSize, totalCount)} of {totalCount}{' '}
                properties
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
