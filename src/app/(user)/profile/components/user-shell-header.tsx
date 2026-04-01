"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const sectionTitleMap: Record<string, string> = {
  personal: "Personal Information",
  bookings: "My Bookings",
  trips: "My Trips",
  notifications: "Notifications",
  security: "Security",
};

export function UserShellHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const section = searchParams.get("section");
  const isEditProfilePage = pathname === "/profile" && section === "personal";

  const pageLabel =
    pathname === "/messages"
      ? "Messages"
      : section
      ? sectionTitleMap[section] ?? "Profile"
      : "Overview";

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center border-b bg-background/95 backdrop-blur transition-[width,height] ease-linear supports-[backdrop-filter]:bg-background/70 group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex min-w-0 items-center gap-2 px-3 sm:px-4 md:px-6">
        {isEditProfilePage ? (
          <SidebarTrigger className="-ml-1 md:hidden" />
        ) : (
          <SidebarTrigger className="-ml-1" />
        )}
        {isEditProfilePage ? null : (
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        )}
        <Breadcrumb className="min-w-0">
          <BreadcrumbList className="flex-wrap gap-y-1">
            <BreadcrumbItem>
              <BreadcrumbPage>Traveler</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{pageLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
