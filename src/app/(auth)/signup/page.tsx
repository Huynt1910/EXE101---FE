"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import SignUpForm from "@/app/(auth)/components/signup-form";
import { normalizeCallbackUrl, buildAuthUrl } from "@/lib/callback-url";

export default function SignUpPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const callbackUrl = normalizeCallbackUrl(sp.get("callbackUrl"), "/");

  const handleSubmit = (payload: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) => {
    toast({
      title: "Creating account...",
      description: `Signing up with ${payload.email}`,
    });

    router.replace(callbackUrl);
  };

  const handleLogin = () => {
    router.push(buildAuthUrl("/login", callbackUrl));
  };

  return (
    <SignUpForm
      mode="page"
      callbackUrl={callbackUrl}
      onSubmit={handleSubmit}
      onLogIn={handleLogin}
    />
  );
}
