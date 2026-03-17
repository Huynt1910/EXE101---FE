'use client';

import { memo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart3 } from 'lucide-react';

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
  leadsAssignedToday: 'Khách hàng tiềm năng hôm nay',
  dealsInProgress: 'Giao dịch đang thực hiện',
  dealsClosedThisMonth: 'Giao dịch trong tháng này',
  dealsWonThisMonth: 'Giao dịch đã chốt tháng này',
  dealsLostThisMonth: 'Giao dịch thất bại tháng này',
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
    <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
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
  );
}

function ChartError() {
  return (
    <div className="px-4 lg:px-6">
      <Alert variant="destructive" className="border-red-200 bg-red-50">
        <AlertDescription>Không thể tải dữ liệu biểu đồ. Vui lòng thử lại sau.</AlertDescription>
      </Alert>
    </div>
  );
}

function ChartEmpty() {
  return (
    <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="text-center space-y-3">
          <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto" />
          <h3 className="text-xl font-semibold text-foreground">Không có dữ liệu</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Chưa có dữ liệu thống kê để hiển thị biểu đồ. Hãy tạo một số deals hoặc leads để bắt
            đầu.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

const MetricLegend = memo(({ item }: { item: ChartDataItem }) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <div className="h-4 w-4 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
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
    undefined
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
    ? chartData.filter(item => item.value > 0)
    : chartData.map(item => ({ ...item, value: 1 }));

  return (
    <div>
      <Card className="border-2 shadow-sm bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Tổng Quan Kinh Doanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
            <div className="relative flex-shrink-0 w-56 h-56 sm:w-64 sm:h-64">
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
                className="w-full h-full"
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
                      onMouseMove={data => {
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

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-[-999]">
                <div className="text-4xl font-bold text-foreground">{totalMetrics}</div>
                <div className="text-sm text-muted-foreground">Tổng Hoạt Động</div>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:gap-6 min-w-[200px] w-full lg:w-auto">
              {chartData.map(item => (
                <MetricLegend key={item.name} item={item} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
