'use client';

import { memo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

const MOCK_TOP_KPIS = {
  leadsAssignedToday: 12,
  dealsInProgress: 16,
  dealsClosedThisMonth: 11,
  dealsWonThisMonth: 9,
  dealsLostThisMonth: 3,
};

const METRIC_COLORS = {
  leadsAssignedToday: '#3b82f6',
  dealsInProgress: '#f59e0b',
  dealsClosedThisMonth: '#8b5cf6',
  dealsWonThisMonth: '#10b981',
  dealsLostThisMonth: '#ef4444',
} as const;

const METRIC_LABELS = {
  leadsAssignedToday: 'Leads assigned today',
  dealsInProgress: 'Deals in progress',
  dealsClosedThisMonth: 'Deals closed this month',
  dealsWonThisMonth: 'Deals won this month',
  dealsLostThisMonth: 'Deals lost this month',
} as const;

interface ChartDataItem {
  name: keyof typeof METRIC_COLORS;
  label: string;
  value: number;
  color: string;
}

interface PieSectorMeta {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
}

function isPieSectorMeta(value: unknown): value is PieSectorMeta {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.cx === 'number' &&
    typeof candidate.cy === 'number' &&
    typeof candidate.midAngle === 'number' &&
    typeof candidate.outerRadius === 'number'
  );
}

function ChartSkeleton() {
  return (
    <Card className="border-0 bg-white/50 shadow-sm backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-6 w-48" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-8">
          <Skeleton className="h-64 w-64 rounded-full" />
          <div className="space-y-6">
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
  );
}

function ChartError() {
  return (
    <div className="px-4 lg:px-6">
      <Alert variant="destructive" className="border-red-200 bg-red-50">
        <AlertDescription>
          Unable to load chart data. Please try again later.
        </AlertDescription>
      </Alert>
    </div>
  );
}

function ChartEmpty() {
  return (
    <Card className="border-0 bg-white/50 shadow-sm backdrop-blur-sm">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="space-y-3 text-center">
          <BarChart3 className="mx-auto h-16 w-16 text-muted-foreground" />
          <h3 className="text-xl font-semibold text-foreground">No data available</h3>
          <p className="max-w-md text-sm text-muted-foreground">
            There is not enough performance data to render this chart yet. Add a few leads or deals
            to get started.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

const MetricLegend = memo(({ item }: { item: ChartDataItem }) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <div className="h-4 w-4 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
      <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
    </div>
    <span className="text-lg font-bold text-foreground">{item.value}</span>
  </div>
));

MetricLegend.displayName = 'MetricLegend';

export function DealsByStatusChart() {
  const topKpis = { data: MOCK_TOP_KPIS };
  const isLoading = false;
  const isError = false;
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | undefined>(
    undefined,
  );

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (isError) {
    return <ChartError />;
  }

  if (!topKpis?.data) {
    return <ChartEmpty />;
  }

  const statistics = topKpis.data;
  const chartData: ChartDataItem[] = [
    {
      name: 'leadsAssignedToday',
      label: METRIC_LABELS.leadsAssignedToday,
      value: statistics.leadsAssignedToday || 0,
      color: METRIC_COLORS.leadsAssignedToday,
    },
    {
      name: 'dealsInProgress',
      label: METRIC_LABELS.dealsInProgress,
      value: statistics.dealsInProgress || 0,
      color: METRIC_COLORS.dealsInProgress,
    },
    {
      name: 'dealsClosedThisMonth',
      label: METRIC_LABELS.dealsClosedThisMonth,
      value: statistics.dealsClosedThisMonth || 0,
      color: METRIC_COLORS.dealsClosedThisMonth,
    },
    {
      name: 'dealsWonThisMonth',
      label: METRIC_LABELS.dealsWonThisMonth,
      value: statistics.dealsWonThisMonth || 0,
      color: METRIC_COLORS.dealsWonThisMonth,
    },
    {
      name: 'dealsLostThisMonth',
      label: METRIC_LABELS.dealsLostThisMonth,
      value: statistics.dealsLostThisMonth || 0,
      color: METRIC_COLORS.dealsLostThisMonth,
    },
  ];

  const totalMetrics = chartData.reduce((sum, item) => sum + item.value, 0);
  const hasData = totalMetrics > 0;
  const displayData = hasData
    ? chartData.filter((item) => item.value > 0)
    : chartData.map((item) => ({ ...item, value: 1 }));

  return (
    <div>
      <Card className="border-2 bg-white/50 shadow-sm backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Business overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:gap-8">
            <div className="relative h-56 w-56 shrink-0 sm:h-64 sm:w-64">
              <ChartContainer
                config={{
                  metrics: { label: 'Business Metrics' },
                  leadsAssignedToday: {
                    label: METRIC_LABELS.leadsAssignedToday,
                    color: METRIC_COLORS.leadsAssignedToday,
                  },
                  dealsInProgress: {
                    label: METRIC_LABELS.dealsInProgress,
                    color: METRIC_COLORS.dealsInProgress,
                  },
                  dealsClosedThisMonth: {
                    label: METRIC_LABELS.dealsClosedThisMonth,
                    color: METRIC_COLORS.dealsClosedThisMonth,
                  },
                  dealsWonThisMonth: {
                    label: METRIC_LABELS.dealsWonThisMonth,
                    color: METRIC_COLORS.dealsWonThisMonth,
                  },
                  dealsLostThisMonth: {
                    label: METRIC_LABELS.dealsLostThisMonth,
                    color: METRIC_COLORS.dealsLostThisMonth,
                  },
                }}
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    {hasData && (
                      <ChartTooltip
                        cursor={true}
                        content={<ChartTooltipContent hideLabel />}
                        offset={12}
                        allowEscapeViewBox={{ x: true, y: true }}
                        position={tooltipPosition}
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
                        if (isPieSectorMeta(data)) {
                          const rad = Math.PI / 180;
                          const radius = data.outerRadius + 20;
                          const x = data.cx + radius * Math.cos(-data.midAngle * rad);
                          const y = data.cy + radius * Math.sin(-data.midAngle * rad);
                          setTooltipPosition({ x, y });
                        }
                      }}
                      onMouseLeave={() => setTooltipPosition(undefined)}
                    >
                      {displayData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={hasData ? entry.color : `${entry.color}60`}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>

              <div className="pointer-events-none absolute inset-0 z-[-999] flex flex-col items-center justify-center">
                <div className="text-4xl font-bold text-foreground">{totalMetrics}</div>
                <div className="text-sm text-muted-foreground">Total activity</div>
              </div>
            </div>

            <div className="flex w-full min-w-[200px] flex-col gap-4 sm:gap-6 lg:w-auto">
              {chartData.map((item) => (
                <MetricLegend key={item.name} item={item} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
