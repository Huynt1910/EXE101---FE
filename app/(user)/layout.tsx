import NavMenu from "@/components/common/navMenu";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollToTop />

      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <NavMenu />
      </header>

      <main className="min-h-screen">{children}</main>

      <footer>
        <Footer />
      </footer>
    </>
  );
}
