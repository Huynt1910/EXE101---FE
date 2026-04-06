import Link from "next/link";
import { BuddyProfileSummaryCard } from "./components/buddy-profile-summary-card";

export default function BuddyProfilePage() {
  return (
    <main className="w-full px-4 py-4 pb-24 sm:px-6 sm:py-6 md:pb-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <BuddyProfileSummaryCard />
      </div>
    </main>
  );
}
