import prisma from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { Product } from "@/types/product";

export function serializeProduct(p: Prisma.ProductGetPayload<object>): Product {
  return {
    id: p.id, name: p.name, price: p.price, description: p.description,
    image: p.image, category: p.category, rating: p.rating, stock: p.stock,
    createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString(),
  };
}

export async function getProducts(options?: {
  search?: string; category?: string; ids?: string[]; limit?: number;
}) {
  const { search, category, ids, limit } = options ?? {};
  const rows = await prisma.product.findMany({
    where: {
      ...(ids?.length ? { id: { in: ids } } : {}),
      ...(category && category !== "Semua" ? { category } : {}),
      ...(search ? { OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ] } : {}),
    },
    orderBy: { createdAt: "desc" },
    ...(limit ? { take: limit } : {}),
  });
  return rows.map(serializeProduct);
}

export async function getProductById(id: string) {
  const row = await prisma.product.findUnique({ where: { id } });
  return row ? serializeProduct(row) : null;
}

export async function getProductCategories() {
  const rows = await prisma.product.findMany({
    distinct: ["category"], select: { category: true }, orderBy: { category: "asc" },
  });
  return rows.map((x) => x.category);
}
