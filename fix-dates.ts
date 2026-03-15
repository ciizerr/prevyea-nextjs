import 'dotenv/config';
import { db } from './src/db';
import { sql } from 'drizzle-orm';

async function main() {
    // SQLite timestamps were saved as strings 'YYYY-MM-DD HH:MM:SS'
    // This converts them to unix epoch seconds (integers)
    const tables = ['users', 'pyqs', 'sessions', 'role_applications', 'notifications'];

    for (const table of tables) {
        try {
            await db.run(sql.raw(`UPDATE ${table} SET created_at = cast(strftime('%s', created_at) as int) WHERE typeof(created_at) = 'text'`));
            console.log(`Updated ${table} created_at`);
        } catch {
            // Ignore if table doesn't have created_at or doesn't exist
        }
    }

    const check = await db.run(sql`SELECT id, username, typeof(created_at), created_at FROM users LIMIT 5`);
    console.log("Check format:", check.rows);
}

main().catch(console.error);
