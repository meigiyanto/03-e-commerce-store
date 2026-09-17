import { auth, currentUser } from "@clerk/nextjs/server";

export type UserRole = "admin" | "customer";

export async function requireAdmin() {
  const { userId } = await auth();

  if (!userId) {
    return {
      ok: false as const,
      status: 401,
      userId: null,
      role: null,
    };
  }

  const user = await currentUser();

  const role: UserRole =
    user?.publicMetadata?.role === "admin"
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

export async function getUserRole(): Promise<UserRole | null> {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  return user.publicMetadata?.role === "admin"
    ? "admin"
    : "customer";
}

/*
import { auth, currentUser } from "@clerk/nextjs/server";

export type UserRole = "admin" | "customer";

export async function requireAdmin() {
  const { userId } = await auth();

  if (!userId) {
    return {
      ok: false as const,
      status: 401,
      userId: null,
      role: null,
    };
  }

  const user = await currentUser();

  const role: UserRole =
    user?.publicMetadata?.role === "admin"
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
*/