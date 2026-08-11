import "server-only";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function syncCurrentUserToDatabase() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const clerkId = clerkUser.id;

  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("Clerk user does not have an email address");
  }

  const name =
    [clerkUser.firstName, clerkUser.lastName]
      .filter(Boolean)
      .join(" ") ||
    clerkUser.username ||
    null;

  const user = await prisma.user.upsert({
    where: {
      clerkId,
    },

    update: {
      email,
      name,
    },

    create: {
      clerkId,
      email,
      name,
      role: "USER",
    },
  });

  return user;
}