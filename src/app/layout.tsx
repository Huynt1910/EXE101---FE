// src/app/layout.tsx
import "./globals.css";
import AppProviders from "@/components/common/AppProviders";

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal?: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <AppProviders>{children}</AppProviders>
        {modal}
      </body>
    </html>
  );
}
