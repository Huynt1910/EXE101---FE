"use client";

import { useRouter, useSearchParams } from "next/navigation";
import SignUpModal from "@/app/(auth)/components/signup-modal";

export default function SignUpModalRoute() {
  const router = useRouter();
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl") || "/";

  return (
    <SignUpModal
      callbackUrl={callbackUrl}
      onClose={() => router.back()}
      onLogIn={() => router.replace(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)}
    />
  );
}
