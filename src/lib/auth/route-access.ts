export function hasRole(roles: readonly string[], role: string) {
  return roles.some((item) => item.toLowerCase() === role.toLowerCase());
}

export function getDefaultAuthenticatedPath(roles: readonly string[]) {
  if (hasRole(roles, "Buddy")) {
    return "/buddy";
  }

  if (hasRole(roles, "Admin")) {
    return "/admin";
  }

  return "/";
}

export function resolveAuthenticatedRedirectPath(
  _callbackUrl: string,
  roles: readonly string[],
) {
  return getDefaultAuthenticatedPath(roles);
}

export function isBuddyDashboardPath(pathname: string) {
  return pathname === "/buddy" || pathname.startsWith("/buddy/");
}

export function isBuddyAllowedPath(pathname: string) {
  return isBuddyDashboardPath(pathname) || pathname === "/auth/session-sync";
}

export function isAdminDashboardPath(pathname: string) {
  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/host-dashboard" ||
    pathname.startsWith("/host-dashboard/")
  );
}
