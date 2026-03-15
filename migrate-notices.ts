import 'dotenv/config';
import { db } from './src/db';
import { sql } from 'drizzle-orm';

async function main() {
    try {
        await db.run(sql`ALTER TABLE notices ADD COLUMN expires_at INTEGER`);
        console.log("Added expires_at column");
    } catch (e) {
        if ((e as Error).message?.includes("duplicate")) console.log("expires_at already exists");
        else console.log("expires_at note:", (e as Error).message);
    }
    try {
        await db.run(sql`ALTER TABLE notices ADD COLUMN updated_at INTEGER`);
        console.log("Added updated_at column");
    } catch (e) {
        if ((e as Error).message?.includes("duplicate")) console.log("updated_at already exists");
        else console.log("updated_at note:", (e as Error).message);
    }
    console.log("Migration done.");
}

main().catch(console.error);
