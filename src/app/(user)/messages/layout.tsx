import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Message - Bonddy",
};

export default function BuddyMessagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-[calc(100svh-4rem-2rem)] min-h-0 max-h-[calc(100svh-4rem-2rem)] flex-1 overflow-hidden overscroll-none md:h-[calc(100svh-4rem-3rem)] md:max-h-[calc(100svh-4rem-3rem)]">
      {children}
    </div>
  );
}
