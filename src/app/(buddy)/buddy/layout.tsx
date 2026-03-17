import type React from 'react';
import type { Metadata } from 'next';
import '@/app/globals.css';
import HeaderBuddy from '@/components/layouts/HeaderBuddy';
//import { Inter } from 'next/font/google';

//const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Quản lý bất động sản và khách hàng trên RevoLand',
  description: 'Quản lý bất động sản và khách hàng trên RevoLand',
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
