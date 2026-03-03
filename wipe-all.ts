import { db } from "./src/db/index";
import { sql } from "drizzle-orm";

async function run() {
    console.log("Dropping ALL tables...");
    // Drop in dependency order
    await db.run(sql`DROP TABLE IF EXISTS pyqs;`);
    await db.run(sql`DROP TABLE IF EXISTS subjects;`);
    await db.run(sql`DROP TABLE IF EXISTS courses;`);
    await db.run(sql`DROP TABLE IF EXISTS notices;`);
    await db.run(sql`DROP TABLE IF EXISTS accounts;`);
    await db.run(sql`DROP TABLE IF EXISTS sessions;`);
    await db.run(sql`DROP TABLE IF EXISTS verificationToken;`);
    await db.run(sql`DROP TABLE IF EXISTS users;`);
    console.log("All tables dropped. Now run: node push.js && node --env-file=.env.local node_modules/tsx/dist/cli.mjs seed.ts");
}
run().catch(console.error);
