// src/app/layout.tsx
import AppProviders from "@/lib/provider/appProviders";
import { NavigationProgressProvider } from "@/lib/provider/navigationProgressProvider";
import "./globals.css";

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal?: React.ReactNode;
}>) {
  return (
    <html lang="vi">
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
