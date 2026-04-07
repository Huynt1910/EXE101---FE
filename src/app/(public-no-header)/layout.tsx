import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Bonddy checkout",
};

export default function PublicNoHeaderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="min-h-screen">{children}</main>
    </>
  );
}