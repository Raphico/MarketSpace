import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { env } from "./src/config.js";

export default defineConfig({
    out: "./drizzle",
    schema: "./src/db/schema.js",
    dialect: "postgresql",
    dbCredentials: {
        url: env.DATABASE_URL,
    },
});
