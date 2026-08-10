import type { NextAuthConfig } from "next-auth";

export default {
  pages: {
    signIn: "/login",
  },

  callbacks: {
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;
      const user = auth?.user;

      if (pathname.startsWith("/admin")) {
        return user?.role === "ADMIN";
      }

      if (pathname.startsWith("/account") ||
        pathname.startsWith("/checkout")) {
        return !!user;
      }

      if (pathname === "/login" && user) {
        return Response.redirect(new URL("/", request.url));
      }

      return true;
    },
  },
  providers: []
} satisfies NextAuthConfig;