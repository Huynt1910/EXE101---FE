import "./globals.css";
import NavMenu from "@/components/share/navMenu";
import Footer from "@/components/share/footer";
import { headers } from "next/headers";
import ScrollToTop from "@/components/share/scroll-to-top";
import AppProviders from "@/components/share/AppProviders";
import { Be_Vietnam_Pro } from "next/font/google";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isHomePage = pathname === "/";

  return (
    <html className={`${beVietnam.variable} [--font-heading:var(--font-body)]`}>
      <body className="bg-background text-foreground">
        <AppProviders>
          <ScrollToTop />
          <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
            <NavMenu />
          </header>

          <main className="min-h-screen">{children}</main>

          {/* <footer>
            <Footer />
          </footer> */}
        </AppProviders>
      </body>
    </html>
  );
}
