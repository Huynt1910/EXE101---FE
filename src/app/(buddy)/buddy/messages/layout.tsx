import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Message - Bonddy",
};

export default function BuddyMessagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
