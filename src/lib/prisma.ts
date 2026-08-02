import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set — add your Neon connection string to .env",
  );
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createClient() {
  // Small pool: on serverless each instance gets its own, and Neon's pooler
  // (-pooler host) multiplexes them server-side anyway.
  const adapter = new PrismaPg({ connectionString, max: 5 });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

// Cached across hot reloads so dev doesn't leak connection pools. Note the
// trade-off: this instance outlives `prisma generate`, so after a schema change
// the running dev server still holds a client without the new model and calls
// on it fail with "Cannot read properties of undefined". Restart `next dev`.
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
