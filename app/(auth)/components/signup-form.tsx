"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useMemo, useState } from "react";
import { FaApple, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface SignUpFormProps {
  onSubmit?: (payload: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) => void;

  onLogIn?: () => void;

  showLogo?: boolean;
  centered?: boolean;

  callbackUrl?: string; // default "/"
  mode?: "page" | "modal";
  onClose?: () => void;
}

export default function SignUpForm({
  onSubmit,
  onLogIn,
  showLogo = true,
  centered = false,
  callbackUrl = "/",
  mode = "page",
  onClose,
}: SignUpFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isPage = mode === "page";

  const containerAlign = useMemo(() => {
    if (isPage) return "text-left";
    return centered ? "text-center" : "text-left";
  }, [centered, isPage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit?.({ email, firstName, lastName, password });

    if (mode === "modal") {
      onClose?.();
      setTimeout(() => router.push(callbackUrl), 0);
      return;
    }

    router.push(callbackUrl);
  };

  return (
    <div className={`w-full ${containerAlign}`}>
      {showLogo && (
        <div className="mb-6 sm:mb-8">
          <Image
            src="/logo.png"
            alt="Bonddy logo"
            width={150}
            height={40}
            priority
            className="h-auto w-auto"
          />
        </div>
      )}

      {/* Heading chỉ ở page (modal đã có header riêng) */}
      {isPage && (
        <div className="mb-5 sm:mb-7">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-tight font-extrabold text-primary">
            Create an account
          </h1>
          <p className="mt-2 text-sm sm:text-2xl text-muted-foreground">
            Sign up to get started
          </p>
        </div>
      )}

      <div>
        <div className="flex gap-3 sm:gap-4">
          <button
            type="button"
            className={cn(
              "w-full h-11 sm:h-12 rounded-lg flex items-center justify-center shadow-sm transition",
              "bg-black text-white hover:opacity-90",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            )}
            aria-label="Continue with Apple"
          >
            <FaApple className="h-7 w-7" />
          </button>

          <button
            type="button"
            className={cn(
              "w-full h-11 sm:h-12 rounded-lg flex items-center justify-center shadow-sm transition",
              "bg-[#1877F2] text-white hover:brightness-110",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            )}
            aria-label="Continue with Facebook"
          >
            <FaFacebook className="h-7 w-7" />
          </button>

          <button
            type="button"
            className={cn(
              "w-full h-11 sm:h-12 rounded-lg flex items-center justify-center shadow-sm transition",
              "bg-white border border-border hover:bg-neutral-100",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            )}
            aria-label="Continue with Google"
          >
            <FcGoogle className="h-7 w-7" />
          </button>
        </div>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-md text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <p className="text-center text-primary font-semibold text-md mb-2">
          Sign up with your email address
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
            w-full h-12 rounded-lg border bg-white
            px-4 text-lg outline-none
            focus:ring-2 focus:ring-primary/30
          "
          required
        />

        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="
            w-full h-12 rounded-lg border bg-white
            px-4 text-lg outline-none
            focus:ring-2 focus:ring-primary/30
          "
          required
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="
            w-full h-12 rounded-lg border bg-white
            px-4 text-lg outline-none
            focus:ring-2 focus:ring-primary/30
          "
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full h-12 rounded-lg border bg-white
              px-4 pr-12 text-lg outline-none
              focus:ring-2 focus:ring-primary/30
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

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <span className="block whitespace-nowrap">
            When using Withlocals you accept our
          </span>

          <span className="block whitespace-nowrap">
            <a
              href="/terms"
              className="text-primary font-semibold hover:underline underline-offset-0"
            >
              Terms &amp; Conditions
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="text-primary font-semibold hover:underline underline-offset-0"
            >
              Privacy Policy
            </a>
          </span>
        </p>

        <button type="submit" className="btn-primary w-full h-12 text-md">
          Sign up
        </button>
      </form>

      <p className="mt-5 text-center text-muted-foreground text-md">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onLogIn}
          className="text-primary font-semibold hover:underline"
        >
          Log in
        </button>
      </p>
    </div>
  );
}
