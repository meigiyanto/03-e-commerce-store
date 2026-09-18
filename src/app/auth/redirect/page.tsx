import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AuthRedirectPage() {
  const user = await currentUser();

  // Belum login
  if (!user) {
    redirect("/sign-in");
  }

  const role = user.publicMetadata?.role === "admin" ? "admin" : "customer";

  if (role === "admin") {
    redirect("/admin");
  }

  redirect("/account");
}