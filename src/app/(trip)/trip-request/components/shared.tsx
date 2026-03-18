import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 text-sm text-red-600">{message}</p>;
}

export function ChoiceChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted/40",
      )}
    >
      {children}
    </button>
  );
}
