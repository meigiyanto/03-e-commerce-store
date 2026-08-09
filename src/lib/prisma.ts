import "server-only";

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// import "server-only";
// import { PrismaClient } from "@/generated/prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };

// function createPrismaClient() {
//   const connectionString = process.env.DATABASE_URL;

//   if (!connectionString) {
//     throw new Error("DATABASE_URL is not defined");
//   }

//   const url = new URL(connectionString);

//   console.log("PRISMA DB CONFIG:", {
//     host: url.hostname,
//     port: url.port,
//     database: url.pathname.slice(1),
//     sslmode: url.searchParams.get("sslmode"),
//   });

//   const adapter = new PrismaPg({
//     connectionString,
//   });

//   return new PrismaClient({
//     adapter,
//   });
// }

// export const prisma =
//   globalForPrisma.prisma ?? createPrismaClient();

// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = prisma;
// }