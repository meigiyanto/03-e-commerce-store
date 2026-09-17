import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProductClient from "./ProductClient";

export default async function ProductsPage() {
  const authorization = await requireAdmin();

  if (!authorization.ok) {
    if (authorization.status === 401) {
      redirect("/sign-in");
    }

    redirect("/");
  }

  return <ProductClient />;
}
