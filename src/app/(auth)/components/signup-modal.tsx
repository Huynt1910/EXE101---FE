"use client";

import { X } from "lucide-react";
import SignUpForm from "@/app/(auth)/components/signup-form";
import Image from "next/image";

export interface SignUpModalProps {
  callbackUrl: string;
  onClose: () => void;

  onSubmit?: (payload: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) => void;

  onLogIn?: () => void;
}

export default function SignUpModal({
  callbackUrl,
  onClose,
  onSubmit,
  onLogIn,
}: SignUpModalProps) {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-0 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        aria-label="Close signup modal backdrop"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sign up"
        className="
          relative flex flex-col bg-card shadow-2xl
          w-full h-[100svh] rounded-none overflow-hidden min-h-0
          sm:h-auto sm:max-h-[85svh] sm:max-w-lg sm:rounded-2xl
        "
      >
        <div className="peach-gradient relative border-b text-center px-8 pt-6 pb-5 sm:px-12 sm:pt-7 sm:pb-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close signup modal"
            className="absolute right-4 top-4 rounded-full bg-white p-2 text-foreground/70 hover:text-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex justify-center">
            <Image src="/logo_bonddy.png" alt="Bonddy logo" width={68} height={68} priority />
          </div>

          <h2 className="text-lg sm:text-xl font-extrabold text-primary">
            Create an account
          </h2>
          <p className="mt-1 text-xs sm:text-sm lg:text-md text-muted-foreground">
            Let&apos;s get you started! Please enter your details.
          </p>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-10 py-8 sm:px-14 sm:py-8 no-scrollbar">
          <div className="w-full max-w-md mx-auto">
            <SignUpForm
              centered={false}
              mode="modal"
              callbackUrl={callbackUrl}
              onSubmit={onSubmit}
              onLogIn={onLogIn}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
