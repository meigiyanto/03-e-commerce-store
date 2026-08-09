import { auth } from "@/auth";

export default auth;

export const config = {
  matcher: [
    "/admin/:path*",
    "/account/:path*",
    "/checkout/:path*",
    "/login",
  ],
};