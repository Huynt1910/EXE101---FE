export type CookieSameSite = "strict" | "lax" | "none";

export interface CookieOptions {
  path?: string;
  maxAge?: number;
  expires?: Date;
  secure?: boolean;
  sameSite?: CookieSameSite;
}

export const cookieConfig = {
  authToken: {
    name: "bonddy_auth_token",
    options: {
      path: "/",
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
    },
  },
  authSession: {
    name: "bonddy_auth_session",
    options: {
      path: "/",
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
    },
  },
};

function isBrowser() {
  return typeof document !== "undefined";
}

export function setCookie(name: string, value: string, options: CookieOptions = {}) {
  if (!isBrowser()) return;

  const parts = [`${name}=${encodeURIComponent(value)}`];

  if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${Math.max(0, Math.floor(options.maxAge))}`);
  }

  if (options.expires) {
    parts.push(`Expires=${options.expires.toUTCString()}`);
  }

  parts.push(`Path=${options.path ?? "/"}`);

  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite}`);
  }

  if (options.secure) {
    parts.push("Secure");
  }

  document.cookie = parts.join("; ");
}

export function getCookie(name: string) {
  if (!isBrowser()) return null;

  const cookieName = `${name}=`;
  const chunks = document.cookie.split(";");

  for (const chunk of chunks) {
    const cookie = chunk.trim();
    if (cookie.startsWith(cookieName)) {
      return decodeURIComponent(cookie.slice(cookieName.length));
    }
  }

  return null;
}

export function removeCookie(name: string, path = "/") {
  setCookie(name, "", {
    path,
    maxAge: 0,
  });
}
