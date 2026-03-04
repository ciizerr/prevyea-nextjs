import { db } from "./src/db";
import { sql } from "drizzle-orm";

async function run() {
    try {
        console.log("Recreating courses table to sever college_id constraint...");

        // Need to temporarily disable constraints while rebuilding table
        await db.run(sql`PRAGMA foreign_keys=off;`);

        await db.run(sql`CREATE TABLE "courses_new" (
            "id" text PRIMARY KEY NOT NULL,
            "name" text NOT NULL
        );`);

        await db.run(sql`CREATE UNIQUE INDEX "courses_new_name_unique" ON "courses_new" ("name");`);
        await db.run(sql`INSERT INTO "courses_new" ("id", "name") SELECT "id", "name" FROM "courses";`);
        await db.run(sql`DROP TABLE "courses";`);
        await db.run(sql`ALTER TABLE "courses_new" RENAME TO "courses";`);

        await db.run(sql`PRAGMA foreign_keys=on;`);

        console.log("Successfully rebuilt courses table!");
    } catch (err) {
        console.error("Failed:", err);
    }
    process.exit(0);
}

run();
