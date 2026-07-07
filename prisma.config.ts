import path from "node:path";
import { defineConfig } from "prisma/config";

// Prisma 7 no longer auto-loads .env; Node 22 does it natively.
// On Vercel there is no .env file (env vars are injected directly),
// so ignore the ENOENT and fall back to process.env.
try {
  process.loadEnvFile();
} catch {
  // no .env file — rely on the injected environment variables
}

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
