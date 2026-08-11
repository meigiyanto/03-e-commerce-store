import "server-only";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getOrCreateCurrentUser() {
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

  const existingUser = await prisma.user.findUnique({
    where: {
      clerkId,
    },
  });

  if (existingUser) {
    return prisma.user.update({
      where: {
        clerkId,
      },
      data: {
        email,
        name,
      },
    });
  }

  const existingByEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingByEmail) {
    return prisma.user.update({
      where: {
        id: existingByEmail.id,
      },
      data: {
        clerkId,
        name,
      },
    });
  }

  return prisma.user.create({
    data: {
      clerkId,
      email,
      name,
      role: "USER",
    },
  });
}
