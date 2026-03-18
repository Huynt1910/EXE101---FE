'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const tabs = [
  {
    name: 'Overview',
    value: 'overview',
    link: '/buddy',
  },
  {
    name: 'Trip Requests',
    value: 'trip-requests',
    link: '/buddy/trip-requests',
  },
  {
    name: 'Customers',
    value: 'customers',
    link: '/buddy/lead',
  },
  {
    name: 'Appointments',
    value: 'appointments',
    link: '/buddy/appointments',
  },
  {
    name: 'Messages',
    value: 'messages',
    link: '/buddy/messages',
  },
];

const AnimatedTabs = () => {
  const pathname = usePathname();
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [underlineStyle, setUnderlineStyle] = React.useState({ left: 0, width: 0 });

  const getActiveTab = () => {
    if (!pathname) return 'overview';

    const activeTab = tabs.find((tab) => {
      if (tab.link === '/buddy') {
        return pathname === '/buddy' || pathname === '/buddy/';
      }

      return pathname.startsWith(tab.link);
    });

    return activeTab?.value || 'overview';
  };

  const activeTab = getActiveTab();

  React.useLayoutEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.value === activeTab);
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
    <div className="w-full max-w-xl">
      <Tabs value={activeTab} className="gap-4">
        <TabsList className="relative rounded-none bg-white p-0">
          {tabs.map((tab, index) => (
            <Link href={tab.link} key={tab.value}>
              <TabsTrigger
                value={tab.value}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                className="relative z-10 rounded-none border-0 bg-white font-semibold data-[state=active]:bg-white data-[state=active]:shadow-none dark:data-[state=active]:bg-white"
              >
                {tab.name}
              </TabsTrigger>
            </Link>
          ))}

          <motion.div
            className="absolute bottom-0 z-20 h-0.5 bg-primary"
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
      </Tabs>
    </div>
  );
};

export default AnimatedTabs;
