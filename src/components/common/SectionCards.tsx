'use client';

import { BarChart3, Target, TrendingDownIcon, TrendingUpIcon, Trophy, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const MOCK_TOP_KPIS = {
  leadsAssignedToday: 12,
  totalLeadsAssigned: 148,
  followUpsDueToday: 7,
  dealsInProgress: 16,
  dealsClosedThisMonth: 11,
  dealsWonThisMonth: 9,
  dealsLostThisMonth: 3,
  conversionRate: 37.5,
};

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  badge?: {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    icon?: React.ReactNode;
  };
  footer?: string;
  footerIcon?: React.ReactNode;
}

function MetricCard({
  title,
  value,
  description,
  icon,
  badge,
  footer,
  footerIcon,
}: MetricCardProps) {
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
            <Badge
              variant={badge.variant}
              className="bg-accent text-xs font-medium text-accent-foreground hover:bg-accent/80"
            >
              {badge.icon && <span className="mr-1">{badge.icon}</span>}
              {badge.text}
            </Badge>
          )}
        </div>
        <CardTitle className="text-3xl font-bold tracking-tight text-foreground">{value}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      {footer && (
        <CardContent className="pt-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {footerIcon && <span className="text-muted-foreground">{footerIcon}</span>}
            <span className="font-medium">{footer}</span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function SectionCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="border-0 bg-white/50 shadow-sm backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="mt-2 h-9 w-20" />
            <Skeleton className="mt-2 h-4 w-32" />
          </CardHeader>
          <CardContent className="pt-0">
            <Skeleton className="h-4 w-28" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SectionCardsError() {
  return (
    <div className="px-4 lg:px-6">
      <Alert variant="destructive" className="border-red-200 bg-red-50">
        <AlertDescription>
          Unable to load KPI data. Please try again later.
        </AlertDescription>
      </Alert>
    </div>
  );
}

export function SectionCards() {
  const topKpis = { data: MOCK_TOP_KPIS };
  const isLoading = false;
  const isError = false;

  if (isLoading) {
    return <SectionCardsSkeleton />;
  }

  if (isError) {
    return <SectionCardsError />;
  }

  if (!topKpis?.data) {
    return (
      <div className="px-4 lg:px-6">
        <Card className="border-0 bg-white/50 shadow-sm backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="space-y-2 text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground">No data available</h3>
              <p className="text-sm text-muted-foreground">
                There is no KPI data to display yet.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data } = topKpis;
  const totalDeals =
    (data.dealsWonThisMonth || 0) + (data.dealsLostThisMonth || 0) + (data.dealsInProgress || 0);
  const winRate = totalDeals > 0 ? ((data.dealsWonThisMonth || 0) / totalDeals) * 100 : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Leads"
        value={data.leadsAssignedToday || 0}
        icon={<Users className="h-5 w-5 text-red-500" />}
        badge={{
          text: `Total: ${data.totalLeadsAssigned || 0}`,
          variant: 'secondary',
          icon: <TrendingUpIcon className="h-3 w-3" />,
        }}
        footer={`Follow-ups due: ${data.followUpsDueToday || 0}`}
        footerIcon={<TrendingUpIcon className="h-4 w-4" />}
      />

      <MetricCard
        title="Deals in progress"
        value={data.dealsInProgress || 0}
        icon={<Target className="h-5 w-5 text-amber-600" />}
        footer={`Closed this month: ${data.dealsClosedThisMonth || 0}`}
        footerIcon={<TrendingUpIcon className="h-4 w-4" />}
      />

      <MetricCard
        title="Won deals"
        value={data.dealsWonThisMonth || 0}
        icon={<Trophy className="h-5 w-5 text-emerald-600" />}
        badge={{
          text: `${winRate.toFixed(1)}%`,
          variant: winRate >= 50 ? 'default' : 'destructive',
          icon:
            winRate >= 50 ? (
              <TrendingUpIcon className="h-3 w-3" />
            ) : (
              <TrendingDownIcon className="h-3 w-3" />
            ),
        }}
        footer={`Lost deals: ${data.dealsLostThisMonth || 0}`}
        footerIcon={<TrendingDownIcon className="h-4 w-4" />}
      />

      <MetricCard
        title="Conversion rate"
        value={`${(data.conversionRate || 0).toFixed(1)}%`}
        icon={<BarChart3 className="h-5 w-5 text-purple-600" />}
        badge={{
          text: (data.conversionRate || 0) > 0 ? 'Healthy' : 'Low',
          variant: (data.conversionRate || 0) > 0 ? 'default' : 'destructive',
          icon:
            (data.conversionRate || 0) > 0 ? (
              <TrendingUpIcon className="h-3 w-3" />
            ) : (
              <TrendingDownIcon className="h-3 w-3" />
            ),
        }}
        footer={`Total deals: ${totalDeals}`}
      />
    </div>
  );
}
