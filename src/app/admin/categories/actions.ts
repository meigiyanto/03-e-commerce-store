"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function createCategory(formData: FormData) {
  const name = String(formData.get("name"));
  const description = String(formData.get("description") || "");

  await prisma.category.create({
    data: {
      name,
      slug: slugify(name),
      description,
    },
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(
  id: string,
  formData: FormData
) {
  const name = String(formData.get("name"));
  const description = String(formData.get("description") || "");

  await prisma.category.update({
    where: { id },
    data: {
      name,
      slug: slugify(name),
      description,
    },
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({
    where: { id },
  });

  revalidatePath("/admin/categories");
}
