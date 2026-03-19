import { Header } from "@/components/layouts/Header";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header variant="user" />
      <main className="min-h-screen bg-white">{children}</main>
    </>
  );
}
