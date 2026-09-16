import {clerkMiddleware, createRouteMatcher, } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isAdminRoute(req)) {
    return;
  }

  const { userId, sessionClaims } = await auth();

  // Belum login
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);

    signInUrl.searchParams.set("redirect_url", req.nextUrl.pathname);

    return Response.redirect(signInUrl);
  }

  const metadata = sessionClaims?.metadata as
    | { role?: string }
    | undefined;

  const role = metadata?.role;

  // Bukan admin
  if (role !== "admin") {
    const url = new URL("/", req.url);

    return Response.redirect(url);
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};