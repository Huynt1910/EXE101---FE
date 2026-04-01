import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getDefaultAuthenticatedPath,
  hasRole,
  isAdminDashboardPath,
  isBuddyDashboardPath,
} from "@/lib/auth/route-access";

const AUTH_TOKEN_COOKIE = "bonddy_auth_token";
const AUTH_ROLES_COOKIE = "bonddy_auth_roles";

const AUTH_PATHS = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

type MiddlewareJwtPayload = {
  exp?: number;
  role?: string | string[];
  roles?: string[];
};

function decodeBase64Url(input: string) {
  const base64 = input.replaceAll("-", "+").replaceAll("_", "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const decoded = atob(padded);

  return decodeURIComponent(
    decoded
      .split("")
      .map((char) => `%${(char.codePointAt(0) ?? 0).toString(16).padStart(2, "0")}`)
      .join(""),
  );
}

function decodeJwtPayload(token?: string) {
  if (!token) return null;

  const payload = token.split(".")[1];
  if (!payload) return null;

  try {
    const json = decodeBase64Url(payload);
    return JSON.parse(json) as MiddlewareJwtPayload;
  } catch {
    return null;
  }
}

function extractRolesFromToken(payload: MiddlewareJwtPayload | null) {
  if (!payload) return [] as string[];

  const roleClaim = payload.role;
  const rolesClaim = payload.roles;

  let fromRole: string[] = [];
  if (Array.isArray(roleClaim)) {
    fromRole = roleClaim;
  } else if (typeof roleClaim === "string") {
    fromRole = [roleClaim];
  }

  const fromRoles = Array.isArray(rolesClaim) ? rolesClaim : [];

  return [...fromRole, ...fromRoles]
    .filter((role): role is string => typeof role === "string" && role.trim() !== "")
    .map((role) => role.trim());
}

function isTokenExpired(payload: MiddlewareJwtPayload | null) {
  if (!payload?.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now;
}

function parseRolesFromCookie(raw?: string) {
  if (!raw) return [] as string[];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((role): role is string => typeof role === "string" && role.trim() !== "")
      .map((role) => role.trim());
  } catch {
    try {
      const parsed = JSON.parse(decodeURIComponent(raw));
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((role): role is string => typeof role === "string" && role.trim() !== "")
        .map((role) => role.trim());
    } catch {
      return [];
    }
  }
}

function isAuthPath(pathname: string) {
  return AUTH_PATHS.some((path) => pathname.startsWith(path));
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const response = NextResponse.next();

  const rawToken = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  const payload = decodeJwtPayload(rawToken);
  const hasValidToken = Boolean(rawToken) && !isTokenExpired(payload);

  const rolesFromCookie = parseRolesFromCookie(
    request.cookies.get(AUTH_ROLES_COOKIE)?.value,
  );
  const rolesFromToken = extractRolesFromToken(payload);
  const roles = rolesFromToken.length > 0 ? rolesFromToken : rolesFromCookie;

  const isBuddyPath = isBuddyDashboardPath(pathname);
  const isAdminPath = isAdminDashboardPath(pathname);

  if ((isBuddyPath || isAdminPath) && !hasValidToken) {
    const deniedUrl = request.nextUrl.clone();
    deniedUrl.pathname = "/not-authorized";
    deniedUrl.search = "";
    deniedUrl.searchParams.set("from", `${pathname}${search}`);
    deniedUrl.searchParams.set("reason", "signin");
    const redirect = NextResponse.redirect(deniedUrl);
    redirect.cookies.set(AUTH_TOKEN_COOKIE, "", { path: "/", maxAge: 0 });
    redirect.cookies.set(AUTH_ROLES_COOKIE, "", { path: "/", maxAge: 0 });
    return redirect;
  }

  if (isBuddyPath && hasValidToken && !hasRole(roles, "Buddy") && !hasRole(roles, "Admin")) {
    const deniedUrl = request.nextUrl.clone();
    deniedUrl.pathname = "/not-authorized";
    deniedUrl.searchParams.set("from", pathname);
    deniedUrl.searchParams.set("reason", "role");
    return NextResponse.redirect(deniedUrl);
  }

  if (isAdminPath && hasValidToken && !hasRole(roles, "Admin")) {
    const deniedUrl = request.nextUrl.clone();
    deniedUrl.pathname = "/not-authorized";
    deniedUrl.searchParams.set("from", pathname);
    deniedUrl.searchParams.set("reason", "role");
    return NextResponse.redirect(deniedUrl);
  }

  if (isAuthPath(pathname) && hasValidToken) {
    const authenticatedUrl = request.nextUrl.clone();
    authenticatedUrl.pathname = getDefaultAuthenticatedPath(roles);
    authenticatedUrl.search = "";
    return NextResponse.redirect(authenticatedUrl);
  }

  // Thêm pathname vào header để layout có thể detect
  response.headers.set("x-pathname", pathname);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
