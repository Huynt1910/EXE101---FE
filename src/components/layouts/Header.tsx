"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHydratedStore } from "@/hooks/useHydratedStore";
import { authStore, useAuthStore } from "@/lib/store/authStore";
import { buildAuthUrl, normalizeCallbackUrl } from "@/lib/callback-url";

type HeaderProps = {
  variant?: "default" | "user";
};

export function Header({ variant = "default" }: Readonly<HeaderProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const isHydrated = useHydratedStore();
  const { isAuthenticated, user } = useAuthStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const canUseAuthenticatedView = isHydrated && isAuthenticated;

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

  const hasBuddyRole = useMemo(
    () => user?.roles?.some((role) => role?.toLowerCase() === "buddy") ?? false,
    [user?.roles],
  );

  const chatHref = useMemo(
    () => (hasBuddyRole ? "/buddy/messages" : "/messages"),
    [hasBuddyRole],
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
    : "max-w-7xl mx-auto bg-card backdrop-blur-md border border-border/50 rounded-4xl shadow-lg";

  const navInnerClassName =
    "flex items-center justify-between h-20 px-6 lg:px-8";

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
                  href="/buddies"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Find buddies
                </Link>
                <Link
                  href="/buddy/apply"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Become a buddy
                </Link>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3 pointer-events-auto">
              {canUseAuthenticatedView ? (
                <>
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
                            My account
                          </Link>
                        </DropdownMenu.Item>

                        <DropdownMenu.Item asChild>
                          <Link
                            href={chatHref}
                            className="mt-1 block rounded-xl px-4 py-3  leading-none outline-none transition-colors hover:bg-foreground/20 hover:text-foreground"
                          >
                            Chat
                          </Link>
                        </DropdownMenu.Item>

                        <DropdownMenu.Item asChild>
                          <Link
                            href="/trip-request"
                            className="block rounded-xl px-4 py-3  leading-none outline-none transition-colors hover:bg-foreground/20 hover:text-foreground"
                          >
                            My trips
                          </Link>
                        </DropdownMenu.Item>

                      {hasBuddyRole ? (
                        <>
                          <DropdownMenu.Separator className="my-2 h-px bg-black/12" />
                          <DropdownMenu.Item asChild>
                            <Link
                              href="/buddy/trip-requests"
                              className="block rounded-xl px-4 py-3  leading-none outline-none transition-colors hover:bg-foreground/20 hover:text-foreground"
                            >
                              Switch to buddy
                            </Link>
                          </DropdownMenu.Item>
                          <DropdownMenu.Separator className="my-2 h-px bg-black/12" />
                        </>
                      ) : (
                        <DropdownMenu.Separator className="my-2 h-px bg-black/12" />
                      )}

                      <DropdownMenu.Item asChild>
                        <Link
                          href="/"
                          className="block rounded-xl px-4 py-3 text-[18  px] leading-none outline-none transition-colors hover:bg-foreground/20 hover:text-foreground"
                        >
                          Privacy policy
                        </Link>
                      </DropdownMenu.Item>

                        <DropdownMenu.Item asChild>
                          <Link
                            href="/"
                            className="block rounded-xl px-4 py-3 text-[18  px] leading-none outline-none transition-colors hover:bg-foreground/20 hover:text-foreground"
                          >
                            Help
                          </Link>
                        </DropdownMenu.Item>

                        <DropdownMenu.Item asChild>
                          <Link
                            href="/"
                            className="rounded-xl px-4 py-3 leading-none outline-none transition-colors hover:bg-foreground/20 hover:text-foreground"
                          >
                            <span className="inline-flex items-center gap-1">
                              Currency
                              <ChevronRight className="h-4 w-4" />
                            </span>
                          </Link>
                        </DropdownMenu.Item>

                        {/* <DropdownMenu.Separator className="my-2 h-px bg-black/12" /> */}

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
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className={mobilePanelClassName}>
              <div className="flex flex-col gap-4">
                {canUseAuthenticatedView ? (
                  <>
                    <Link
                      href="/buddies"
                      className="text-base font-semibold text-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      Find buddies
                    </Link>

                    <Link
                      href="/buddy/apply"
                      className="text-base font-semibold text-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      Become a buddy
                    </Link>

                    <div className="h-px bg-border/60" />

                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground">Manage</p>
                      <div className="mt-3 flex flex-col gap-4">
                        <Link
                          href={chatHref}
                          className="text-base font-semibold text-foreground"
                          onClick={() => setIsOpen(false)}
                        >
                          Chat
                        </Link>
                        <Link
                          href="/trip-request"
                          className="text-base font-semibold text-foreground"
                          onClick={() => setIsOpen(false)}
                        >
                          Create a trip
                        </Link>
                      </div>
                    </div>

                    <div className="h-px bg-border/60" />

                    <div>
                      <p className="text-sm text-muted-foreground">Account</p>
                      <div className="mt-3 flex flex-col gap-4">
                        <Link
                          href="/profile"
                          className="text-base font-semibold text-foreground"
                          onClick={() => setIsOpen(false)}
                        >
                          My account
                        </Link>
                      </div>
                    </div>

                    <div className="h-px bg-border/60" />

                    <div>
                      <p className="text-sm text-muted-foreground">Support</p>
                      <div className="mt-3 flex flex-col gap-4">
                        {hasBuddyRole ? (
                          <>
                            <Link
                              href="/buddy/trip-requests"
                              className="text-base font-semibold text-foreground"
                              onClick={() => setIsOpen(false)}
                            >
                              Buddy dashboard
                            </Link>
                            {/* <Link
                              href="/buddy/apply"
                              className="text-base font-semibold text-foreground"
                              onClick={() => setIsOpen(false)}
                            >
                              Update buddy profile
                            </Link> */}
                          </>
                        ) : (
                          <Link
                            href="/buddy/apply"
                            className="text-base font-semibold text-foreground"
                            onClick={() => setIsOpen(false)}
                          >
                            Become a buddy
                          </Link>
                        )}
                        <Link
                          href="/"
                          className="text-left text-base font-semibold text-foreground"
                          onClick={() => setIsOpen(false)}
                        >
                          Privacy policy
                        </Link>
                        <Link
                          href="/"
                          className="text-left text-base font-semibold text-foreground"
                          onClick={() => setIsOpen(false)}
                        >
                          Help
                        </Link>
                      </div>
                    </div>

                    <div className="h-px bg-border/60" />

                    <div>
                      <Link
                        href="/"
                        className="block w-full text-left text-base font-semibold text-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        Currency
                      </Link>
                    </div>

                    <div className="h-px bg-border/60" />

                    <button
                      type="button"
                      className="w-full text-left text-base font-semibold text-foreground"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/buddies"
                      className="text-base font-semibold text-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      Find buddies
                    </Link>
                    <Link
                      href="/buddy/apply"
                      className="text-base font-semibold text-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      Become a buddy
                    </Link>
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
