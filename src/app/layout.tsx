// src/app/layout.tsx
import "./globals.css";
import AppProviders from "@/components/common/AppProviders";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
