import Link from "next/link";
import { Button } from "@/components/ui/button";

type ActionNoticeProps = {
  title: string;
  buttonText: string;
  href: string;
};

export function ActionNotice({ title, buttonText, href }: ActionNoticeProps) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center">
      <h3 className="text-base font-semibold text-amber-900">{title}</h3>

      <div className="mt-4">
        <Button asChild className="rounded-full">
          <Link href={href}>{buttonText}</Link>
        </Button>
      </div>
    </div>
  );
}
