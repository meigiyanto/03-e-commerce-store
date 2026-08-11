import { verifyWebhook } from "@clerk/backend/webhooks";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const event = await verifyWebhook(request);

    if (
      event.type !== "user.created" &&
      event.type !== "user.updated"
    ) {
      return new Response("Event ignored", {
        status: 200,
      });
    }

    const user = event.data;

    const clerkId = user.id;

    const email =
      user.email_addresses?.find(
        (email) => email.id === user.primary_email_address_id
      )?.email_address ??
      user.email_addresses?.[0]?.email_address;

    if (!email) {
      console.error(
        `Clerk user ${clerkId} does not have an email address`
      );

      return new Response("User has no email address", {
        status: 400,
      });
    }

    const name =
      [user.first_name, user.last_name]
        .filter(Boolean)
        .join(" ") ||
      user.username ||
      null;

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });

    if (existingUser) {
      await prisma.user.update({
        where: {
          clerkId,
        },
        data: {
          email,
          name,
        },
      });
    } else {
      const existingByEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (existingByEmail) {
        await prisma.user.update({
          where: {
            id: existingByEmail.id,
          },
          data: {
            clerkId,
            name,
          },
        });
      } else {
        await prisma.user.create({
          data: {
            clerkId,
            email,
            name,
            role: "USER",
          },
        });
      }
    }

    return new Response("User synchronized", {
      status: 200,
    });
  } catch (error) {
    console.error("Clerk webhook error:", error);

    return new Response("Webhook verification failed", {
      status: 400,
    });
  }
}