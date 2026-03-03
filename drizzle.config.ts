import { config } from "dotenv";
config({ path: ".env.local" });
import type { Config } from "drizzle-kit";

export default {
    schema: "./src/db/schema.ts",
    out: "./src/db/migrations",
    dialect: "turso", // Using Turso (libSQL)
    dbCredentials: {
        url: process.env.TURSO_CONNECTION_URL || "",
        authToken: process.env.TURSO_AUTH_TOKEN || "",
    },
    strict: true,
} satisfies Config;
