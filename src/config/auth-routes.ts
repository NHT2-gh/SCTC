/**
 * Auth route config - optimized for scalability
 */

import { SystemRole } from "@/types/common";
import { APP_ROUTES } from "./app-routes";

export const ROUTES = {
  auth: ["/auth/login", "/auth/sign-up"],
  /**
   * Private route prefixes
   */
  privatePrefixes: ["/admin"],

  /**
   * Public route prefixes
   */
  publicPrefixes: ["/"],

  /**
   * API routes (skip middleware)
   */
  apiPrefixes: ["/api"],

  systemRoleSRoutes: {
    [SystemRole.super_admin]: [APP_ROUTES.ADMIN.BASE],
    [SystemRole.admin]: [APP_ROUTES.ADMIN.BASE],
    [SystemRole.user]: [],
  },
} as const;

/**
 * Default redirects
 */
export const DEFAULT_LOGIN_REDIRECT = APP_ROUTES.ADMIN.BASE;
export const DEFAULT_AUTH_REDIRECT = APP_ROUTES.AUTH.SIGN_IN;
export const DEFAULT_GUEST_REDIRECT = APP_ROUTES.GUEST.ROOT;
/**
 * Check exact match
 */
export function isExactMatch(path: string, routes: readonly string[]) {
  return routes.includes(path);
}

/**
 * Check prefix match
 */
export function isPrefixMatch(path: string, prefixes: readonly string[]) {
  if (isAuthRoute(path)) return false;
  return prefixes.some((prefix) => path.startsWith(prefix));
}

export function isAuthRoute(path: string) {
  return isExactMatch(path, ROUTES.auth);
}

export function isPrivateRoute(path: string) {
  return isPrefixMatch(path, ROUTES.privatePrefixes);
}

export function isApiRoute(path: string) {
  return isPrefixMatch(path, ROUTES.apiPrefixes);
}

export function hasPermission(role: SystemRole, path: string) {
  return ROUTES.systemRoleSRoutes[role].some((prefix) => {
    return path.startsWith(prefix);
  });
}
