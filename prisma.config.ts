import { defineConfig } from "prisma/config";
import * as fs from "fs";
import * as path from "path";

// Load .env.local for Prisma CLI (Next.js uses .env.local but Prisma CLI reads .env by default)
function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

loadEnvLocal();

export default defineConfig({
  migrations: {
    seed: "tsx ./prisma/seed.ts",
  },
  datasource: {
    // DIRECT_URL (port 5432) required for Prisma CLI — pooler (6543) blocks DDL
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
  },
});
