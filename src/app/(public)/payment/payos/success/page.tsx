import Link from "next/link";
import { CheckCircle2, CreditCard, Home, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";

type PayosSuccessPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSearchParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function formatPaymentStatus(status?: string, isCancelled?: boolean) {
  if (isCancelled) return "Đã hủy";
  if (!status) return "Thành công";
  if (status === "PAID") return "Đã thanh toán";
  return status;
}

export default async function PayosPaymentSuccessPage({
  searchParams,
}: PayosSuccessPageProps) {
  const params = await searchParams;
  const orderCode = getSearchParam(params, "orderCode");
  const transactionId = getSearchParam(params, "id");
  const status = getSearchParam(params, "status");
  const code = getSearchParam(params, "code");
  const isCancelled = getSearchParam(params, "cancel") === "true";
  const isSuccess = !isCancelled && status === "PAID";

  const details = [
    { label: "Mã đơn hàng", value: orderCode || "N/A" },
    { label: "Mã giao dịch", value: transactionId || "N/A" },
    { label: "Trạng thái", value: formatPaymentStatus(status, isCancelled) },
    { label: "Mã phản hồi", value: code || "N/A" },
  ];

  return (
    <section className="bg-secondary/30 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-11 w-11" />
        </div>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Thanh toán PayOS thành công
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          {isSuccess
            ? "Gói dịch vụ của bạn đã được ghi nhận thanh toán. Bạn có thể quay lại Bonddy để tiếp tục sử dụng dịch vụ."
            : "Bonddy đã nhận được phản hồi từ PayOS. Vui lòng kiểm tra lại thông tin giao dịch bên dưới."}
        </p>

        <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-background text-left">
          {details.map((item, index) => (
            <div
              key={item.label}
              className={`flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between ${
                index !== details.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="text-sm font-medium text-muted-foreground">
                {item.label}
              </span>
              <span className="break-all text-base font-semibold text-foreground">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="rounded-2xl px-8">
            <Link href="/">
              <Home className="h-5 w-5" />
              Về trang chủ
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-2xl px-8"
          >
            <Link href="/profile">
              <ReceiptText className="h-5 w-5" />
              Xem gói dịch vụ
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
