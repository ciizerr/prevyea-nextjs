import 'dotenv/config';
import { db } from './src/db';
import { users } from './src/db/schema';

async function main() {
    const res = await db.select({ username: users.username, createdAt: users.createdAt }).from(users).limit(5);
    console.log(res);
}

main().catch(console.error);
