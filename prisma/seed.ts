import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not configured.");
}

const adapter = new PrismaPg({connectionString,});
const prisma = new PrismaClient({adapter,});

const products = [
  {
    id: "wireless-headphone",
    name: "Wireless Headphone",
    price: 350000,
    category: "Elektronik",
    description:
      "Headphone wireless dengan kualitas suara jernih dan nyaman digunakan untuk mendengarkan musik, menonton film, maupun bekerja.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    rating: 4.8,
    stock: 10,
  },
  {
    id: "smart-watch",
    name: "Smart Watch",
    price: 450000,
    category: "Elektronik",
    description:
      "Smart watch modern dengan berbagai fitur untuk membantu memantau aktivitas harian Anda.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    rating: 4.6,
    stock: 10,
  },
  {
    id: "casual-sneakers",
    name: "Casual Sneakers",
    price: 600000,
    category: "Fashion",
    description:
      "Sneakers casual dengan desain modern dan nyaman digunakan untuk aktivitas sehari-hari.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    rating: 4.4,
    stock: 10,
  },
  {
    id: "minimalist-backpack",
    name: "Minimalist Backpack",
    price: 275000,
    category: "Fashion",
    description:
      "Tas ransel minimalis dengan desain modern dan ruang penyimpanan yang cukup untuk kebutuhan sehari-hari.",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    rating: 4.5,
    stock: 10,
  },
];

async function main() {
  console.log("🌱 Seeding products...");

  for (const product of products) {
    await prisma.product.upsert({
      where: {
        id: product.id,
      },
      update: product,
      create: product,
    });

    console.log(`✓ ${product.name}`);
  }

  console.log("✅ Product seed completed.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

