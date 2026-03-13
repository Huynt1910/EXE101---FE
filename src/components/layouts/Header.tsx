"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronRight, Menu, MessageCircle, PlusCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authStore, useAuthStore } from "@/lib/store/authStore";
import { buildAuthUrl, normalizeCallbackUrl } from "@/lib/callback-url";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const callbackUrl = useMemo(() => {
    const query = searchParams.toString();
    return normalizeCallbackUrl(query ? `${pathname}?${query}` : pathname, "/");
  }, [pathname, searchParams]);

  const loginHref = useMemo(
    () => buildAuthUrl("/login", callbackUrl),
    [callbackUrl],
  );
  const signupHref = useMemo(
    () => buildAuthUrl("/signup", callbackUrl),
    [callbackUrl],
  );

  const fullName = useMemo(
    () => user?.fullName ?? user?.email?.split("@")[0] ?? "Account",
    [user?.email, user?.fullName],
  );

  const initials = useMemo(() => {
    const chars = fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? "")
      .join("");

    return chars || "U";
  }, [fullName]);

  const handleLogout = () => {
    authStore.logout();
    setIsOpen(false);
    router.push("/");
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-6">
      <nav className="max-w-7xl mx-auto bg-card backdrop-blur-md border border-border/50 rounded-full shadow-lg">
        <div className="flex items-center justify-between h-20 px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-accent text-2xl font-normal">
              Bonddy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Find Buddies
            </Link>
            <Link
              href="#science"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Science
            </Link>
            <Link
              href="#temoignages"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="#mission"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3 pointer-events-auto">
            {isAuthenticated ? (
              <>
                <Button asChild variant="secondary" className="rounded-full">
                  <Link
                    href="/inbox"
                    className="inline-flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat
                  </Link>
                </Button>

                <Button asChild className="rounded-full">
                  <Link
                    href="/trip-request"
                    className="inline-flex items-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Create a trip
                  </Link>
                </Button>

                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button
                      className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-2 py-1.5 transition-colors hover:bg-muted"
                      aria-label="Open account menu"
                    >
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent">
                        {initials}
                      </span>
                      <span className="max-w-28 truncate text-sm font-medium">
                        {fullName}
                      </span>
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      align="end"
                      sideOffset={10}
                      className="z-50 w-67.5 rounded-3xl border border-border/60 bg-[#ececec] p-3 text-[#5f5f5f] shadow-2xl"
                    >
                      <DropdownMenu.Item asChild>
                        <Link
                          href="/"
                          className="rounded-xl bg-[#d4d4d7] px-4 py-3 text-[34px] outline-none"
                        >
                          Home
                        </Link>
                      </DropdownMenu.Item>

                      <DropdownMenu.Item asChild>
                        <Link
                          href="/inbox"
                          className="mt-1 block rounded-xl px-4 py-3 text-[34px] outline-none hover:bg-black/5"
                        >
                          Messages
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item asChild>
                        <Link
                          href="/booking"
                          className="block rounded-xl px-4 py-3 text-[34px] outline-none hover:bg-black/5"
                        >
                          Tours
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item asChild>
                        <Link
                          href="/profile"
                          className="block rounded-xl px-4 py-3 text-[34px] outline-none hover:bg-black/5"
                        >
                          Account
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item asChild>
                        <Link
                          href="#"
                          className="block rounded-xl px-4 py-3 text-[34px] outline-none hover:bg-black/5"
                        >
                          Wishlist
                        </Link>
                      </DropdownMenu.Item>

                      <DropdownMenu.Separator className="my-2 h-px bg-black/15" />

                      <DropdownMenu.Item asChild>
                        <Link
                          href="#"
                          className="block rounded-xl px-4 py-3 text-[34px] outline-none hover:bg-black/5"
                        >
                          Help
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className="group rounded-xl px-4 py-3 text-[34px] outline-none hover:bg-black/5">
                        <span className="inline-flex items-center gap-1">
                          Currency: USD
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </DropdownMenu.Item>

                      <DropdownMenu.Separator className="my-2 h-px bg-black/15" />

                      <DropdownMenu.Item
                        onSelect={handleLogout}
                        className="rounded-xl px-4 py-3 text-[34px] outline-none hover:bg-black/5"
                      >
                        Log out
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </>
            ) : (
              <>
                <Button asChild>
                  <Link href={loginHref}>Log in</Link>
                </Button>

                <Button asChild variant="secondary">
                  <Link href={signupHref}>Sign up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-6 px-6 lg:px-8 border-t border-border/50">
            <div className="flex flex-col gap-4">
              <Link
                href="#produits"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Products
              </Link>
              <Link
                href="#science"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Science
              </Link>
              <Link
                href="#temoignages"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                href="#mission"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Our Mission
              </Link>
              {isAuthenticated ? (
                <>
                  <Button asChild className="rounded-full w-full mt-4">
                    <Link href="/inbox" onClick={() => setIsOpen(false)}>
                      Chat
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    className="rounded-full w-full"
                  >
                    <Link href="/trip-request" onClick={() => setIsOpen(false)}>
                      Create a trip
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    className="rounded-full w-full"
                  >
                    <Link href="/profile" onClick={() => setIsOpen(false)}>
                      {fullName}
                    </Link>
                  </Button>
                  <Button
                    variant="secondary"
                    className="rounded-full w-full"
                    onClick={handleLogout}
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild className="rounded-full w-full mt-4">
                    <Link href={loginHref} onClick={() => setIsOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    className="rounded-full w-full"
                  >
                    <Link href={signupHref} onClick={() => setIsOpen(false)}>
                      Sign up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
