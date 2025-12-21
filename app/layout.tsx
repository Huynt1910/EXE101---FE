import "./globals.css";
import NavMenu from "@/components/common/navMenu";
import Footer from "@/components/Footer";
import { headers } from "next/headers";
import ScrollToTop from "@/components/ScrollToTop";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isHomePage = pathname === "/";

  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <ScrollToTop />
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
          <NavMenu />
        </header>

        <main className="min-h-screen">{children}</main>

        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
