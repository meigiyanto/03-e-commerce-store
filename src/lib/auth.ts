import { auth } from "@clerk/nextjs/server";

export type UserRole = "admin" | "customer";

export async function requireAdmin() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return {
      ok: false as const,
      status: 401,
      userId: null,
      role: null,
    };
  }

  const metadata = sessionClaims?.metadata as
    | { role?: UserRole }
    | undefined;

  const role: UserRole =
    metadata?.role === "admin"
      ? "admin"
      : "customer";

  if (role !== "admin") {
    return {
      ok: false as const,
      status: 403,
      userId,
      role,
    };
  }

  return {
    ok: true as const,
    status: 200,
    userId,
    role,
  };
}