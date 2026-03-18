import type React from 'react';
import type { Metadata } from 'next';
import '@/app/globals.css';
import HeaderBuddy from '@/components/layouts/HeaderBuddy';

export const metadata: Metadata = {
  title: 'Buddy dashboard and customer management | Bonddy',
  description: 'Manage trip requests, messages, and traveler relationships in Bonddy.',
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
