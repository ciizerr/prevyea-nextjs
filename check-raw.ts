import 'dotenv/config';
import { db } from './src/db';
import { sql } from 'drizzle-orm';

async function main() {
    const res = await db.run(sql`SELECT id, username, created_at FROM users LIMIT 5`);
    console.log(res.rows);
}

main().catch(console.error);
