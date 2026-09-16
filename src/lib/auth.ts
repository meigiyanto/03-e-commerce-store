import { auth } from "@clerk/nextjs/server";

export type UserRole = "admin" | "customer";

type SessionMetadata = {
  role?: string;
};

export async function requireAdmin() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return { ok: false as const, status: 401, userId: null, role: null, };
  }

  const metadata = sessionClaims?.metadata as SessionMetadata | undefined;
  const role: UserRole = metadata?.role === "admin" ? "admin" : "customer";

  if (role !== "admin") {
    return { ok: false as const, status: 403, userId, role, };
  }

  return { ok: true as const, status: 200, userId, role, };
}

/*
import { auth } from "@clerk/nextjs/server";

export type UserRole = "admin" | "customer";

type SessionMetadata = {
  role?: string;
};

export async function requireAdmin() {
  const { userId, sessionClaims } = await auth();

  // Belum login
  if (!userId) {
    return {
      ok: false as const,
      status: 401,
      userId: null,
      role: null,
    };
  }

  const metadata = sessionClaims?.metadata as SessionMetadata | undefined;

  // Default semua user adalah customer
  const role: UserRole =
    metadata?.role === "admin"
      ? "admin"
      : "customer";

  // Bukan admin
  if (role !== "admin") {
    return {
      ok: false as const,
      status: 403,
      userId,
      role,
    };
  }

  // Admin
  return {
    ok: true as const,
    status: 200,
    userId,
    role,
  };
}
*/