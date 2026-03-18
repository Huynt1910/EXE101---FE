'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import {
  Heart,
  Bookmark,
  CheckCircle,
  Clock,
  Star,
  XCircle,
  AlertCircle,
  Building2,
  CalendarDays,
  X,
} from 'lucide-react';
// import { formatPrice } from '@/utils/numbers/formatCurrency';
// import { formatDate } from '@/utils/date/formatDate';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const MOCK_PROPERTIES = [
  {
    id: 'p-01',
    title: 'Căn hộ 2PN Quận 7',
    name: 'Căn hộ 2PN Quận 7',
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
    title: 'Nhà phố Thủ Đức',
    name: 'Nhà phố Thủ Đức',
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
    title: 'Biệt thự ven sông Quận 2',
    name: 'Biệt thự ven sông Quận 2',
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
    title: 'Đất nền Long An',
    name: 'Đất nền Long An',
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
    title: 'Studio Phú Nhuận',
    name: 'Studio Phú Nhuận',
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

// Skeleton component cho loading state
function UserPropertiesSkeleton() {
  return (
    <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header skeleton */}
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Table skeleton */}
          <div className="border rounded-lg">
            <div className="p-4">
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Error State Component
function UserPropertiesError({ message }: { message: string }) {
  return (
    <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">Không thể tải dữ liệu</h3>
            <p className="text-sm text-muted-foreground max-w-md">{message}</p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
            Thử lại
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// StatusBadge component với các trạng thái mới
function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Available':
        return {
          label: 'Có sẵn',
          className: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="h-3 w-3" />,
        };
      case 'Rented':
        return {
          label: 'Đã thuê',
          className: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <Clock className="h-3 w-3" />,
        };
      case 'Sold':
        return {
          label: 'Đã bán',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Star className="h-3 w-3" />,
        };
      case 'Inactive':
        return {
          label: 'Không hoạt động',
          className: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle className="h-3 w-3" />,
        };
      default:
        return {
          label: 'Không xác định',
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <AlertCircle className="h-3 w-3" />,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.icon}
      {config.label}
    </div>
  );
}

// Main Component
export function UserPropertiesSection() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [statusFilter] = useState<'All' | 'Available' | 'Rented' | 'Sold' | 'Inactive'>('All');
  const [searchQuery] = useState('');

  // Date filtering state
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [dateFilterMode, setDateFilterMode] = useState<
    'All' | 'Today' | 'ThisWeek' | 'ThisMonth' | 'Custom'
  >('All');

  // Sorting state
  const [sortBy, setSortBy] = useState<'createdAt' | 'title' | 'status' | 'price'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const salersStatistic = { data: MOCK_PROPERTIES };
  const isLoading = false;
  const error = null;
  // Xử lý loading state
  if (isLoading && !salersStatistic) {
    return <UserPropertiesSkeleton />;
  }

  // Xử lý error state
//   if (error) {
//     return (
//       <UserPropertiesError
//         message={error?.message || 'Đã xảy ra lỗi khi tải dữ liệu bất động sản.'}
//       />
//     );
//   }

  // Lấy data từ API response
  const properties = salersStatistic?.data || [];

  // Date filtering helper functions
  const getDateRange = (mode: typeof dateFilterMode) => {
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
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
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
  };

  const clearDateFilter = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setDateFilterMode('All');
    setCurrentPage(1); // Reset về trang đầu
  };

  const applyDateFilter = (mode: typeof dateFilterMode) => {
    if (mode === 'Custom') {
      if (!startDate || !endDate) {
        toast.error('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc');
        return;
      }

      // Kiểm tra ngày hợp lệ
      if (startDate > endDate) {
        toast.error('Ngày bắt đầu không thể sau ngày kết thúc');
        return;
      }

      // Kiểm tra xem có properties nào trong khoảng thời gian này không
      const { start, end } = getDateRange('Custom');
      if (start && end) {
        const hasPropertiesInRange = properties.some(property => {
          const propertyDate = new Date(property.createdAt);
          return propertyDate >= start && propertyDate <= end;
        });

        if (!hasPropertiesInRange) {
          toast.warning('Không có bất động sản nào trong khoảng thời gian đã chọn');
          return;
        }
      }
    }

    setDateFilterMode(mode);
    setCurrentPage(1); // Reset về trang đầu khi filter
    toast.success(
      `Đã áp dụng bộ lọc: ${mode === 'Today' ? 'Hôm nay' : mode === 'ThisWeek' ? 'Tuần này' : mode === 'ThisMonth' ? 'Tháng này' : 'Khoảng thời gian tùy chỉnh'}`
    );
  };

  // Sort properties function
  const sortProperties = (properties: any[]) => {
    return [...properties].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'title':
          aValue = (a.title || a.name || '').toLowerCase();
          bValue = (b.title || b.name || '').toLowerCase();
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        case 'price':
          aValue = a.transactionType === 'ForRent' ? a.rentalPrice || 0 : a.salePrice || 0;
          bValue = b.transactionType === 'ForRent' ? b.rentalPrice || 0 : b.salePrice || 0;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  };

  // Handle sort column click
  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Filter properties based on search, status, and date
  const filteredProperties = properties.filter(property => {
    const matchesSearch =
      !searchQuery ||
      (property.title && property.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (property.name && property.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || property.status === statusFilter;

    // Date filtering - ít strict hơn
    let matchesDate = true;
    if (dateFilterMode !== 'All') {
      const { start, end } = getDateRange(dateFilterMode);
      if (start && end) {
        try {
          const propertyDate = new Date(property.createdAt);
          // Kiểm tra xem propertyDate có hợp lệ không
          if (!isNaN(propertyDate.getTime())) {
            matchesDate = propertyDate >= start && propertyDate <= end;
          } else {
            // Nếu không parse được date, bỏ qua date filter
            matchesDate = true;
          }
        } catch (error) {
          // Nếu có lỗi, bỏ qua date filter
          matchesDate = true;
        }
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Sort the filtered properties
  const sortedProperties = sortProperties(filteredProperties);

  // Pagination
  const totalCount = sortedProperties.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProperties = sortedProperties.slice(startIndex, endIndex);

  // Empty state
  if (totalCount === 0) {
    if (searchQuery || statusFilter !== 'All' || dateFilterMode !== 'All') {
      // Có filter nhưng không có kết quả
      return (
        <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-orange-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  Không tìm thấy bất động sản
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Không có bất động sản nào thỏa mãn bộ lọc hiện tại. Hãy thử thay đổi bộ lọc hoặc
                  xem tất cả bất động sản.
                </p>
              </div>
              <div className="flex gap-2"></div>
            </div>
          </CardContent>
        </Card>
      );
    } else {
      // Không có properties nào cả
      return (
        <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-gray-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">Chưa có bất động sản nào</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Bạn chưa đăng ký bất động sản nào. Hãy bắt đầu bằng cách tạo bất động sản đầu
                  tiên.
                </p>
              </div>
              <Button onClick={() => router.push('/hosting/property/new')}>
                <Building2 className="h-4 w-4 mr-2" />
                Tạo bất động sản đầu tiên
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* Properties Table */}
      <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Date Filter Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium text-muted-foreground">Lọc theo thời gian:</span>

              {/* Quick Date Filters */}
              <div className="flex gap-2">
                <Button
                  variant={dateFilterMode === 'All' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => applyDateFilter('All')}
                >
                  Tất cả
                </Button>
                <Button
                  variant={dateFilterMode === 'Today' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => applyDateFilter('Today')}
                >
                  Hôm nay
                </Button>
                <Button
                  variant={dateFilterMode === 'ThisWeek' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => applyDateFilter('ThisWeek')}
                >
                  Tuần này
                </Button>
                <Button
                  variant={dateFilterMode === 'ThisMonth' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => applyDateFilter('ThisMonth')}
                >
                  Tháng này
                </Button>
              </div>

              {/* Custom Date Range */}
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={dateFilterMode === 'Custom' ? 'default' : 'outline'}
                      size="sm"
                      className={cn(
                        'justify-start text-left font-normal',
                        !startDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {/* {startDate ? formatDate(startDate.toISOString()) : 'Từ ngày'} */}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
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
                        !endDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {/* {endDate ? formatDate(endDate.toISOString()) : 'Đến ngày'} */}
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
                  Áp dụng
                </Button>
              </div>

              {/* Clear Date Filter */}
              {dateFilterMode !== 'All' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearDateFilter}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Xóa lọc
                </Button>
              )}
            </div>

            {/* Active Filters Display */}
            {dateFilterMode !== 'All' && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Bộ lọc đang áp dụng:</span>

                <Badge variant="secondary" className="gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {dateFilterMode === 'Today' && 'Hôm nay'}
                  {dateFilterMode === 'ThisWeek' && 'Tuần này'}
                  {dateFilterMode === 'ThisMonth' && 'Tháng này'}
                  {/* {dateFilterMode === 'Custom' &&
                    `Từ ${startDate ? formatDate(startDate.toISOString()) : ''} đến ${endDate ? formatDate(endDate.toISOString()) : ''}`} */}
                </Badge>
              </div>
            )}

            {/* Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center gap-1">
                        Bất động sản
                        {sortBy === 'title' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-1">
                        Trạng thái
                        {sortBy === 'status' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('price')}
                    >
                      <div className="flex items-center gap-1">
                        Giá
                        {sortBy === 'price' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead className="text-center">Lưu</TableHead>
                    <TableHead className="text-center">Thích</TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center gap-1">
                        Ngày tạo
                        {sortBy === 'createdAt' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProperties.map(property => (
                    <TableRow key={property.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{property.title || property.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {property.transactionType === 'ForRent'
                              ? 'Cho thuê'
                              : property.transactionType === 'ForSale'
                                ? 'Bán'
                                : property.transactionType === 'Project'
                                  ? 'Dự án'
                                  : 'N/A'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={property.status || 'Unknown'} />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {/* {property.transactionType === 'ForRent'
                            ? formatPrice(property.rentalPrice || 0, TransactionType.FOR_RENT)
                            : formatPrice(property.salePrice || 0, TransactionType.FOR_SALE)} */}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {property.transactionType === 'ForRent' ? 'Giá thuê' : 'Giá bán'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{property.type || 'N/A'}</div>
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
                        {/* <div className="text-sm">{formatDate(property.createdAt)}</div> */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Hiển thị {startIndex + 1} - {Math.min(endIndex, totalCount)} trong tổng số{' '}
                  {totalCount} bất động sản
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Trước
                  </Button>
                  <span className="text-sm">
                    Trang {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
