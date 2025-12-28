import Link from "next/link";
import Image from "next/image";
import AuthImage from "./components/auth-image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-[100svh]">
      <div className="grid min-h-[100svh] lg:grid-cols-10">
        {/* LEFT*/}
        <section className="relative flex flex-col lg:col-span-5">
          {/* Logo top-left */}
          <div className="absolute left-6 top-6 md:left-10 md:top-10 z-10">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={100}
                height={100}
                priority
                className="rounded-md"
              />
            </Link>
          </div>

          {/* Center form */}
          <div className="flex flex-1 items-center justify-center px-6 md:px-10">
            <div className="w-full max-w-md">{children}</div>
          </div>
        </section>

        {/* RIGHT */}
        <section className="hidden lg:block lg:col-span-5">
          <div className="h-full">
            <AuthImage />
          </div>
        </section>
      </div>
    </main>
  );
}
