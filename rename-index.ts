import { db } from "./src/db";
import { sql } from "drizzle-orm";

async function run() {
    try {
        console.log("Renaming courses unique index for Drizzle compatibility...");
        await db.run(sql`DROP INDEX IF EXISTS "courses_new_name_unique";`);
        await db.run(sql`CREATE UNIQUE INDEX "courses_name_unique" ON "courses" ("name");`);
        console.log("Successfully renamed index!");
    } catch (err) {
        console.error("Failed:", err);
    }
    process.exit(0);
}

run();
