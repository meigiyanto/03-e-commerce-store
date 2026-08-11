import "server-only";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getOrCreateCurrentUser() {
  const clerkUser = await currentUser();

  // console.log("=== CLERK USER ===");
  // console.log(clerkUser);

  if (!clerkUser) {
    console.log("No Clerk user found");
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

  // console.log("=== USER DATA ===");
  // console.log({
  //   clerkId,
  //   email,
  //   name,
  // });

  try {
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

    // console.log("=== PRISMA USER ===");
    // console.log(user);

    return user;
  } catch (error) {
    console.error("=== PRISMA USER ERROR ===");
    console.error(error);

    throw error;
  }
}