"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "@/components/hooks/use-toast";
import SignUpForm from "../components/signup-form";

export default function SignUpPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl") || "/";

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

  return (
    <SignUpForm
      mode="page"
      showLogo={false}
      callbackUrl={callbackUrl}
      onSubmit={handleSubmit}
      onLogIn={() =>
        router.replace(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)
      }
    />
  );
}
