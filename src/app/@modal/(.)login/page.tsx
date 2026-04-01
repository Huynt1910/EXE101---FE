"use client";

import LoginModal from "@/app/(auth)/components/login-modal";

export default function LoginModalRoute() {
  const closeModal = () => window.history.back();
  const handleAuthenticated = (callbackUrl: string) => {
    window.location.replace(callbackUrl);
  };

  return (
    <LoginModal
      onClose={closeModal}
      onAuthenticated={handleAuthenticated}
    />
  );
}
