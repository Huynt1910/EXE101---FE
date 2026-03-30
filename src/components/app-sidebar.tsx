"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  BookOpen,
  LayoutDashboard,
  MapPinned,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAdminBuddies, useAdminIncidents, useAdminTrips, useAdminUsers } from "@/features/admin/hooks/useAdmin";
import { useAuthStore } from "@/lib/store/authStore";
import { authStore } from "@/lib/store/authStore";

type AdminSidebarBadgeKey = "users" | "buddies" | "trips" | "incidents";

const ADMIN_MENU_ITEMS: Array<{
  title: string;
  href: string;
  tab: string;
  icon: typeof LayoutDashboard;
  badgeKey?: AdminSidebarBadgeKey;
}> = [
  {
    title: "Overview",
    href: "/admin?tab=overview",
    tab: "overview",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin?tab=users",
    tab: "users",
    icon: Users,
    badgeKey: "users",
  },
  {
    title: "Buddies",
    href: "/admin?tab=buddies",
    tab: "buddies",
    icon: MapPinned,
    badgeKey: "buddies",
  },
  {
    title: "Trips & Bookings",
    href: "/admin?tab=operations",
    tab: "operations",
    icon: BookOpen,
    badgeKey: "trips",
  },
  {
    title: "Incidents",
    href: "/admin?tab=incidents",
    tab: "incidents",
    icon: AlertTriangle,
    badgeKey: "incidents",
  },
];

function getInitials(name?: string | null) {
  const source = name?.trim() || "AD";
  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") ?? "overview";
  const { user } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  const usersQuery = useAdminUsers({ Page: 1, PageSize: 1 });
  const buddiesQuery = useAdminBuddies();
  const tripsQuery = useAdminTrips({ Page: 1, PageSize: 1 });
  const incidentsQuery = useAdminIncidents({ Page: 1, PageSize: 1 });

  const badgeMap = {
    users: usersQuery.data?.data.totalCount ?? 0,
    buddies: buddiesQuery.data?.data.length ?? 0,
    trips: tripsQuery.data?.data.totalCount ?? 0,
    incidents: incidentsQuery.data?.data.totalCount ?? 0,
  } as const;

  const handleLogout = () => {
    authStore.logout();
    window.location.href = "/";
  };

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const displayName = isHydrated ? user?.fullName ?? "Admin" : "Admin";
  const displayEmail = isHydrated ? user?.email ?? "Administrator" : "Administrator";
  const displayInitials = getInitials(displayName);

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="Bonddy Admin">
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <ShieldCheck className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Bonddy</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Admin console
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ADMIN_MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === "/admin" && currentTab === item.tab;
                const badge =
                  item.badgeKey !== undefined
                    ? badgeMap[item.badgeKey]
                    : undefined;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {typeof badge === "number" && badge > 0 ? (
                      <SidebarMenuBadge>{badge}</SidebarMenuBadge>
                    ) : null}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Admin account">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  {displayInitials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {displayEmail}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Log out">
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
