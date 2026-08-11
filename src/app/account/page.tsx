import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateCurrentUser } from "@/lib/user";

export default async function AccountPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/login");
  }

  // Pastikan user Clerk juga tersedia di database Prisma
  const dbUser = await getOrCreateCurrentUser();

  if (!dbUser) {
    redirect("/login");
  }

  const name =
    clerkUser.firstName ||
    clerkUser.username ||
    "User";

  const email =
    clerkUser.primaryEmailAddress?.emailAddress ||
    "-";

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-slate-950">
        My Account
      </h1>

      <div className="mt-6 space-y-3">
        <p>
          <strong>Name:</strong> {name}
        </p>

        <p>
          <strong>Email:</strong> {email}
        </p>

        <p>
          <strong>Database ID:</strong> {dbUser.id}
        </p>

        <p>
          <strong>Role:</strong> {dbUser.role}
        </p>
      </div>
    </main>
  );
}