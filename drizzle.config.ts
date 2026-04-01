import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/infra/db/postgres/config/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://sportz:sportz123@localhost:5432/sportz",
  },
});

