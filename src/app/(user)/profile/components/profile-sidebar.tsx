"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LogOut, MapPinned } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useMyTravelerBookingsQuery } from "@/features/booking/hooks/useCreateBookingOffer";
import { useChatUnreadSummary } from "@/features/chat/hooks/useChat";
import { useNotificationUnreadCount } from "@/features/notification/hooks/useNotifications";
import { useMyTrips } from "@/features/trip/hooks/useTripRequest";
import { useUserProfile } from "@/features/user/hooks/useUserProfile";
import { authStore } from "@/lib/store/authStore";
import { MENU_ITEMS } from "./profile-data";

function getInitials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.split("@")[0] || "U";

  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ProfileSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const section = searchParams.get("section");
  const profileQuery = useUserProfile();
  const bookingsQuery = useMyTravelerBookingsQuery();
  const tripsQuery = useMyTrips({ Page: 1, PageSize: 1 });
  const chatUnreadQuery = useChatUnreadSummary();
  const notificationUnreadQuery = useNotificationUnreadCount();

  const profile = profileQuery.data?.data;

  const badgeMap = {
    bookings: bookingsQuery.data?.data.totalCount ?? undefined,
    trips: tripsQuery.data?.data.totalCount ?? undefined,
    messages: chatUnreadQuery.data?.data.totalUnread ?? undefined,
    notifications: notificationUnreadQuery.data?.data.unreadCount ?? undefined,
  } as const;

  const isItemActive = (href: string, itemSection?: string) => {
    if (itemSection) {
      return pathname === "/profile" && section === itemSection;
    }

    if (href === "/profile") {
      return pathname === "/profile" && !section;
    }

    return pathname === href;
  };

  const handleLogout = () => {
    authStore.logout();
    router.push("/login");
  };

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="Bonddy Traveler">
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <MapPinned className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Bonddy</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Traveler workspace
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Customer profile</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item.href, item.section);
                const badge =
                  item.badgeKey !== undefined
                    ? badgeMap[item.badgeKey]
                    : item.badge;

                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.label}</span>
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
            <SidebarMenuButton size="lg" tooltip="Account" asChild>
              <Link href="/profile?section=personal">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={profile?.profilePicture ?? undefined}
                    alt={profile?.fullName ?? "Traveler"}
                  />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(profile?.fullName, profile?.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {profile?.fullName ?? "Traveler"}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {profile?.email ?? "Account"}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Log out">
              <LogOut />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
