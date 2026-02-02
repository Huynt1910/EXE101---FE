export function normalizeCallbackUrl(input?: string | null, fallback = "/") {
  if (!input) return fallback;

  // 1) Chỉ cho phép internal path (bắt đầu bằng "/")
  // Chặn: "https://evil.com", "javascript:...", "ftp:..."
  if (!input.startsWith("/")) return fallback;

  // 2) Chặn protocol-relative URLs: "//evil.com"
  if (input.startsWith("//")) return fallback;

  // 3) (Optional nhưng nên có) Chặn loop quay lại auth routes
  // Tránh case: callbackUrl=/login -> login xong lại về login
  const blockedPrefixes = ["/login", "/signup", "/forgot-password"];
  if (blockedPrefixes.some((p) => input.startsWith(p))) return fallback;

  return input;
}

export function buildAuthUrl(
  path: "/login" | "/signup" | "/forgot-password",
  callbackUrl: string
) {
  return `${path}?callbackUrl=${encodeURIComponent(callbackUrl)}`;
}
