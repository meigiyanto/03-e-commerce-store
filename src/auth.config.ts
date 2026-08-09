import type { NextAuthConfig } from "next-auth";

export default {
  pages: {
    signIn: "/login",
  },

  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const pathname = request.nextUrl.pathname;

      const isAdminRoute = pathname.startsWith("/admin");
      const isAccountRoute = pathname.startsWith("/account");
      const isCheckoutRoute = pathname.startsWith("/checkout");

      if (
        isAdminRoute ||
        isAccountRoute ||
        isCheckoutRoute
      ) {
        return isLoggedIn;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;