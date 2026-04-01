import { Header } from "@/components/layouts/Header";

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="min-h-screen bg-gray-50">{children}</main>
    </>
  );
}
