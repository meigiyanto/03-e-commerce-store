import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import type { Prisma } from "@/generated/prisma";

export function serializeProduct(
  p: Prisma.ProductGetPayload<{}>,
): Product {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    description: p.description,
    image: p.image,
    category: p.category,
    rating: p.rating,
    stock: p.stock,
    createdAt: p.createdAt?.toISOString(),
    updatedAt: p.updatedAt?.toISOString(),
  };
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not configured.");
}

const adapter = new PrismaPg({ connectionString, });
const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter,});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;