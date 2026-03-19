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
      <main className="min-h-screen">{children}</main>
      <Footer/>
    </>
  );
}
