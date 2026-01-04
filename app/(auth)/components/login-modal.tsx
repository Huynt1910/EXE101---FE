"use client";

import Image from "next/image";
import { X } from "lucide-react";
import LoginForm from "@/app/(auth)/components/login-form";

export interface LoginModalProps {
  onClose: () => void;
  onSubmit?: (email: string, password: string) => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
}

export default function LoginModal({
  onClose,
  onSubmit,
  onForgotPassword,
  onSignUp,
}: LoginModalProps) {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-0 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        aria-label="Close login modal backdrop"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Login"
        className="
          relative flex flex-col bg-card shadow-2xl
          w-full h-[100svh] rounded-none overflow-hidden
          sm:h-auto sm:max-h-[85svh] sm:max-w-lg sm:rounded-2xl
        "
      >
        <div className="peach-gradient relative border-b text-center px-8 pt-6 pb-5 sm:px-12 sm:pt-7 sm:pb-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close login modal"
            className="absolute right-4 top-4 rounded-full bg-white p-2 text-foreground/70 hover:text-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex justify-center">
            <Image src="/logo.png" alt="Bonddy logo" width={48} height={48} priority />
          </div>

          <h2 className="mt-2 text-xl sm:text-2xl font-extrabold text-primary">
            Welcome back
          </h2>
          <p className="text-xs sm:text-sm lg:text-lg text-muted-foreground">
            Log in to your account
          </p>
        </div>

        <div className="px-10 py-8 sm:px-14 sm:py-8">
          <div className="w-full max-w-md mx-auto">
            <LoginForm
              mode="modal"
              centered={false}
              onSubmit={onSubmit}
              onForgotPassword={onForgotPassword}
              onSignUp={onSignUp}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
