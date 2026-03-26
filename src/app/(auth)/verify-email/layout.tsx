import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify email to Your Bonddy Account - Bonddy",
};

export default function VerifyEmailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
