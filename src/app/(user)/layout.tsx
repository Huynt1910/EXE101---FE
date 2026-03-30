import { ProfileSidebar } from "./profile/components/profile-sidebar";
import { UserShellHeader } from "./profile/components/user-shell-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <ProfileSidebar />
      <SidebarInset>
        <UserShellHeader />
        <div className="flex min-h-0 flex-1 flex-col p-4 md:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
