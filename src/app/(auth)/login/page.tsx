"use client";

import { useRouter, useSearchParams } from "next/navigation";
import LoginForm from "@/app/(auth)/components/login-form";
import { toast } from "@/components/ui/use-toast";
import { normalizeCallbackUrl, buildAuthUrl } from "@/lib/callback-url";

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const callbackUrl = normalizeCallbackUrl(sp.get("callbackUrl"), "/");

  const handleSubmit = (email: string, password: string) => {
    // demo UI: sau này thay bằng gọi API
    toast({ title: "Logging in...", description: `Signing in with ${email}` });

    // login xong quay lại đúng trang user muốn tới
    router.replace(callbackUrl);
  };

  const handleSignUp = () => {
    router.push(buildAuthUrl("/signup", callbackUrl));
  };

  const handleForgotPassword = () => {
    router.push(buildAuthUrl("/forgot-password", callbackUrl));
  };

  return (
    <LoginForm
      mode="page"
      onSubmit={handleSubmit}
      onSignUp={handleSignUp}
      onForgotPassword={handleForgotPassword}
    />
  );
}
