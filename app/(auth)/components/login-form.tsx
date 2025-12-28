"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useMemo, useState } from "react";
import { FaApple, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { cn } from "@/lib/utils";

export interface LoginFormProps {
  onSubmit?: (email: string, password: string) => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;

  showLogo?: boolean;
  centered?: boolean;

  callbackUrl?: string; // default "/"
  mode?: "page" | "modal";
  onClose?: () => void;
}

export default function LoginForm({
  onSubmit,
  onForgotPassword,
  onSignUp,
  showLogo = true,
  centered = false,
  callbackUrl = "/",
  mode = "page",
  onClose,
}: LoginFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isPage = mode === "page";

  const containerAlign = useMemo(() => {
    if (isPage) return "text-left";
    return centered ? "text-center" : "text-left";
  }, [centered, isPage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit?.(email, password);
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
            Welcome back
          </h1>
          <p className="mt-2 text-sm sm:text-2xl text-muted-foreground">
            Log in to your account
          </p>
        </div>
      )}

      <div>
        <div className="flex gap-3 sm:gap-4">
          {/* Apple */}
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

          {/* Facebook */}
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

          {/* Google */}
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

        {/* Divider (--- or ---) */}
        <div className="my-4 sm:my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-md text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Center label giống ảnh */}
        <p className="text-center text-primary font-semibold text-md mb-2">
          Log in with your email address
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full h-12 rounded-lg border bg-white
              px-4 text-lg sm:text-lg
              outline-none
              focus:ring-2 focus:ring-primary/30
            "
            required
          />
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full h-12 rounded-lg border bg-white
              px-4 pr-12 text-lg sm:text-lg
              outline-none
              focus:ring-2 focus:ring-primary/30
            "
            required
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

        <div className="text-left">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-primary text-md font-medium hover:underline"
          >
            Forgot your password?
          </button>
        </div>

        <button
          type="submit"
          className="btn-primary w-full h-12 sm:h-12 text-md"
        >
          Log in
        </button>
      </form>

      <p className="mt-5 text-center text-muted-foreground text-md">
        No account?{" "}
        <button
          type="button"
          onClick={onSignUp}
          className="text-primary font-semibold hover:underline"
        >
          Sign up
        </button>
      </p>
    </div>
  );
}
