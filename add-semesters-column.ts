import { db } from "./src/db";
import { sql } from "drizzle-orm";

async function run() {
    try {
        console.log("Adding missing total_semesters column back to courses table...");
        await db.run(sql`ALTER TABLE "courses" ADD COLUMN "total_semesters" integer NOT NULL DEFAULT 6;`);
        console.log("Successfully appended column!");
    } catch (err) {
        console.error("Failed:", err);
    }
    process.exit(0);
}

run();
