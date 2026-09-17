import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Next.js internals dan static files tidak diproses
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    // API routes tetap diproses Clerk
    "/(api|trpc)(.*)",

    // Clerk frontend API
    "/__clerk/(.*)",
  ],
};