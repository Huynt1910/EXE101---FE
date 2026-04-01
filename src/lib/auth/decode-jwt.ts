export interface JwtPayload {
  sub?: string;
  nameid?: string;
  userId?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid"?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string | string[];
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"?: string | string[];
  email?: string;
  fullName?: string;
  name?: string;
  unique_name?: string;
  role?: string | string[] | number;
  roles?: string | string[];
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export interface AuthUser {
  email: string;
  fullName: string;
  roles: string[];
}

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
  const decoded = globalThis.atob(padded);

  return decodeURIComponent(
    decoded
      .split("")
      .map((char) => `%${(char.codePointAt(0) ?? 0).toString(16).padStart(2, "0")}`)
      .join(""),
  );
}

export function decodeJwtPayload(token?: string | null): JwtPayload | null {
  if (!token) return null;

  const payload = token.split(".")[1];
  if (!payload) return null;

  try {
    const json = decodeBase64Url(payload);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function extractJwtUserId(payload: JwtPayload | null): string | undefined {
  if (!payload) return undefined;

  const candidates = [
    payload.sub,
    payload.nameid,
    payload.userId,
    payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid"],
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim() !== "") {
      return candidate;
    }
  }

  return undefined;
}

export function extractJwtRoles(payload: JwtPayload | null) {
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

export function mapJwtPayloadToUser(payload: JwtPayload | null): AuthUser | null {
  if (!payload) return null;

  let email: string | null = null;
  if (typeof payload.email === "string" && payload.email.trim() !== "") {
    email = payload.email;
  } else if (typeof payload.sub === "string" && payload.sub.includes("@")) {
    email = payload.sub;
  }

  if (!email) return null;

  let fullName = email.split("@")[0];
  if (typeof payload.fullName === "string" && payload.fullName.trim() !== "") {
    fullName = payload.fullName;
  } else if (typeof payload.unique_name === "string" && payload.unique_name.trim() !== "") {
    fullName = payload.unique_name;
  } else if (typeof payload.name === "string" && payload.name.trim() !== "") {
    fullName = payload.name;
  }

  return {
    email,
    fullName,
    roles: extractJwtRoles(payload),
  };
}
