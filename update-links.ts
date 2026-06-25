import { config } from 'dotenv';
config({ path: '.env.local' });

async function main() {
    const { db } = await import('./src/db/index.ts');
    const { pyqs } = await import('./src/db/schema.ts');
    const { eq, like } = await import('drizzle-orm');

    try {
        const pyqsToUpdate = await db.select().from(pyqs).where(like(pyqs.viewLink, 'https://prevyea.vercel.app%'));
        console.log(`Found ${pyqsToUpdate.length} PYQs with the old URL.`);
        
        let updatedCount = 0;
        for (const pyq of pyqsToUpdate) {
            const newViewLink = pyq.viewLink?.replace('https://prevyea.vercel.app', 'https://prevyea-old.vercel.app');
            const newDownloadLink = pyq.downloadLink?.replace('https://prevyea.vercel.app', 'https://prevyea-old.vercel.app');
            await db.update(pyqs).set({ viewLink: newViewLink, downloadLink: newDownloadLink }).where(eq(pyqs.id, pyq.id));
            updatedCount++;
        }
        console.log(`Successfully updated ${updatedCount} PYQs with the new URL.`);
    } catch (e) {
        console.error(e);
    }
}

main().catch(console.error);
