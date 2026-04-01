"use client";

import { useParams } from "next/navigation";
import BuddyDetailPage from "@/components/buddies/BuddyDetailPage";

export default function BuddyProfilePage() {
  const params = useParams<{ id: string }>();

  return <BuddyDetailPage buddyId={params.id} />;
}
