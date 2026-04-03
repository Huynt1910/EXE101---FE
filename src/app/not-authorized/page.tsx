import Link from "next/link";

type NotAuthorizedPageProps = {
  searchParams?: Promise<{
    from?: string;
    reason?: string;
  }>;
};

export default async function NotAuthorizedPage({
  searchParams,
}: Readonly<NotAuthorizedPageProps>) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const from = resolvedSearchParams?.from;

  return (
    <section className="bg-primary text-primary-foreground">
      <div className="flex min-h-screen">
        <div className="m-auto px-4 text-center">
          <div className="mx-auto max-w-md">
            <div className="font-serif text-[120px] font-semibold leading-none md:text-[180px]">
              403
            </div>
          </div>

          <p className="mb-2 p-2 text-base font-medium text-accent-foreground md:text-lg">
            You are not allowed to access this page
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-block rounded border border-accent-foreground bg-transparent px-4 py-2 text-accent-foreground shadow-lg transition hover:border-transparent hover:bg-accent-foreground hover:text-accent"
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
