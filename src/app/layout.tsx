// src/app/layout.tsx
import AppProviders from "@/lib/provider/appProviders";
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
          {children}
          {modal}
        </AppProviders>
      </body>
    </html>
  );
}
