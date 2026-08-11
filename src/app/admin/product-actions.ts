"use server";

import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
    select: {
      role: true,
    },
  });

  if (user?.role !== "ADMIN") {
    throw new Error("Forbidden: admin access required");
  }

  return user;
}

type ProductInput = {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  rating?: number;
};

function validateProductInput(input: ProductInput) {
  const name = input.name.trim();
  const description = input.description.trim();
  const category = input.category.trim();
  const image = input.image?.trim() || null;
  const rating = input.rating ?? 0;

  if (!name) {
    throw new Error("Product name wajib diisi.");
  }

  if (!description) {
    throw new Error("Description wajib diisi.");
  }

  if (!category) {
    throw new Error("Category wajib diisi.");
  }

  if (!Number.isFinite(input.price) || input.price < 0) {
    throw new Error("Harga produk tidak valid.");
  }

  if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
    throw new Error("Rating harus berada di antara 0 dan 5.");
  }

  return {
    name,
    description,
    price: input.price,
    category,
    image,
    rating,
  };
}

export async function getProducts() {
  await requireAdmin();

  return prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createProduct(input: ProductInput) {
  await requireAdmin();

  const data = validateProductInput(input);

  const product = await prisma.product.create({
    data,
  });

  revalidatePath("/admin");
  revalidatePath("/products");

  return product;
}

export async function updateProduct(
  id: number,
  input: ProductInput
) {
  await requireAdmin();

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Product ID tidak valid.");
  }

  const data = validateProductInput(input);

  const product = await prisma.product.update({
    where: {
      id,
    },
    data,
  });

  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);

  return product;
}

export async function deleteProduct(id: number) {
  await requireAdmin();

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Product ID tidak valid.");
  }

  const product = await prisma.product.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/products");

  return product;
}