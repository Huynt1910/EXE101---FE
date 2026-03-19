import { CoursesCard } from "./components/courses-card";
import { PaymentCard } from "./components/payment-card";
import { ProfileSummaryCard } from "./components/profile-summary-card";
import { ProfileTopBar } from "./components/profile-top-bar";
import { SubscriptionCard } from "./components/subscription-card";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="space-y-4">
        <ProfileTopBar />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <ProfileSummaryCard />
          <PaymentCard />
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <CoursesCard />
          <SubscriptionCard />
        </div>
      </div>
    </main>
  );
}
