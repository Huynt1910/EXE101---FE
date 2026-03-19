import type React from 'react';
import type { Metadata } from 'next';
import '@/app/globals.css';
import HeaderBuddy from '@/components/layouts/HeaderBuddy';
//import { Inter } from 'next/font/google';

//const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Buddy Dashboard | Manage Trip Requests on Bonddy',
  description: 'Browse trip requests, review traveler details, and manage your buddy activities on Bonddy',
};

export default function HostingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=" ">
      <HeaderBuddy />
      {children}
    </div>
  );
}
