import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((request) => {
  const { nextUrl } = request;
  const session = request.auth;

  const isAdminRoute =
    nextUrl.pathname.startsWith("/admin");

  const isAccountRoute =
    nextUrl.pathname.startsWith("/account");

  const isCheckoutRoute =
    nextUrl.pathname.startsWith("/checkout");

  const isLoginRoute =
    nextUrl.pathname === "/login";

  const isLoggedIn = Boolean(session?.user);

  // Admin protection
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL("/login", nextUrl)
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.redirect(
        new URL("/", nextUrl)
      );
    }
  }

  // User account protection
  if (
    (isAccountRoute || isCheckoutRoute) &&
    !isLoggedIn
  ) {
    return NextResponse.redirect(
      new URL(
        `/login?callbackUrl=${encodeURIComponent(
          nextUrl.pathname
        )}`,
        nextUrl
      )
    );
  }

  // Logged-in users don't need login page
  if (isLoginRoute && isLoggedIn) {
    const destination =
      session.user.role === "ADMIN"
        ? "/admin"
        : "/";

    return NextResponse.redirect(
      new URL(destination, nextUrl)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/account/:path*",
    "/checkout/:path*",
    "/login",
  ],
};