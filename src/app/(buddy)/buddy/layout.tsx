import type React from 'react';
import type { Metadata } from 'next';
import '@/app/globals.css';
import HeaderBuddy from '@/components/layouts/HeaderBuddy';

export const metadata: Metadata = {
  title: 'Buddy Operations Dashboard - Bonddy',
  description: 'Buddy Operations Dashboard - Bonddy',
};

export default function HostingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <HeaderBuddy />
      {children}
    </div>
  );
}
