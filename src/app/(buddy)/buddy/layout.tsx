import type React from 'react';
import type { Metadata } from 'next';
import '@/app/globals.css';
import HeaderBuddy from '@/components/layouts/HeaderBuddy';
import { requireRouteAccess } from '@/lib/auth/server-route-guard';

export const metadata: Metadata = {
  title: 'Buddy Operations Dashboard - Bonddy',
  description: 'Buddy Operations Dashboard - Bonddy',
};

export default async function HostingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireRouteAccess({
    pathname: "/buddy",
    allowedRoles: ["Buddy", "Admin"],
  });

  return (
    <div>
      <HeaderBuddy />
      {children}
    </div>
  );
}
