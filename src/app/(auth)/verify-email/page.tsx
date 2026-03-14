"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSignup } from "@/features/auth/hooks/useSignup";
import { toast } from "sonner";
import { handleApiError } from "@/lib/error-handler";

export default function VerifyEmailPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const { verifyEmailMutation, requestOtpMutation, sessionQuery } = useSignup();
  
  const email = sp.get("email") || "";
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

  const applyOtpFromIndex = (startIndex: number, rawValue: string) => {
    const digits = rawValue.replaceAll(/\D/g, "").slice(0, 6 - startIndex);
    if (!digits) return;

    const newOtp = [...otp];
    digits.split("").forEach((digit, offset) => {
      newOtp[startIndex + offset] = digit;
    });
    setOtp(newOtp);

    const targetIndex = Math.min(startIndex + digits.length, 5);
    const targetInput = document.getElementById(`otp-${targetIndex}`);
    targetInput?.focus();
  };

  const handleOtpChange = (index: number, value: string) => {
    // Support typing one digit or browser autofill/paste multiple digits.
    if (value.length > 1) {
      applyOtpFromIndex(index, value);
      return;
    }

    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input if filled
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpPaste = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    applyOtpFromIndex(index, e.clipboardData.getData("text"));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    verifyEmailMutation.mutate({
      email,
      otpCode,
      purpose: "Register",
    });
  };

  const handleResendCode = () => {
    if (!email) {
      toast.error("Missing email address");
      return;
    }

    requestOtpMutation.mutate({
      email,
      purpose: "Register",
    });
  };

  // Redirect to homepage after successful verification
  useEffect(() => {
    if (verifyEmailMutation.isSuccess && sessionQuery.data?.accessToken) {
      toast.success("Email verified! Welcome to Bonddy.", {
        duration: 2000,
      });
      
      router.replace("/");
    }
  }, [verifyEmailMutation.isSuccess, sessionQuery.data?.accessToken, router]);

  // Show error with handleApiError
  useEffect(() => {
    if (verifyEmailMutation.isError) {
      handleApiError(verifyEmailMutation.error);
    }
  }, [verifyEmailMutation.isError, verifyEmailMutation.error]);

  useEffect(() => {
    if (requestOtpMutation.isSuccess) {
      toast.success("OTP has been resent to your email.");
    }
  }, [requestOtpMutation.isSuccess]);

  useEffect(() => {
    if (requestOtpMutation.isError) {
      handleApiError(requestOtpMutation.error);
    }
  }, [requestOtpMutation.isError, requestOtpMutation.error]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-10 sm:mb-8 text-center md:text-left">

        <h1 className="mt-6 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary">
          Enter the code
        </h1>
        <p className="mt-2 text-sm sm:text-lg text-muted-foreground">
          Enter the OTP code that we sent to your email, be careful not to share the code with
          anyone.
        </p>
      </div>

      {/* OTP Input Section */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Display */}
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            Code sent to <span className="font-semibold text-primary">{email}</span>
          </p>
        </div>

        {/* OTP Input Boxes */}
        <div className="flex gap-3 justify-center md:justify-start">
          {otp.map((digit, index) => (
            <input
              key={`${email}-otp-${index}`}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              onPaste={(e) => handleOtpPaste(index, e)}
              disabled={verifyEmailMutation.isPending}
              className={cn(
                "w-12 h-14 sm:w-14 sm:h-16 rounded-lg border-2 bg-white",
                "text-center text-lg sm:text-2xl font-semibold",
                "outline-none transition-all",
                "focus:border-primary focus:ring-2 focus:ring-primary/30",
                "hover:border-primary/50",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                digit ? "border-primary text-primary" : "border-border text-foreground"
              )}
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          disabled={verifyEmailMutation.isPending || otp.some((d) => !d)}
          className={cn(
            "btn-primary w-full h-12 sm:h-13 text-md font-semibold rounded-lg",
            "transition-all duration-200",
            verifyEmailMutation.isPending || otp.some((d) => !d)
              ? "opacity-50 cursor-not-allowed"
              : "hover:opacity-90 active:scale-95"
          )}
        >
          {verifyEmailMutation.isPending ? "Verifying..." : "Verify Email"}
        </button>
      </form>

      {/* Resend Code Section */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Didn{"'"}t receive the code?{" "}
          <button
            type="button"
            onClick={handleResendCode}
            disabled={verifyEmailMutation.isPending || requestOtpMutation.isPending || !email}
            className="text-primary font-semibold hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {requestOtpMutation.isPending ? "Resending..." : "Resend"}
          </button>
        </p>
      </div>
    </div>
  );
}
