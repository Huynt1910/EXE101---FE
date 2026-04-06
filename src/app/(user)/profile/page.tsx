import { ProfileBookingsSection } from "./components/profile-bookings-section";
import { ProfileNotificationsSection } from "./components/profile-notifications-section";
import { ProfileOverviewSection } from "./components/profile-overview-section";
import { ProfileSecuritySection } from "./components/profile-security-section";
import { MyTripsSection } from "./components/my-trips-section";
import { ProfileSummaryCard } from "./components/profile-summary-card";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams?: Promise<{ section?: string }>;
}) {
  const section = (await searchParams)?.section;

  const content = (() => {
    switch (section) {
      case "personal":
        return <ProfileSummaryCard />;
      case "bookings":
        return <ProfileBookingsSection />;
      case "trips":
        return <MyTripsSection />;
      case "notifications":
        return <ProfileNotificationsSection />;
      case "security":
        return <ProfileSecuritySection />;
      default:
        return <ProfileOverviewSection />;
    }
  })();

  return <main className="space-y-4">{content}</main>;
}
