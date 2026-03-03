import { db } from "./src/db/index";
import { sql } from "drizzle-orm";

async function run() {
    console.log("Dropping pyqs table to reset foreign keys...");
    await db.run(sql`DROP TABLE IF EXISTS pyqs;`);
    console.log("Success.");
}

run().catch(console.error);
