"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { buildAuthUrl, normalizeCallbackUrl } from "@/lib/callback-url";
import { FaApple, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export interface SignUpFormProps {
  readonly onSubmit?: (payload: {
    email: string;
    fullName: string;
    password: string;
  }) => void;

  readonly onLogIn?: () => void;
  readonly onGoogleSignIn?: () => void;

  readonly centered?: boolean;
  readonly callbackUrl?: string;
  readonly mode?: "page" | "modal";
  readonly isLoading?: boolean;
  readonly isGoogleLoading?: boolean;
}

export default function SignUpForm({
  onSubmit,
  onLogIn,
  onGoogleSignIn,
  centered = false,
  callbackUrl = "/",
  mode = "page",
  isLoading = false,
  isGoogleLoading = false,
}: SignUpFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isPage = mode === "page";
  
  let containerAlign = "text-left";
  if (!isPage && centered) {
    containerAlign = "text-center";
  }

  const safeCallbackUrl = normalizeCallbackUrl(callbackUrl, "/");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ email, fullName, password });
  };

  const handleLogin = () => {
    if (onLogIn) return onLogIn();
    router.push(buildAuthUrl("/login", safeCallbackUrl));
  };

  return (
    <div className={`w-full ${containerAlign}`}>
      {isPage && (
        <div className="mb-10 sm:mb-8 text-center md:text-left">
          <Link href="/" aria-label="Go to homepage">
            <Image
              src="/logo_bonddy.png"
              alt="Bonddy"
              width={120}
              height={28}
              priority
              className="cursor-pointer mx-auto md:mx-0"
            />
          </Link>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary">
            Create an account
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground">
            Sign up to get started
          </p>
        </div>
      )}

      <div>
        <div className="flex gap-3 sm:gap-4">
          <button
            type="button"
            disabled={isLoading}
            className={cn(
              "w-full h-11 sm:h-12 rounded-lg flex items-center justify-center shadow-sm transition",
              "bg-black text-white hover:opacity-90",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
            aria-label="Continue with Apple"
          >
            <FaApple className="h-7 w-7" />
          </button>

          <button
            type="button"
            disabled={isLoading}
            className={cn(
              "w-full h-11 sm:h-12 rounded-lg flex items-center justify-center shadow-sm transition",
              "bg-[#1877F2] text-white hover:brightness-110",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
            aria-label="Continue with Facebook"
          >
            <FaFacebook className="h-7 w-7" />
          </button>

          <button
            type="button"
            onClick={onGoogleSignIn}
            disabled={isGoogleLoading}
            className={cn(
              "w-full h-11 sm:h-12 rounded-lg flex items-center justify-center shadow-sm transition",
              "bg-white border border-border hover:bg-neutral-100",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
              isGoogleLoading && "opacity-50 cursor-not-allowed"
            )}
            aria-label="Continue with Google"
          >
            <FcGoogle className="h-7 w-7" />
          </button>
        </div>

        <div className="my-4 sm:my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-md text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <p className="text-center text-primary font-semibold text-sm sm:text-sm mb-3">
          Sign up with your email address
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="
            w-full h-12 rounded-lg border bg-white
            px-4 text-md sm:text-md
            outline-none
            focus:ring-2 focus:ring-primary/30
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          required
        />

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isLoading}
          className="
            w-full h-12 rounded-lg border bg-white
            px-4 text-md sm:text-md
            outline-none
            focus:ring-2 focus:ring-primary/30
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="
              w-full h-12 rounded-lg border bg-white
              px-4 pr-12 text-md sm:text-md
              outline-none
              focus:ring-2 focus:ring-primary/30
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              text-muted-foreground hover:text-primary transition-colors
              p-1
            "
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <p className="mt-6 text-center text-sm sm:text-xs text-muted-foreground">
          <span className="block whitespace-nowrap">
            When using Bonddy you accept our
          </span>
          <span className="block whitespace-nowrap">
            <Link
              href="/terms"
              className="text-primary font-semibold hover:underline"
            >
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-primary font-semibold hover:underline"
            >
              Privacy Policy
            </Link>
          </span>
        </p>

        <button
          type="submit"
          disabled={isLoading || isGoogleLoading}
          className={cn(
            "btn-primary w-full h-12 sm:h-13 text-md transition-all",
            isLoading || isGoogleLoading
              ? "opacity-50 cursor-not-allowed"
              : "hover:opacity-90 active:scale-95"
          )}
        >
          {isLoading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className="mt-5 text-center text-muted-foreground text-sm sm:text-sm">
        Already have an account?{" "}
        <button
          type="button"
          onClick={handleLogin}
          className="text-primary font-semibold hover:underline"
        >
          Log in
        </button>
      </p>
    </div>
  );
}
