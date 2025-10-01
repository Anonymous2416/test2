import { env } from "@/env/server";
import * as schema from "@/lib/db/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(env.DATABASE_URL);
export const db = drizzle({ client: sql, schema, casing: "snake_case" });
