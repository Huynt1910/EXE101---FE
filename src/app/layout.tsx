// src/app/layout.tsx
import type { Metadata } from "next";
import AppProviders from "@/lib/provider/appProviders";
import { NavigationProgressProvider } from "@/lib/provider/navigationProgressProvider";
import "./globals.css";

const APP_LOGO_PATH = "/logo_bonddy.png";

export const metadata: Metadata = {
  title: "Bonddy - Enjoy Ho Chi Minh City Like a Local",
  icons: {
    icon: APP_LOGO_PATH,
    apple: APP_LOGO_PATH,
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <NavigationProgressProvider>
            {children}
            {modal}
          </NavigationProgressProvider>
        </AppProviders>
      </body>
    </html>
  );
}
