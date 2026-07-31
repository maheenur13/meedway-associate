import "dotenv/config";
import { defineConfig } from "prisma/config";

// Dev uses a local SQLite file at prisma/dev.db (matches DATABASE_URL in .env.local).
// For production, set DATABASE_URL to your Neon Postgres string.
const url = process.env["DATABASE_URL"]?.startsWith("postgres")
  ? process.env["DATABASE_URL"]
  : "file:./prisma/dev.db";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url,
  },
});
