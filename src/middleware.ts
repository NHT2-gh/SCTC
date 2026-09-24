import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import {
  isAuthRoute,
  isPrivateRoute,
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_AUTH_REDIRECT,
  DEFAULT_GUEST_REDIRECT,
} from "@/config/auth-routes";
import { supabaseServer } from "./supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  if (pathname.startsWith("/_next") || pathname.includes(".")) {
    return response;
  }

  const supabase = supabaseServer(request, response);

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    // ✅ Logged in → block auth pages

    const isAuthenticated = !!user;
    if (isAuthenticated && isAuthRoute(pathname)) {
      return NextResponse.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, request.url),
      );
    }

    // ❌ Not logged in → block private pages
    if (!isAuthenticated && isPrivateRoute(pathname)) {
      const url = new URL(DEFAULT_AUTH_REDIRECT, request.url);
      url.searchParams.set("returnTo", pathname);
      return NextResponse.redirect(url);
    }
  } catch (error) {
    return NextResponse.redirect(new URL(DEFAULT_GUEST_REDIRECT));
  }

  // ✅ Không redirect bừa nữa
  return response;
}
