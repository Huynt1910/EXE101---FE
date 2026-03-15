import { Footer } from "@/components/layouts/Footer";
import { Header } from "@/components/layouts/Header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="booking-layout pt-16 md:pt-20">{children}</div>
      <Footer />
    </>
  );
}
