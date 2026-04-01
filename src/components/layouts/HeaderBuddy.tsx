'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  UserCircleIcon,
  Menu,
  LayoutDashboardIcon,
  CalendarIcon,
  MenuIcon,
  MessageSquare,
} from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedTabs from '@/components/common/AnimatedTabs';
import { authStore, useAuthStore } from '@/lib/store/authStore';
import { useHydratedStore } from '@/hooks/useHydratedStore';

// Bottom Navigation Component
function BottomNavigation({
  canUseAuthenticatedView,
  initials,
  fullName,
}: Readonly<{
  canUseAuthenticatedView: boolean;
  initials: string;
  fullName: string;
}>) {
  const [isAccountOpen, setIsAccountOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    authStore.logout();
    router.push('/');
  };

  // Define navigation item type
  type NavItem = {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    href: string;
    active?: boolean;
    isAccount?: boolean;
    onClick?: () => void;
  };

  // Function to check if current path matches navigation item
  const isActiveNavItem = (navHref: string) => {
    if (!pathname) return false;
    if (navHref === '/buddy') {
      return pathname === '/buddy' || pathname === '/buddy/';
    }

    return pathname.startsWith(navHref);
  };

  const defaultNavItems: NavItem[] = [
    {
      icon: LayoutDashboardIcon,
      label: 'Overview',
      href: '/buddy',
      active: isActiveNavItem('/buddy'),
    },
    {
      icon: CalendarIcon,
      label: 'Trip requests',
      href: '/buddy/trip-requests',
      active: isActiveNavItem('/buddy/trip-requests'),
    },
    {
      icon: MessageSquare,
      label: 'Messages',
      href: '/buddy/messages',
      active: isActiveNavItem('/buddy/messages'),
    },
    {
      icon: Menu,
      label: 'Account',
      href: '#',
      active: false,
      isAccount: true,
    },
  ];
  return (
    <>
      {/* Bottom Navigation */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 md:hidden shadow-lg"
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 35,
          mass: 0.8,
        }}
        style={{
          willChange: 'transform, opacity',
        }}
      >
        <div className="flex items-center justify-around py-1">
          {defaultNavItems.map((item: NavItem, index: number) => (
            <div key={item.href || `account-${index}`} className="flex flex-col items-center">
              {item.isAccount && canUseAuthenticatedView ? (
                <DropdownMenu open={isAccountOpen} onOpenChange={setIsAccountOpen}>
                  <DropdownMenuTrigger asChild>
                    <div className="flex flex-col items-center gap-1 p-1 rounded-lg transition-colors hover:bg-gray-50 cursor-pointer">
                      <Avatar className="size-7">
                        <AvatarImage src="" alt={fullName} className="object-cover" />
                        <AvatarFallback className="bg-red-500/10 text-red-500 text-[0.60rem]">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[0.60rem] font-light text-muted-foreground">
                        {item.label}
                      </span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 mb-2 mr-2" align="center" side="top">
                    <DropdownMenuGroup className="p-2 space-y-2">
                      <DropdownMenuItem asChild>
                        <Link href="/buddy/messages" className="cursor-pointer">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Messages
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/buddy/trip-requests" className="cursor-pointer">
                          <CalendarIcon className="mr-1 h-5 w-5" />
                          <span className="text-sm font-medium">Trip requests</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          <UserCircleIcon className="mr-1 h-5 w-5" />
                          <span className="text-sm font-medium">My account</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="mx-4 h-[1.5px] bg-gray-200 my-0" />

                    <DropdownMenuGroup className="p-2 space-y-2">
                      <DropdownMenuItem className="cursor-pointer">
                        <Link href="/" className="cursor-pointer">
                          <span className="text-sm font-medium">Switch to User</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="mx-4 h-[1.5px] bg-gray-200 my-0" />
                    <DropdownMenuGroup className="p-2 space-y-2">
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                        <span className="text-sm font-medium">Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href={item.href}
                  className={`flex flex-col items-center gap-1 p-1 rounded-lg transition-colors `}
                >
                  <item.icon
                    className={`size-6 stroke-[1.5] ${item.active ? 'text-red-500' : 'text-muted-foreground'}`}
                  />
                  <span
                    className={`text-[0.62rem] font-light ${item.active ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}
                  >
                    {item.label}
                  </span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}

export default function HeaderHosting() {
  const isHydrated = useHydratedStore();
  const { isAuthenticated, user } = useAuthStore();
  const canUseAuthenticatedView = isHydrated && isAuthenticated;
  const router = useRouter();

  const handleLogout = () => {
    authStore.logout();
    router.push('/');
  };

  const fullName = React.useMemo(
    () => user?.fullName ?? user?.email?.split('@')[0] ?? 'Buddy',
    [user?.email, user?.fullName],
  );

  const initials = React.useMemo(() => {
    const chars = fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? '')
      .join('');

    return chars || 'B';
  }, [fullName]);

  return (
    <>
      <header
        className={`w-full bg-white text-foreground sticky top-0 z-50 shrink-0 shadow-sm`}
      >
        <div className="hidden md:block items-center px-4 2xl:px-16 py-2 md:py-4">
          {/* Desktop Layout using Flexbox for True Centering */}
          <div className="hidden md:flex items-center justify-between relative">
            {/* Logo Section */}
            <div className="flex items-center shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="/bonddy_logo.png"
                  alt="Bonddy icon"
                  width={80}
                  height={80}
                  priority
                  className="rounded-md"
                />
                {/* <span className="xl:block hidden text-2xl font-medium text-red-500">Bonddy</span> */}
              </Link>
            </div>

            {/* Centered Search Autocomplete */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <AnimatedTabs />
            </div>

            {/* Auth Buttons Section */}
            <div className="flex items-center gap-2 shrink-0">
              {canUseAuthenticatedView ? (
                <div className="flex items-center gap-4">
                  <Button variant="ghost" className="relative size-12 rounded-full">
                    <Link href="/profile">
                      <Avatar className="size-12">
                        <AvatarImage src="" alt={fullName} className="object-cover" />
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
                        className="max-md:hidden rounded-full bg-gray-100 hover:bg-gray-200 text-black h-12 w-12 relative"
                      >
                        <MenuIcon className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-68 shadow-2xl" align="end" forceMount>
                      <DropdownMenuGroup className="p-2 space-y-1">
                        <DropdownMenuItem asChild>
                          <Link href="/buddy" className="cursor-pointer">
                            <LayoutDashboardIcon className="mr-1 h-5 w-5" />
                            <span className="text-sm font-medium">Overview</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/buddy/messages" className="cursor-pointer">
                            <MessageSquare className="mr-1 h-5 w-5" />
                            <span className="text-sm font-medium">Messages</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/buddy/trip-requests" className="cursor-pointer">
                            <CalendarIcon className="mr-1 h-5 w-5" />
                            <span className="text-sm font-medium">Trip requests</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/profile" className="cursor-pointer">
                            <UserCircleIcon className="mr-1 h-5 w-5" />
                            <span className="text-sm font-medium">My account</span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>

                      <DropdownMenuSeparator className="mx-4 h-[1.5px] bg-gray-200 my-0" />
                      <DropdownMenuGroup className="p-2 space-y-2">
                        <DropdownMenuItem className="cursor-pointer" asChild>
                          <Link href="/" className="cursor-pointer">
                            <span className="text-sm font-medium">Switch to User</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                          <span className="text-sm font-medium">Logout</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation for Mobile */}
      <BottomNavigation
        canUseAuthenticatedView={canUseAuthenticatedView}
        initials={initials}
        fullName={fullName}
      />
    </>
  );
}
