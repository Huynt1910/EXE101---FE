import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in to Your Bonddy Account - Bonddy",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
