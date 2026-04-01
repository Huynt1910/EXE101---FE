import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hasRole } from "@/lib/auth/route-access";

const AUTH_TOKEN_COOKIE = "bonddy_auth_token";
const AUTH_ROLES_COOKIE = "bonddy_auth_roles";

type ServerJwtPayload = {
  exp?: number;
  role?: string | string[];
  roles?: string | string[];
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string | string[];
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"?: string | string[];
};

function normalizeRoleClaims(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .filter((role): role is string => typeof role === "string" && role.trim() !== "")
      .map((role) => role.trim());
  }

  if (typeof value === "string" && value.trim() !== "") {
    return [value.trim()];
  }

  return [] as string[];
}

function decodeBase64Url(input: string) {
  const base64 = input.replaceAll("-", "+").replaceAll("_", "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return Buffer.from(padded, "base64").toString("utf8");
}

function decodeJwtPayload(token?: string) {
  if (!token) return null;

  const payload = token.split(".")[1];
  if (!payload) return null;

  try {
    return JSON.parse(decodeBase64Url(payload)) as ServerJwtPayload;
  } catch {
    return null;
  }
}

function isTokenExpired(payload: ServerJwtPayload | null) {
  if (!payload?.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now;
}

function extractRolesFromToken(payload: ServerJwtPayload | null) {
  if (!payload) return [] as string[];

  return [
    ...normalizeRoleClaims(payload.role),
    ...normalizeRoleClaims(payload.roles),
    ...normalizeRoleClaims(
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
    ),
    ...normalizeRoleClaims(
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"],
    ),
  ].filter((role, index, roles) => roles.indexOf(role) === index);
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

type GuardOptions = {
  pathname: string;
  allowedRoles: string[];
};

export async function requireRouteAccess({
  pathname,
  allowedRoles,
}: Readonly<GuardOptions>) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;
  const payload = decodeJwtPayload(token);
  const hasValidToken = Boolean(token) && !isTokenExpired(payload);

  if (!hasValidToken) {
    redirect(
      `/not-authorized?from=${encodeURIComponent(pathname)}&reason=signin`,
    );
  }

  const rolesFromToken = extractRolesFromToken(payload);
  const rolesFromCookie = parseRolesFromCookie(
    cookieStore.get(AUTH_ROLES_COOKIE)?.value,
  );
  const roles = rolesFromToken.length > 0 ? rolesFromToken : rolesFromCookie;

  if (!allowedRoles.some((role) => hasRole(roles, role))) {
    redirect(`/not-authorized?from=${encodeURIComponent(pathname)}&reason=role`);
  }
}
