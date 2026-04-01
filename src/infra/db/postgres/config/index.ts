import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const { Pool } = pg;
const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: DATABASE_URL,
});

export const db = drizzle(pool);

