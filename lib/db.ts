import { PrismaClient } from "@/app/generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const accelerateUrl = process.env.PRISMA_ACCELERATE_URL;
const databaseUrl = process.env.DATABASE_URL;

if (!accelerateUrl && !databaseUrl) {
  throw new Error("Either PRISMA_ACCELERATE_URL or DATABASE_URL must be set");
}

function createPrismaClient(): PrismaClient {
  if (accelerateUrl) {
   
    return new PrismaClient({
      accelerateUrl,
      log: ["query"],
    });
  } else {
    
    return new PrismaClient({
      adapter: new PrismaPg(new Pool({ connectionString: databaseUrl! })),
      log: ["query"],
    });
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
