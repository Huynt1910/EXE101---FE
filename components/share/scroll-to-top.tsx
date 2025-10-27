"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // cuộn về đầu trang khi đổi route hoặc query
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, searchParams]);

  return null;
}
