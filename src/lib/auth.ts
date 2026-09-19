import { auth, currentUser } from "@clerk/nextjs/server";

export const USER_ROLES = ["admin", "customer"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export type AuthorizationResult =
  | { ok: true; status: 200; userId: string; role: "admin" }
  | { ok: false; status: 401; userId: null; role: null }
  | { ok: false; status: 403; userId: string; role: "customer" };

function getRole(user: Awaited<ReturnType<typeof currentUser>>): UserRole {
  return user?.publicMetadata?.role === "admin"
    ? "admin"
    : "customer";
}

export async function getUserRole(): Promise<UserRole | null> {
  const user = await currentUser();
  return user ? getRole(user) : null;
}

export async function requireAdmin(): Promise<AuthorizationResult> {
  const { userId } = await auth();

  if (!userId) {
    return { ok: false, status: 401, userId: null, role: null };
  }

  const role = getRole(await currentUser());

  if (role !== "admin") {
    return { ok: false, status: 403, userId, role };
  }

  return { ok: true, status: 200, userId, role };
}
