import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main>
      <h1>My Account</h1>

      <p>{session.user.name}</p>
      <p>{session.user.email}</p>
      <p>{session.user.role}</p>
    </main>
  );
}