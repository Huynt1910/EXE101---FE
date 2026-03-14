export interface JwtPayload {
  sub?: string;
  email?: string;
  fullName?: string;
  name?: string;
  unique_name?: string;
  role?: string | number;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export interface AuthUser {
  email: string;
  fullName: string;
  role: number | null;
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

function normalizeRole(role: unknown) {
  if (typeof role === "number" && Number.isFinite(role)) return role;
  if (typeof role === "string" && role.trim() !== "") {
    const parsed = Number(role);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
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
    role: normalizeRole(payload.role),
  };
}
