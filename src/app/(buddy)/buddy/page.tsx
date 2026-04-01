'use client';

import { AlertCircle } from 'lucide-react';
import { DealsByStatusChart } from '@/components/common/DealsByStatusChart';
import { SectionCards } from '@/components/common/SectionCards';
import { UserPropertiesSection } from '@/components/common/UserPropertiesSection';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function DashboardSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 sm:py-6">
        <Skeleton className="h-8 w-64 sm:h-10 sm:w-80 lg:h-12 lg:w-96" />
        <Skeleton className="mt-2 h-4 w-48 sm:h-5 sm:w-64" />
      </div>
      <div className="flex-1 overflow-x-hidden overflow-y-auto scrollbar-hide">
        <div className="@container/main mx-auto flex max-w-[1600px] flex-1 flex-col gap-4 px-4 py-4 sm:gap-6 sm:px-6 sm:py-6">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="border-0 bg-white/50 shadow-sm backdrop-blur-sm">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="mt-2 h-8 w-20" />
                  <Skeleton className="mt-2 h-4 w-32" />
                </CardHeader>
                <CardContent className="pt-0">
                  <Skeleton className="h-4 w-28" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-2">
            <Card className="border-0 bg-white/50 shadow-sm backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-6 rounded" />
                  <Skeleton className="h-6 w-48" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-6 lg:gap-8">
                  <Skeleton className="h-56 w-56 rounded-full sm:h-64 sm:w-64" />
                  <div className="w-full max-w-sm space-y-4 sm:space-y-6">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="flex items-center justify-between gap-4">
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

            <Card className="w-full border-2 bg-white/50 shadow-sm backdrop-blur-lg">
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
                  <div className="order-1 w-full space-y-2 md:order-1">
                    <Skeleton className="h-8 w-28" />
                    <Skeleton className="h-4 w-48" />
                    <div className="rounded-md border border-border/50 bg-muted/30 p-3">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="mt-2 h-3 w-56" />
                    </div>
                  </div>
                  <div className="relative order-2 h-56 sm:h-64 md:order-2">
                    <div className="flex h-full w-full items-end gap-3">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <Skeleton
                          key={index}
                          className={`w-8 rounded-md sm:w-10 ${index % 2 ? 'h-40' : 'h-28'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="border-0 bg-white/50 shadow-sm backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="mt-2 h-8 w-20" />
                    <Skeleton className="mt-2 h-4 w-32" />
                  </CardHeader>
                </Card>
              ))}
            </div>

            <Card className="border-0 bg-white/50 shadow-sm backdrop-blur-sm">
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
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                  <div className="rounded-lg border">
                    <div className="border-b p-4">
                      <div className="grid grid-cols-7 gap-4">
                        {Array.from({ length: 7 }).map((_, index) => (
                          <Skeleton key={index} className="h-4 w-20" />
                        ))}
                      </div>
                    </div>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="border-b p-4 last:border-b-0">
                        <div className="grid grid-cols-7 gap-4">
                          {Array.from({ length: 7 }).map((__, cellIndex) => (
                            <Skeleton key={cellIndex} className="h-4 w-24" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-48" />
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
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto scrollbar-hide">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-6 py-6 md:gap-8 md:py-8">
            <div className="px-4 lg:px-6">
              <Card className="border-0 bg-white/50 shadow-sm backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="space-y-4 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                      <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-foreground">
                        Unable to load the dashboard
                      </h3>
                      <p className="max-w-md text-sm text-muted-foreground">
                        Something went wrong while loading your dashboard data. Please check your
                        connection and try again.
                      </p>
                    </div>
                    <button
                      onClick={() => window.location.reload()}
                      className="rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Retry
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
      fullName: 'there',
    },
  };
  const leadsLoading = false;
  const totalCount = 0;

  const isLoading = leadsLoading;
  const isError = false;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return <DashboardError />;
  }

  return (
    <div className="flex h-full flex-col">
      <main className="flex-1 w-full max-w-none overflow-auto px-4 py-4 pb-24 scrollbar-hide sm:px-6 sm:py-6 md:pb-6">
        <div className="mx-auto max-w-[1600px] space-y-6 sm:space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold tracking-tight sm:text-xl lg:text-2xl">
                Welcome back, {user.profile.fullName}!
              </h1>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Manage all {totalCount} of your active traveler leads in one place.
              </p>
            </div>
          </div>
          <div className="flex-1 overflow-x-hidden overflow-y-auto scrollbar-hide">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-6">
                <SectionCards />
                <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-2">
                  <DealsByStatusChart />
                </div>
                <UserPropertiesSection />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
