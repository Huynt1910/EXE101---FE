'use client';

import { useState } from 'react';
import { DealsByStatusChart } from '@/components/common/DealsByStatusChart';
// import { DataTable } from '@/components/DataTable';
import { SectionCards } from '@/components/common/SectionCards';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
// import { RevenueChart } from '@/components/RevenueChart';
import { UserPropertiesSection } from '@/components/common/UserPropertiesSection';

function DashboardSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6">
        <Skeleton className="h-8 w-64 sm:h-10 sm:w-80 lg:h-12 lg:w-96" />
        <Skeleton className="h-4 w-48 sm:h-5 sm:w-64 mt-2" />
      </div>
      <div className="flex-1 overflow-x-hidden overflow-y-auto scrollbar-hide">
        <div className="@container/main flex flex-1 flex-col gap-4 sm:gap-6 px-4 sm:px-6 py-4 sm:py-6 mx-auto max-w-[1600px]">
          {/* Section Cards Skeleton */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-8 w-20 mt-2" />
                  <Skeleton className="h-4 w-32 mt-2" />
                </CardHeader>
                <CardContent className="pt-0">
                  <Skeleton className="h-4 w-28" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
            {/* Donut chart card */}
            <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-6 rounded" />
                  <Skeleton className="h-6 w-48" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-6 lg:gap-8">
                  <Skeleton className="h-56 w-56 sm:h-64 sm:w-64 rounded-full" />
                  <div className="space-y-4 sm:space-y-6 w-full max-w-sm">
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

            {/* Revenue chart card */}
            <Card className="border-2 shadow-sm bg-white/50 backdrop-blur-lg w-full">
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="order-1 md:order-1 space-y-2 w-full">
                    <Skeleton className="h-8 w-28" />
                    <Skeleton className="h-4 w-48" />
                    <div className="rounded-md border border-border/50 bg-muted/30 p-3">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-56 mt-2" />
                    </div>
                  </div>
                  <div className="relative h-56 sm:h-64 order-2 md:order-2">
                    <div className="h-full w-full flex items-end gap-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton
                          key={i}
                          className={`w-8 sm:w-10 ${i % 2 ? 'h-40' : 'h-28'} rounded-md`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Properties Section Skeleton */}
          <div className="space-y-6">
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-8 w-20 mt-2" />
                    <Skeleton className="h-4 w-32 mt-2" />
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* Properties Table Skeleton */}
            <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-48" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-40" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                  <div className="border rounded-lg">
                    <div className="p-4 border-b">
                      <div className="grid grid-cols-7 gap-4">
                        {Array.from({ length: 7 }).map((_, i) => (
                          <Skeleton key={i} className="h-4 w-20" />
                        ))}
                      </div>
                    </div>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="p-4 border-b last:border-b-0">
                        <div className="grid grid-cols-7 gap-4">
                          {Array.from({ length: 7 }).map((_, j) => (
                            <Skeleton key={j} className="h-4 w-24" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-48" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table skeleton */}
          <div className="space-y-4">
            <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <div className="bg-muted/30 px-4 sm:px-6 py-3 sm:py-4 min-w-[720px]">
                    <div className="flex justify-between sm:space-x-8">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-4 w-16 sm:w-20" />
                      ))}
                    </div>
                  </div>
                  <div className="divide-y divide-border/50 min-w-[720px]">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex justify-between sm:space-x-8">
                          {Array.from({ length: 4 }).map((__, j) => (
                            <Skeleton key={j} className="h-4 w-20 sm:w-24" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardError() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto scrollbar-hide">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-6 py-6 md:gap-8 md:py-8">
            <div className="px-4 lg:px-6">
              <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-foreground">
                        Không thể tải Dashboard
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-md">
                        Đã xảy ra lỗi khi tải dữ liệu dashboard. Vui lòng kiểm tra kết nối mạng và
                        thử lại.
                      </p>
                    </div>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Thử lại
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const user = {
    profile: {
      fullName: 'bạn',
    },
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const leads = {
    leads: {
      data: [],
    },
  };
  const leadsLoading = false;
  const totalCount = 0;
  const totalPages = 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Combined loading state
  const isLoading = leadsLoading;

  // Combined error state
  const isError = false;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return <DashboardError />;
  }

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 w-full max-w-none px-4 sm:px-6 py-4 sm:py-6 overflow-auto scrollbar-hide">
        <div className="space-y-6 sm:space-y-8 mx-auto max-w-[1600px]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">
                Chào mừng bạn đã trở lại {user?.profile?.fullName}!
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Quản lý tất cả {totalCount || 0} khách hàng tiềm năng của bạn
              </p>
            </div>
          </div>
          <div className="flex-1 overflow-x-hidden overflow-y-auto scrollbar-hide">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-6">
                <SectionCards />
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
                  <DealsByStatusChart />
                  {/* <RevenueChart /> */}
                </div>
                <UserPropertiesSection />
                {/* <DataTable
                  data={leads?.leads?.data || []}
                  isLoading={leadsLoading}
                  totalCount={totalCount}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                /> */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
