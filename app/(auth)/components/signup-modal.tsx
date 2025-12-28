"use client";

import { X } from "lucide-react";
import SignUpForm from "@/app/(auth)/components/signup-form";

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
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        aria-label="Close signup modal backdrop"
        onClick={onClose}
      />

      {/* Panel */}
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
        {/* Header */}
        <div className="peach-gradient relative border-b text-center px-8 pt-6 pb-5 sm:px-12 sm:pt-7 sm:pb-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close signup modal"
            className="absolute right-4 top-4 rounded-full bg-white p-2 text-foreground/70 hover:text-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="text-xl sm:text-2xl font-extrabold text-primary">
            Create an account
          </h2>
          <p className="mt-1 text-sm sm:text-base lg:text-lg text-muted-foreground">
            Sign up to get started
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto px-10 py-8 sm:px-18 sm:py-8 no-scrollbar">
          <div className="w-full max-w-md mx-auto">
            <SignUpForm
              showLogo={false}
              centered={false}
              mode="modal"
              callbackUrl={callbackUrl}
              onClose={onClose}
              onSubmit={onSubmit}
              onLogIn={onLogIn}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
