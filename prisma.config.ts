import "dotenv/config";
import { defineConfig } from "prisma/config";

// Neon Postgres. DATABASE_URL is the pooled (-pooler) connection string used at
// runtime; migrations prefer DIRECT_URL (the unpooled host) when it is set, since
// DDL and advisory locks are happier on a direct connection.
const url = process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"];

if (!url) {
  throw new Error(
    "DATABASE_URL is not set — add your Neon connection string to .env",
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url,
  },
});
