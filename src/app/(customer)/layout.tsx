import { ProfileSidebar } from "./profile/components/profile-sidebar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="min-h-screen bg-background">
        <ProfileSidebar mobile />
        <div className="grid gap-2 xl:grid-cols-[auto_minmax(0,1fr)]">
          <div className="hidden xl:block xl:sticky xl:top-0 xl:h-screen">
            <ProfileSidebar />
          </div>
          <div className="min-w-0 px-4 pt-16 pb-4 xl:px-0 xl:pt-0 xl:pb-0">
            {children}
          </div>
        </div>
      </main>
    </>
  );
}
