import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/utils/constants";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const sessionToken = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isProtectedRoute = pathname.startsWith("/account") || pathname.startsWith("/checkout") || pathname.startsWith("/admin");

  if (isProtectedRoute && !sessionToken) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin") && sessionToken !== "admin") {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/checkout/:path*"],
};
