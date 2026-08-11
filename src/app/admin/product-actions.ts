"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type ProductInput = {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
};

export type AdminProduct = ProductInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

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

  if (!user || user.role !== "ADMIN") {
    throw new Error("Forbidden: admin access required");
  }
}

function validateProductInput(
  input: ProductInput
): ProductInput {
  const name = input.name.trim();
  const description = input.description.trim();
  const category = input.category.trim();
  const image = input.image.trim();

  const price = Number(input.price);
  const rating = Number(input.rating);

  if (!name) {
    throw new Error("Product name wajib diisi.");
  }

  if (!description) {
    throw new Error("Description wajib diisi.");
  }

  if (!category) {
    throw new Error("Category wajib diisi.");
  }

  if (!image) {
    throw new Error("Image URL wajib diisi.");
  }

  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Harga produk tidak valid.");
  }

  if (
    !Number.isFinite(rating) ||
    rating < 0 ||
    rating > 5
  ) {
    throw new Error(
      "Rating harus berada di antara 0 dan 5."
    );
  }

  return {
    name,
    description,
    price,
    category,
    image,
    rating,
  };
}

function serializeProduct(product: {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | null;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}): AdminProduct {
  return {
    id: String(product.id),
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    image: product.image ?? "",
    rating: product.rating,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

// READ
export async function getProducts(): Promise<AdminProduct[]> {
  await requireAdmin();

  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return products.map(serializeProduct);
}

// CREATE
export async function createProduct(
  input: ProductInput
): Promise<AdminProduct> {
  await requireAdmin();

  const data = validateProductInput(input);

  const product = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      image: data.image || null,
      rating: data.rating,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/products");

  return serializeProduct(product);
}

// UPDATE
export async function updateProduct(
  id: number,
  input: ProductInput
): Promise<AdminProduct> {
  await requireAdmin();

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Product ID tidak valid.");
  }

  const data = validateProductInput(input);

  const product = await prisma.product.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      image: data.image || null,
      rating: data.rating,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);

  return serializeProduct(product);
}

// DELETE
export async function deleteProduct(
  id: number
): Promise<{ id: number }> {
  await requireAdmin();

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Product ID tidak valid.");
  }

  try {
    const product = await prisma.product.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/products");

    return product;
  } catch (error) {
    console.error(
      "Failed to delete product:",
      error
    );

    throw new Error(
      "Produk tidak dapat dihapus. Pastikan produk tidak sedang digunakan oleh order."
    );
  }
}