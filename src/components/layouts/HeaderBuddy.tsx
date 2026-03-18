'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BuildingIcon,
  CalendarIcon,
  ClockIcon,
  HeartIcon,
  House,
  LayoutDashboardIcon,
  Menu,
  MenuIcon,
  MessageSquare,
  PlusIcon,
  UserCircleIcon,
  UsersIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedTabs from '@/components/common/AnimatedTabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const MOCK_USER = {
  name: 'Host',
  email: 'host@example.com',
  avatar: '',
  phone: '0900000000',
};

const MOCK_HAS_UNREAD = false;
const MOCK_DISPLAY_COUNT = 0;

const mobileNavItems = [
  {
    icon: LayoutDashboardIcon,
    label: 'Overview',
    href: '/buddy',
    match: (pathname: string | null) => pathname === '/buddy' || pathname === '/buddy/',
  },
  {
    icon: House,
    label: 'Trips',
    href: '/buddy/trip-requests',
    match: (pathname: string | null) => Boolean(pathname?.startsWith('/buddy/trip-requests')),
  },
  {
    icon: UsersIcon,
    label: 'Customers',
    href: '/buddy/lead',
    match: (pathname: string | null) => Boolean(pathname?.startsWith('/buddy/lead')),
  },
  {
    icon: MessageSquare,
    label: 'Messages',
    href: '/buddy/messages',
    match: (pathname: string | null) => Boolean(pathname?.startsWith('/buddy/messages')),
  },
];

const accountLinks = [
  { href: '/myrevo?tab=saved-homes', label: 'Saved homes', icon: HeartIcon },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/myrevo?tab=account-settings', label: 'Profile', icon: UserCircleIcon },
  { href: '/myrevo?tab=manage-tours', label: 'Appointments', icon: CalendarIcon },
  { href: '/myrevo?tab=recently-viewed', label: 'Recently viewed', icon: ClockIcon },
];

const hostLinks = [
  { href: '/hosting/property/new', label: 'Create property listing', icon: PlusIcon },
  { href: '/hosting/property', label: 'Manage properties', icon: BuildingIcon },
  { href: '/hosting', label: 'Overview', icon: LayoutDashboardIcon },
  { href: '/hosting/lead', label: 'Manage customers', icon: UsersIcon },
];

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

function AccountMenu({
  logout,
  hasUnread,
  displayCount,
}: {
  logout: () => void;
  hasUnread: boolean;
  displayCount: number;
}) {
  return (
    <DropdownMenuContent className="w-[17rem] shadow-2xl" align="end" forceMount>
      <DropdownMenuGroup className="space-y-1 p-2">
        {accountLinks.map((item) => (
          <DropdownMenuItem key={item.label} asChild>
            <Link href={item.href} className="cursor-pointer">
              <item.icon className="mr-1 h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
              {item.label === 'Messages' && hasUnread ? (
                <span className="ml-auto flex h-4 min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white">
                  {displayCount}
                </span>
              ) : null}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuGroup>

      <DropdownMenuSeparator className="mx-4 my-0 h-[1.5px] bg-gray-200" />

      <DropdownMenuGroup className="space-y-2 p-2">
        {hostLinks.map((item) => (
          <DropdownMenuItem key={item.label} asChild>
            <Link href={item.href} className="cursor-pointer">
              <item.icon className="mr-1 h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuGroup>

      <DropdownMenuSeparator className="mx-4 my-0 h-[1.5px] bg-gray-200" />

      <DropdownMenuGroup className="space-y-2 p-2">
        <DropdownMenuItem asChild>
          <Link href="/" className="cursor-pointer">
            <span className="text-sm font-medium">Switch to traveler view</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>

      <DropdownMenuSeparator className="mx-4 my-0 h-[1.5px] bg-gray-200" />

      <DropdownMenuGroup className="space-y-2 p-2">
        <DropdownMenuItem onClick={logout} className="cursor-pointer">
          <span className="text-sm font-medium">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
}

function BottomNavigation() {
  const isAuthenticated = true;
  const logout = () => undefined;
  const pathname = usePathname();
  const [isAccountOpen, setIsAccountOpen] = React.useState(false);
  const [isNavVisible, setIsNavVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);
  const hasUnread = MOCK_HAS_UNREAD;
  const displayCount = MOCK_DISPLAY_COUNT;
  const initials = getInitials(MOCK_USER.name);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY <= 10) {
        setIsNavVisible(true);
      } else if (currentY > lastScrollY) {
        setIsNavVisible(false);
      } else {
        setIsNavVisible(true);
      }
      setLastScrollY(currentY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 shadow-lg backdrop-blur-sm md:hidden"
      initial={{ y: 0, opacity: 1 }}
      animate={{
        y: isNavVisible ? 0 : 120,
        opacity: isNavVisible ? 1 : 0.8,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 35,
        mass: 0.8,
      }}
      style={{ willChange: 'transform, opacity' }}
    >
      <div className="flex items-center justify-around py-1">
        {mobileNavItems.map((item) => {
          const active = item.match(pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 rounded-lg p-1 transition-colors"
            >
              <item.icon
                className={`size-6 stroke-[1.5] ${active ? 'text-red-500' : 'text-muted-foreground'}`}
              />
              <span
                className={`text-[0.62rem] ${active ? 'font-medium text-red-500' : 'font-light text-muted-foreground'}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {isAuthenticated ? (
          <DropdownMenu open={isAccountOpen} onOpenChange={setIsAccountOpen}>
            <DropdownMenuTrigger asChild>
              <div className="flex cursor-pointer flex-col items-center gap-1 rounded-lg p-1 transition-colors hover:bg-gray-50">
                <Avatar className="size-7">
                  <AvatarImage src={MOCK_USER.avatar} alt={MOCK_USER.name} className="object-cover" />
                  <AvatarFallback className="bg-red-500/10 text-[0.60rem] text-red-500">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[0.60rem] font-light text-muted-foreground">Account</span>
              </div>
            </DropdownMenuTrigger>
            <AccountMenu
              logout={logout}
              hasUnread={hasUnread}
              displayCount={displayCount}
            />
          </DropdownMenu>
        ) : null}
      </div>
    </motion.div>
  );
}

export default function HeaderBuddy() {
  const isAuthenticated = true;
  const logout = () => undefined;
  const hasUnread = MOCK_HAS_UNREAD;
  const displayCount = MOCK_DISPLAY_COUNT;
  const initials = getInitials(MOCK_USER.name);

  return (
    <>
      <header className="sticky top-0 z-50 flex-shrink-0 bg-white text-foreground shadow-sm">
        <div className="hidden items-center px-4 py-2 md:block md:py-4 2xl:px-16">
          <div className="relative hidden items-center justify-between md:flex">
            <div className="flex shrink-0 items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/bonddy_logo.png"
                  alt="Bonddy icon"
                  width={80}
                  height={80}
                  priority
                  className="rounded-md"
                />
              </Link>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2">
              <AnimatedTabs />
            </div>

            <div className="flex shrink-0 items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" className="relative size-12 rounded-full">
                    <Link href="/myrevo?tab=account-settings">
                      <Avatar className="size-12">
                        <AvatarImage
                          src={MOCK_USER.avatar}
                          alt={MOCK_USER.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-[#849cb1] text-[#0d3b66]">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="default"
                        size="icon"
                        className="relative h-12 w-12 rounded-full bg-gray-100 text-black hover:bg-gray-200"
                      >
                        <MenuIcon className="h-5 w-5" />
                        {hasUnread && (
                          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white">
                            {displayCount}
                          </span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <AccountMenu
                      logout={logout}
                      hasUnread={hasUnread}
                      displayCount={displayCount}
                    />
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center gap-2 py-1">
                  <Button asChild variant="ghost" size="default">
                    <Link href="/login?redirect=/">Log in</Link>
                  </Button>
                  <Button
                    asChild
                    variant="default"
                    size="default"
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <Link href="/login?redirect=/hosting/property/new">Create listing</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-3 md:hidden">
          <Link href="/" className="flex items-center">
            <Image
              src="/bonddy_logo.png"
              alt="Bonddy icon"
              width={64}
              height={64}
              priority
              className="rounded-md"
            />
          </Link>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-gray-200 bg-white"
            aria-label="Navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <BottomNavigation />
    </>
  );
}
