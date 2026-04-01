"use client";

import { useRouter } from "next/navigation";
import LoginModal from "@/app/(auth)/components/login-modal";

export default function LoginModalRoute() {
  const router = useRouter();

  const closeModal = () => router.back();
  const handleAuthenticated = (callbackUrl: string) => {
    router.back();
    requestAnimationFrame(() => {
      router.replace(callbackUrl, { scroll: false });
    });
  };

  return (
    <LoginModal
      onClose={closeModal}
      onAuthenticated={handleAuthenticated}
    />
  );
}
