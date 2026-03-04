import { db } from "./src/db";
import { sql } from "drizzle-orm";

async function run() {
    try {
        console.log("Renaming semester column to session...");
        await db.run(sql`ALTER TABLE "users" RENAME COLUMN "semester" TO "session";`);
        console.log("Successfully renamed column!");
    } catch (err) {
        console.error("Failed:", err);
    }
    process.exit(0);
}

run();
