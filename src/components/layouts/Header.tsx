"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authStore, useAuthStore } from "@/lib/store/authStore";
import { buildAuthUrl, normalizeCallbackUrl } from "@/lib/callback-url";

type HeaderProps = {
  variant?: "default" | "user";
};

export function Header({ variant = "default" }: Readonly<HeaderProps>) {
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

  const isUserHeader = variant === "user";

  const wrapperClassName = isUserHeader
    ? "fixed top-0 left-0 right-0 z-50 border-b border-border bg-white"
    : "fixed top-0 left-0 right-0 z-50 p-6";

  const navClassName = isUserHeader
    ? "w-full"
    : "max-w-7xl mx-auto bg-card backdrop-blur-md border border-border/50 rounded-full shadow-lg";

  const navInnerClassName = "flex items-center shadow-md justify-between h-20 px-6 lg:px-8";

  const mobilePanelClassName = isUserHeader
    ? "md:hidden border-t border-border/50 px-6 py-4 lg:px-8"
    : "md:hidden py-6 px-6 lg:px-8 border-t border-border/50";

  return (
    <>
      <div className={wrapperClassName}>
      <nav className={navClassName}>
        <div className={navInnerClassName}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-accent text-2xl font-normal">
              Bonddy
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isUserHeader ? null : (
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
          )}

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3 pointer-events-auto">
            {isAuthenticated ? (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="rounded-full bg-transparent text-muted-foreground shadow-none hover:bg-transparent hover:text-foreground"
                >
                  <Link
                    href="/messages"
                    className="inline-flex items-center gap-2"
                  >
                    Chat
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  className="rounded-full bg-transparent text-muted-foreground shadow-none hover:bg-transparent hover:text-foreground"
                >
                  <Link
                    href="/trip-request"
                    className="inline-flex items-center gap-2"
                  >
                    Create a trip
                  </Link>
                </Button>

                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button
                      className="inline-flex items-center gap-2 rounded-full  px-2 py-1.5 transition-colors hover:bg-transparent"
                      aria-label="Open account menu"
                    >
                      <span className="inline-flex h-8 w-8 items-center justify-center bg-foreground text-xs font-semibold text-white rounded-sm">
                        {initials}
                      </span>
                      <span className="max-w-28 truncate text-sm font-medium text-muted-foreground hover:text-foreground">
                        {fullName}
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      align="end"
                      sideOffset={24}
                      className="z-50 w-[200px] rounded-2xl border text-md border-black/5 bg-[#efefef] p-3 text-[#5f5f5f] shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
                    >
                      <DropdownMenu.Item asChild>
                        <Link
                          href="/profile"
                          className="block rounded-xl px-4 py-3  leading-none outline-none transition-colors hover:bg-foreground/20 hover:text-foreground"
                        >
                          View profile
                        </Link>
                      </DropdownMenu.Item>

                      <DropdownMenu.Item asChild>
                        <Link
                          href="/messages"
                          className="mt-1 block rounded-xl px-4 py-3  leading-none outline-none transition-colors hover:bg-foreground/20 hover:text-foreground"
                        >
                          Chat
                        </Link>
                      </DropdownMenu.Item>

                      <DropdownMenu.Item asChild>
                        <Link
                          href="/booking"
                          className="block rounded-xl px-4 py-3  leading-none outline-none transition-colors hover:bg-foreground/20 hover:text-foreground"
                        >
                          My trips
                        </Link>
                      </DropdownMenu.Item>

                      <DropdownMenu.Separator className="my-2 h-px bg-black/12" />

                      <DropdownMenu.Item asChild>
                        <Link
                          href="#"
                          className="block rounded-xl px-4 py-3 text-[18  px] leading-none outline-none transition-colors hover:bg-foreground/20 hover:text-foreground"
                        >
                          Help
                        </Link>
                      </DropdownMenu.Item>

                      <DropdownMenu.Item className="rounded-xl px-4 py-3 leading-none outline-none transition-colors hover:bg-foreground/20 hover:text-foreground">
                        <span className="inline-flex items-center gap-1">
                          Currency: USD
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </DropdownMenu.Item>

                      <DropdownMenu.Separator className="my-2 h-px bg-black/12" />

                      <DropdownMenu.Item
                        onSelect={handleLogout}
                        className="rounded-xl px-4 py-3 leading-none outline-none transition-colors hover:bg-foreground/20 hover:text-foreground"
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
                  <Link href={loginHref} scroll={false}>
                    Log in
                  </Link>
                </Button>

                <Button asChild variant="secondary">
                  <Link href={signupHref} scroll={false}>
                    Sign up
                  </Link>
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
          <div className={mobilePanelClassName}>
            <div className="flex flex-col gap-4">
              <Link
                href="#produits"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Find buddies
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
                Blog
              </Link>
              {isAuthenticated ? (
                <>
                  <Button
                    asChild
                    variant="ghost"
                    className="rounded-full w-full mt-4 bg-transparent text-muted-foreground shadow-none hover:bg-transparent hover:text-accent"
                  >
                    <Link href="/messages" onClick={() => setIsOpen(false)}>
                      Chat
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="rounded-full w-full bg-transparent text-muted-foreground shadow-none hover:bg-transparent hover:text-accent"
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
                    <Link
                      href={loginHref}
                      scroll={false}
                      onClick={() => setIsOpen(false)}
                    >
                      Log in
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    className="rounded-full w-full"
                  >
                    <Link
                      href={signupHref}
                      scroll={false}
                      onClick={() => setIsOpen(false)}
                    >
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

      {isUserHeader ? <div aria-hidden className="h-20" /> : null}
    </>
  );
}
