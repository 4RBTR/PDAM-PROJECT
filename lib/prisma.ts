// lib/prisma.ts - Singleton Prisma Client untuk Next.js (serverless-safe)
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// Ensure connections are not leaked - disconnect on process exit
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
