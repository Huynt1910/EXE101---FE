'use client';

import * as React from 'react';

import { motion } from 'framer-motion';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  {
    name: 'Tổng quan',
    value: 'overview',
    link: '/buddy',
  },
  {
    name: 'Trip Request',
    value: 'trip-requests',
    link: '/buddy/trip-requests',
  },
  {
    name: 'Khách hàng',
    value: 'customers',
    link: '/buddy/lead',
  },
  {
    name: 'Lịch hẹn',
    value: 'appointments',
    link: '/buddy/appointments',
  },
  {
    name: 'Tin nhắn',
    value: 'messages',
    link: '/buddy/messages',
  },
];

const AnimatedTabs = () => {
  const pathname = usePathname();
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [underlineStyle, setUnderlineStyle] = React.useState({ left: 0, width: 0 });

  // Determine active tab based on current pathname
  const getActiveTab = () => {
    if (!pathname) return 'overview';

    // Find the tab that matches the current pathname
    const activeTab = tabs.find(tab => {
      if (tab.link === '/buddy') {
        // For overview tab, match exact '/buddy' or '/buddy/'
        return pathname === '/buddy' || pathname === '/buddy/';
      }
      // For other tabs, check if pathname starts with the tab link
      return pathname.startsWith(tab.link);
    });

    return activeTab?.value || 'overview';
  };

  const activeTab = getActiveTab();

  React.useLayoutEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.value === activeTab);
    const activeTabElement = tabRefs.current[activeIndex];

    if (activeTabElement) {
      const { offsetLeft, offsetWidth } = activeTabElement;

      setUnderlineStyle({
        left: offsetLeft,
        width: offsetWidth,
      });
    }
  }, [activeTab]);

  return (
    <div className="w-full max-w-md">
      <Tabs value={activeTab} className="gap-4">
        <TabsList className="bg-white relative rounded-none p-0">
          {tabs.map((tab, index) => (
            <Link href={tab.link} key={tab.value}>
              <TabsTrigger
                value={tab.value}
                ref={el => {
                  tabRefs.current[index] = el;
                }}
                className="bg-white font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-white relative z-10 rounded-none border-0 data-[state=active]:shadow-none"
              >
                {tab.name}
              </TabsTrigger>
            </Link>
          ))}

          <motion.div
            className="bg-primary absolute bottom-0 z-20 h-0.5"
            layoutId="underline"
            style={{
              left: underlineStyle.left,
              width: underlineStyle.width,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 40,
            }}
          />
        </TabsList>

        {/* {tabs.map(tab => (
          <TabsContent key={tab.value} value={tab.value}>
            <p className='text-muted-foreground text-sm'>{tab.content}</p>
          </TabsContent>
        ))} */}
      </Tabs>
    </div>
  );
};

export default AnimatedTabs;
