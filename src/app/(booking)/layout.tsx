import { Footer } from "@/components/layouts/footer";
import { Header } from "@/components/layouts/header";

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
