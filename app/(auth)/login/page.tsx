"use client";

import { useSearchParams, useRouter } from "next/navigation";
import LoginForm from "@/app/(auth)/components/login-form";
import { toast } from "@/components/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl") || "/";

  const handleSubmit = (email: string, password: string) => {
    toast({
      title: "Logging in...",
      description: `Signing in with ${email}`,
    });

    router.replace(callbackUrl);
  };

  return (
    <LoginForm
      onSubmit={handleSubmit}
      callbackUrl={callbackUrl}
      mode="page"
      showLogo={false} 
    />
  );
}
