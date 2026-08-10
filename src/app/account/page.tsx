import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const user = await currentUser();

  if (!user) {
    redirect("/login");
  }

  const name =
    user.firstName ||
    user.username ||
    "User";

  const email =
    user.emailAddresses[0]?.emailAddress ||
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
      </div>
    </main>
  );
}