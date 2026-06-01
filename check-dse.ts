import { config } from 'dotenv';
config({ path: '.env.local' });

async function main() {
    const { db } = await import('./src/db/index.ts');
    const { subjects } = await import('./src/db/schema.ts');

    try {
        const dseSubjects = await db.select().from(subjects);
        console.log("All subjects:", dseSubjects.filter((s:any) => s.name.includes("DSE") || s.name.includes("dse")));
    } catch (e) {
        console.error(e);
    }
}

main().catch(console.error);
