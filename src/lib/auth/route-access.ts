export function hasRole(roles: readonly string[], role: string) {
  return roles.some((item) => item.toLowerCase() === role.toLowerCase());
}

export function getDefaultAuthenticatedPath(roles: readonly string[]) {
  if (hasRole(roles, "Admin")) {
    return "/admin";
  }

  if (hasRole(roles, "Buddy")) {
    return "/buddy";
  }

  return "/";
}

export function resolveAuthenticatedRedirectPath(
  callbackUrl: string,
  roles: readonly string[],
) {
  const defaultPath = getDefaultAuthenticatedPath(roles);

  if (callbackUrl === "/" && defaultPath !== "/") {
    return defaultPath;
  }

  return callbackUrl;
}

export function isBuddyDashboardPath(pathname: string) {
  return pathname === "/buddy" || pathname.startsWith("/buddy/");
}

export function isAdminDashboardPath(pathname: string) {
  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/host-dashboard" ||
    pathname.startsWith("/host-dashboard/")
  );
}
