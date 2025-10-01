import { env } from "@/env/server";
import type { Config } from "drizzle-kit";

console.log("env.DATABASE_URL", env.DATABASE_URL);
export default {
  out: "./src/lib/db/migrations/local",
  schema: "./src/lib/db/schema/index.ts",
  breakpoints: true,
  verbose: true,
  strict: true,
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;
