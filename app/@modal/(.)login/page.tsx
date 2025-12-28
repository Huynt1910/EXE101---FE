"use client";

import { useRouter, useSearchParams } from "next/navigation";
import LoginModal from "@/app/(auth)/components/login-modal";

export default function LoginModalRoute() {
  const router = useRouter();
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl") || "/";

  return (
    <LoginModal
      callbackUrl={callbackUrl}
      onClose={() => router.back()}
      onSubmit={() => {
        router.back();
        setTimeout(() => {
          router.replace(callbackUrl);
        }, 0);
      }}
      onSignUp={() =>
        router.replace("/signup")
      }
    />
  );
}
