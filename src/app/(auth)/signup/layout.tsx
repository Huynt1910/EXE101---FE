import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up to Your Bonddy Account - Bonddy",
};

export default function SignUpLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
