import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

const articleNavItems = [
  { href: "/places", label: "Places & Tips" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about-us", label: "About Bonddy" },
] as const;

type InfoBlogLayoutProps = {
  currentPath: string;
  eyebrow: string;
  title: string;
  intro: string;
  heroImage: string;
  heroAlt: string;
  heroCaption?: string;
  sidebar: ReactNode;
  children: ReactNode;
};

export default function InfoBlogLayout({
  currentPath,
  eyebrow,
  title,
  intro,
  heroImage,
  heroAlt,
  heroCaption,
  sidebar,
  children,
}: Readonly<InfoBlogLayoutProps>) {
  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <nav className="sticky top-24 z-20 overflow-x-auto rounded-full border border-border/70 bg-card/95 px-3 py-2 shadow-sm backdrop-blur">
          <div className="flex min-w-max items-center gap-2">
            {articleNavItems.map((item) => {
              const isActive = currentPath === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-sm">
            <div className="relative h-80 md:h-[30rem]">
              <Image
                src={heroImage}
                alt={heroAlt}
                fill
                unoptimized
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 space-y-4 p-6 text-primary-foreground md:p-10">
                <Badge className="rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-white">
                  {eyebrow}
                </Badge>
                <div className="max-w-4xl space-y-4">
                  <h1 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">
                    {title}
                  </h1>
                  <p className="max-w-3xl text-base leading-7 text-primary-foreground/85">
                    {intro}
                  </p>
                </div>
              </div>
            </div>

            {heroCaption ? (
              <div className="border-b border-border/70 px-6 py-3 text-xs text-muted-foreground md:px-10">
                {heroCaption}
              </div>
            ) : null}

            <div className="space-y-10 px-6 py-8 md:px-10 md:py-10">
              {children}
            </div>
          </article>

          <aside className="space-y-6">{sidebar}</aside>
        </div>
      </div>
    </main>
  );
}
