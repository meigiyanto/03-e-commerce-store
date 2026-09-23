import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import AdminShell from "./AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authorization = await requireAdmin();

  if (!authorization.ok) {
    redirect(
      authorization.status === 401
        ? "/sign-in?redirect_url=/admin"
        : "/admin/unauthorized",
    );
  }

  return <AdminShell>{children}</AdminShell>;
}