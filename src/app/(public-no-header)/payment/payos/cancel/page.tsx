import Link from "next/link";
import { Home, RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type PayosCancelPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSearchParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function PayosPaymentCancelPage({
  searchParams,
}: Readonly<PayosCancelPageProps>) {
  const params = await searchParams;
  const orderCode = getSearchParam(params, "orderCode");

  return (
    <section className="bg-secondary/30 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-4xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
          <XCircle className="h-11 w-11" />
        </div>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          PayOS Payment Cancelled
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          {orderCode
            ? `Order ${orderCode} has not been paid. You can go back to the homepage to select a service package again.`
            : "Your order has not been paid. You can go back to the homepage to select a service package again."}
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="rounded-2xl px-8">
            <Link href="/">
              <RotateCcw className="h-5 w-5" />
              Select Package
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-2xl px-8"
          >
            <Link href="/">
              <Home className="h-5 w-5" />
              Go to Home
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}