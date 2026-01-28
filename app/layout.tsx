import "./globals.css";
import AppProviders from "@/components/AppProviders";
import { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";



export const metadata: Metadata = {
  metadataBase: new URL("https://bonddy.vercel.app"),

  title: {
    default: "Saigon Travel Companion & Local Buddy - Bonddy",
    template: "%s - Bonddy",
  },

  description:
    "Explore Ho Chi Minh City with a trusted local buddy. Personalized routes, food spots, culture tips, and friendly support for foreigners—flexible by hour or day.",

  keywords: [
    "Saigon travel buddy",
    "Ho Chi Minh City tour guide",
    "local companion Vietnam",
    "travel with locals",
    "Vietnam tour buddy",
    "HCMC local guide",
  ],

  authors: [{ name: "Bonddy Team" }],

  openGraph: {
    type: "website",
    siteName: "Bonddy",
    title: "Saigon Travel Companion & Local Buddy - Bonddy",
    description:
      "Explore Ho Chi Minh City with a trusted local buddy. Personalized routes, food spots, culture tips, and friendly support for foreigners—flexible by hour or day.",
    images: [
      {
        url: "/logo_bonddy.png",
        width: 2300,
        height: 930,
        alt: "Bonddy - Your Saigon Travel Companion",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Saigon Travel Companion & Local Buddy - Bonddy",
    description:
      "Explore Ho Chi Minh City with a trusted local buddy. Personalized routes, food spots, culture tips, and friendly support for foreigners—flexible by hour or day.",
    images: ["/logo_bonddy.png"],
  },

  icons: {
    icon: "/logo_bonddy.png",
    shortcut: "/logo_bonddy.png",
    apple: "/logo_bonddy.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};


export const viewport = {
  width: "device-width",
  initialScale: 1,
};

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${beVietnam.variable} [--font-heading:var(--font-body)]`}>
      <body className="bg-background text-foreground">
        <AppProviders>
          <main className="min-h-screen">
            {children}
            {modal}
          </main>
        </AppProviders>
      </body>
    </html>
  );
}
