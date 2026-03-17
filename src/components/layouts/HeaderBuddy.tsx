'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
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
  UsersIcon,
  HeartIcon,
  CalendarIcon,
  PlusIcon,
  BuildingIcon,
  ClockIcon,
  MenuIcon,
  MessageSquare,
  House,
} from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedTabs from '@/components/common/AnimatedTabs';

const navigationData: Record<string, unknown[]> = {
  default: [],
};

function DropdownContent({ data }: { data: unknown[] }) {
  if (!data || data.length === 0) {
    return <div className="h-2" />;
  }
  return <div className="h-2" />;
}

const MOCK_USER = {
  name: 'Chủ nhà',
  email: 'host@example.com',
  avatar: '',
  phone: '0900000000',
};

const MOCK_HAS_UNREAD = false;
const MOCK_DISPLAY_COUNT = 0;

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Bottom Navigation Component
function BottomNavigation() {
  const isAuthenticated = true;
  const logout = () => undefined;
  const [isAccountOpen, setIsAccountOpen] = React.useState(false);
  const [isNavVisible, setIsNavVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);
  const pathname = usePathname();

  const hasUnread = MOCK_HAS_UNREAD;
  const displayCount = MOCK_DISPLAY_COUNT;

  // Update navigation visibility based on scroll direction
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

  // Define navigation item type
  type NavItem = {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    href: string;
    active?: boolean;
    isAccount?: boolean;
    onClick?: () => void;
  };

  // Get user data from profile response, with fallback for unauthenticated users
  const user =
    isAuthenticated
      ? {
        name: MOCK_USER.name,
        email: MOCK_USER.email,
        avatar: MOCK_USER.avatar,
        phone: MOCK_USER.phone,
      }
      : {
        name: '',
        email: '',
        avatar: '',
        phone: '',
      };

  const initials = getInitials(user.name);

  // Function to check if current path matches navigation item
  /**
   * Determine if the navigation item is active for the current path.
   * Handles exact matching for index ("Tổng quan") and partial for others.
   * This avoids all tabs being active if path includes '/hosting'
   * @param navHref - href of nav item
   */
  const isActiveNavItem = (navHref: string) => {
    if (!pathname) return false;
    // If "Tổng quan", only exact "/hosting" (without trailing slash or further path) is active
    if (navHref === '/hosting') {
      // Match '/hosting' but not '/hosting/...'
      return pathname === '/hosting' || pathname === '/hosting/';
    }
    // For others, startsWith is appropriate
    return pathname.startsWith(navHref);
  };

  const defaultNavItems: NavItem[] = [
    // 1. Trang chủ
    {
      icon: LayoutDashboardIcon,
      label: 'Tổng quan',
      href: '/hosting',
      active: isActiveNavItem('/hosting'),
    },
    // 2. Bài đăng
    {
      icon: House,
      label: 'Trip request',
      href: '/buddy/trip-requests',
      active: isActiveNavItem('/buddy/trip-requests'),
    },
    // 3. Khách hàng
    {
      icon: UsersIcon,
      label: 'Khách hàng',
      href: '/buddy/lead',
      active: isActiveNavItem('/buddy/lead'),
    },
    // 4. Lịch hẹn
    {
      icon: MessageSquare,
      label: 'Tin nhắn',
      href: '/buddy/messages',
      active: isActiveNavItem('/buddy/messages'),
    },
    // 5. Tin nhắn
    {
      icon: Menu,
      label: 'Tài khoản',
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
          y: isNavVisible ? 0 : 120,
          opacity: isNavVisible ? 1 : 0.8,
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
              {item.isAccount && isAuthenticated ? (
                <DropdownMenu open={isAccountOpen} onOpenChange={setIsAccountOpen}>
                  <DropdownMenuTrigger asChild>
                    <div className="flex flex-col items-center gap-1 p-1 rounded-lg transition-colors hover:bg-gray-50 cursor-pointer">
                      <Avatar className="size-7">
                        <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
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
                    <DropdownMenuGroup className="p-2 space-y-1">
                      <DropdownMenuItem asChild>
                        <Link href="/myrevo?tab=saved-homes" className="cursor-pointer">
                          <HeartIcon className="mr-1 h-5 w-5" />
                          <span className="text-sm font-medium">Danh sách yêu thích</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/messages" className="cursor-pointer relative">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Tin nhắn
                          {hasUnread ? (
                            <span className="ml-auto bg-red-500 text-white text-xs rounded-full min-w-[18px] h-4 flex items-center justify-center px-1 font-medium">
                              {displayCount}
                            </span>
                          ) : null}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/myrevo?tab=account-settings" className="cursor-pointer">
                          <UserCircleIcon className="mr-1 h-5 w-5" />
                          <span className="text-sm font-medium">Hồ sơ</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link href="/myrevo?tab=manage-tours" className="cursor-pointer">
                          <CalendarIcon className="mr-1 h-5 w-5" />
                          <span className="text-sm font-medium">Lịch hẹn</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/myrevo?tab=recently-viewed" className="cursor-pointer">
                          <ClockIcon className="mr-1 h-5 w-5" />
                          <span className="text-sm font-medium">Đã xem</span>
                        </Link>
                      </DropdownMenuItem>

                      {/* <DropdownMenuItem asChild>
                          <Link href="/services/find-roommate" className="cursor-pointer">
                            <Handshake className="mr-2 h-4 w-4" />Ở ghép
                          </Link>
                        </DropdownMenuItem> */}
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="mx-4 h-[1.5px] bg-gray-200 my-0" />
                    <DropdownMenuGroup className="p-2 space-y-2">
                      <DropdownMenuItem asChild>
                        <Link href="/hosting/property/new" className="cursor-pointer">
                          <PlusIcon className="mr-1 h-5 w-5" />
                          <span className="text-sm font-medium">Đăng tin bất động sản</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/hosting/property" className="cursor-pointer">
                          <BuildingIcon className="mr-1 h-5 w-5" />
                          <span className="text-sm font-medium">Quản lý bất động sản</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="mx-4 h-[1.5px] bg-gray-200 my-0" />

                    <DropdownMenuGroup className="p-2 space-y-2">
                      <DropdownMenuItem asChild>
                        <Link href="/hosting" className="cursor-pointer">
                          <LayoutDashboardIcon className="mr-1 h-5 w-5" />
                          <span className="text-sm font-medium">Tổng quan</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/hosting/lead" className="cursor-pointer">
                          <UsersIcon className="mr-1 h-5 w-5" />
                          <span className="text-sm font-medium">Quản lý khách hàng</span>
                        </Link>
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem asChild>
                        <Link href="/hosting/sales" className="cursor-pointer">
                          <TrendingUpIcon className="mr-1 h-5 w-5" />
                          <span className="text-sm font-medium">Quản lý giao dịch</span>
                        </Link>
                      </DropdownMenuItem> */}
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="mx-4 h-[1.5px] bg-gray-200 my-0" />

                    <DropdownMenuGroup className="p-2 space-y-2">
                      {/* <DropdownMenuItem className="cursor-pointer">
                        <Link href="/agents" className="cursor-pointer">
                          <span className="text-sm font-medium">Tìm kiếm môi giới</span>
                        </Link>
                      </DropdownMenuItem> */}
                      <DropdownMenuItem className="cursor-pointer">
                        <Link href="/" className="cursor-pointer">
                          <span className="text-sm font-medium">Chuyển sang khách hàng</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="mx-4 h-[1.5px] bg-gray-200 my-0" />
                    <DropdownMenuGroup className="p-2 space-y-2">
                      <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                        <span className="text-sm font-medium">Đăng xuất</span>
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
  const isAuthenticated = true;
  const logout = () => undefined;
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  // Get unread messages count once at the top level
  const hasUnread = MOCK_HAS_UNREAD;
  const displayCount = MOCK_DISPLAY_COUNT;

  // Get user data from profile response, with fallback for unauthenticated users
  const user =
    isAuthenticated
      ? {
        name: MOCK_USER.name,
        email: MOCK_USER.email,
        avatar: MOCK_USER.avatar,
        phone: MOCK_USER.phone,
      }
      : {
        name: '',
        email: '',
        avatar: '',
        phone: '',
      };

  const initials = getInitials(user.name);

  return (
    <>
      <header
        className={`w-full bg-white text-foreground sticky top-0 z-50 flex-shrink-0 shadow-sm`}
      >
        <div className="hidden md:block items-center px-4 2xl:px-16 py-2 md:py-4">
          {/* Desktop Layout using Flexbox for True Centering */}
          <div className="hidden md:flex items-center justify-between relative">
            {/* Logo Section */}
            <div className="flex items-center flex-shrink-0">
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
            <div className="flex items-center gap-2 flex-shrink-0">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Button variant="ghost" className="relative size-12 rounded-full">
                    <Link href="/myrevo?tab=account-settings">
                      <Avatar className="size-12">
                        <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
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
                        {hasUnread && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 font-medium">
                            {displayCount}
                          </span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[17rem] shadow-2xl" align="end" forceMount>
                      {/* <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.name}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email ? user.email : user.phone}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator /> */}

                      {/* Quick Actions Section */}
                      {/* <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-2 py-1.5">
                        Tin đăng
                      </DropdownMenuLabel> */}
                      <DropdownMenuGroup className="p-2 space-y-1">
                        <DropdownMenuItem asChild>
                          <Link href="/myrevo?tab=saved-homes" className="cursor-pointer">
                            <HeartIcon className="mr-1 h-5 w-5" />
                            <span className="text-sm font-medium">Danh sách yêu thích</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/messages" className="cursor-pointer relative">
                            <MessageSquare className="mr-1 h-5 w-5" />
                            <span className="text-sm font-medium">Tin nhắn</span>
                            {hasUnread ? (
                              <span className="ml-auto bg-red-500 text-white text-xs rounded-full min-w-[18px] h-4 flex items-center justify-center px-1 font-medium">
                                {displayCount}
                              </span>
                            ) : null}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/myrevo?tab=account-settings" className="cursor-pointer">
                            <UserCircleIcon className="mr-1 h-5 w-5" />
                            <span className="text-sm font-medium">Hồ sơ</span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link href="/myrevo?tab=manage-tours" className="cursor-pointer">
                            <CalendarIcon className="mr-1 h-5 w-5" />
                            <span className="text-sm font-medium">Lịch hẹn</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/myrevo?tab=recently-viewed" className="cursor-pointer">
                            <ClockIcon className="mr-1 h-5 w-5" />
                            <span className="text-sm font-medium">Đã xem</span>
                          </Link>
                        </DropdownMenuItem>

                        {/* <DropdownMenuItem asChild>
                          <Link href="/services/find-roommate" className="cursor-pointer">
                            <Handshake className="mr-2 h-4 w-4" />Ở ghép
                          </Link>
                        </DropdownMenuItem> */}
                      </DropdownMenuGroup>

                      <DropdownMenuSeparator className="mx-4 h-[1.5px] bg-gray-200 my-0" />
                      <DropdownMenuGroup className="p-2 space-y-2">
                        <DropdownMenuItem asChild>
                          <Link href="/hosting/property/new" className="cursor-pointer">
                            <PlusIcon className="mr-1 h-5 w-5" />
                            <span className="text-sm font-medium">Đăng tin bất động sản</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/hosting/property" className="cursor-pointer">
                            <BuildingIcon className="mr-1 h-5 w-5" />
                            <span className="text-sm font-medium">Quản lý bất động sản</span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>

                      <DropdownMenuSeparator className="mx-4 h-[1.5px] bg-gray-200 my-0" />

                      <DropdownMenuGroup className="p-2 space-y-2">
                        <DropdownMenuItem asChild>
                          <Link href="/hosting" className="cursor-pointer">
                            <LayoutDashboardIcon className="mr-1 h-5 w-5" />
                            <span className="text-sm font-medium">Tổng quan</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/hosting/lead" className="cursor-pointer">
                            <UsersIcon className="mr-1 h-5 w-5" />
                            <span className="text-sm font-medium">Quản lý khách hàng</span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>

                      <DropdownMenuSeparator className="mx-4 h-[1.5px] bg-gray-200 my-0" />

                      <DropdownMenuGroup className="p-2 space-y-2">
                        {/* <DropdownMenuItem asChild>
                          <Link href="/agents" className="cursor-pointer">
                            <span className="text-sm font-medium">Tìm kiếm môi giới</span>
                          </Link>
                        </DropdownMenuItem> */}
                        <DropdownMenuItem asChild>
                          <Link href="/" className="cursor-pointer">
                            <span className="text-sm font-medium">Chuyển sang khách hàng</span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator className="mx-4 h-[1.5px] bg-gray-200 my-0" />
                      <DropdownMenuGroup className="p-2 space-y-2">
                        <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                          <span className="text-sm font-medium">Đăng xuất</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center gap-2 py-1">
                  <Button asChild variant="ghost" size="default" className="max-md:hidden">
                    <Link href="/login?redirect=/">Đăng nhập</Link>
                  </Button>
                  <Button
                    asChild
                    variant="default"
                    size="default"
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <Link href="/login?redirect=/hosting/property/new">Đăng tin</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Dropdown - Auto height content */}
      {activeDropdown && (
        <div
          className="fixed left-0 right-0 z-[60] bg-white/85 backdrop-blur-lg pointer-events-none md:!top-28"
          style={{
            top: '80px', // Height of header on mobile (h-20 = 80px)
            width: '100vw',
            margin: '0',
            padding: '0',
          }}
        >
          {/* Content area that detects mouse leave */}
          <div className="w-full pointer-events-auto" onMouseLeave={handleMouseLeave}>
            <DropdownContent data={navigationData[activeDropdown as keyof typeof navigationData]} />
          </div>
        </div>
      )}

      {/* Bottom Navigation for Mobile */}
      <BottomNavigation />
    </>
  );
}
