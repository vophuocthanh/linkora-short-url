import path from "node:path";
import { defineConfig } from "prisma/config";

// Prisma 7 no longer auto-loads .env; Node 22 does it natively.
process.loadEnvFile();

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
