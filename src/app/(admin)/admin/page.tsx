import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const authorization = await requireAdmin();

  if (!authorization.ok) {
    if (authorization.status === 401) {
      redirect("/sign-in");
    }

    redirect("/");
  }

  return <AdminDashboard />;
}
