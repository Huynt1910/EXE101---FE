import "./globals.css";
import AppProviders from "@/components/share/AppProviders";
import { Be_Vietnam_Pro } from "next/font/google";
import { PortfolioNavbar } from "@/components/share/navMenu";
import { Footer } from "@/components/share/footer";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${beVietnam.variable} [--font-heading:var(--font-body)]`}>
      <body className="bg-background text-foreground">
        <AppProviders>
          <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
            <PortfolioNavbar />
          </header>

          <main className="min-h-screen">{children}</main>

          <footer>
            <Footer />
          </footer>
        </AppProviders>
      </body>
    </html>
  );
}
