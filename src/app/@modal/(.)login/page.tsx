"use client";

import { useRouter } from "next/navigation";
import LoginModal from "@/app/(auth)/components/login-modal";

export default function LoginModalRoute() {
  const router = useRouter();

  const closeModal = () => router.back();

  return <LoginModal onClose={closeModal} />;
}
