import { config } from 'dotenv';
config({ path: '.env.local' });
import crypto from 'crypto';

async function main() {
    const { db } = await import('./src/db/index.ts');
    const { pyqs, subjects, courses } = await import('./src/db/schema.ts');
    const { eq, and } = await import('drizzle-orm');
    const fs = await import('fs');

    const repoData = JSON.parse(fs.readFileSync('repo-pyqs.json', 'utf8'));
    const dbData = JSON.parse(fs.readFileSync('existing-pyqs.json', 'utf8'));

    // Normalize db data (only PYQ type)
    const dbKeys = new Set(
        dbData
            .filter((d: any) => d.type === "PYQ" || !d.type) // We didn't fetch type earlier but let's assume we match against what we have
            .map((d: any) => `${d.semester}_${d.subjectName}_${d.year}`)
    );

    const repoNormalized = repoData.map((r: any) => {
        let sem = r.semester.replace('sem', 'Sem ');
        let sub = r.subject.toUpperCase();
        if (sub === 'AECC11') sub = 'AECC-1';
        if (sub.length > 3 && !sub.includes('-')) {
            sub = sub.replace(/(\D+)(\d+)/, '$1-$2');
        } else if (sub.length <= 3 && !sub.includes('-')) {
            sub = sub.replace(/(\D+)(\d+)/, '$1-$2');
        }
        return {
            key: `${sem}_${sub}_${r.year}`,
            semester: sem,
            subject: sub,
            year: r.year,
            originalUrl: r.url
        };
    });

    const missing = repoNormalized.filter((r: any) => !dbKeys.has(r.key));
    console.log(`Found ${missing.length} missing PYQs to insert.`);

    // Pre-fetch subjects and courses
    const allCourses = await db.select().from(courses);
    const bcaCourse = allCourses.find(c => c.name === "BCA");
    if (!bcaCourse) throw new Error("BCA Course not found");

    const allSubjects = await db.select().from(subjects);

    const toInsert = [];

    for (const m of missing) {
        // Find subject
        const subject = allSubjects.find(s => s.name.includes(m.subject) && s.semester === m.semester);
        if (!subject) {
            console.log(`Warning: Subject not found for ${m.subject} in ${m.semester}. Skipping.`);
            continue;
        }

        const id = crypto.randomUUID();
        const driveId = `pu-library-pyqs/${id}-${m.subject} {${m.year}}.pdf`;
        const link = `https://prevyea.vercel.app${m.originalUrl}`;

        toInsert.push({
            id: id,
            title: `${m.subject} (${m.year})`,
            courseId: bcaCourse.id,
            semester: m.semester,
            subjectId: subject.id,
            type: "PYQ" as const,
            year: m.year,
            driveId: driveId,
            viewLink: link,
            downloadLink: link,
            status: "APPROVED" as const
        });
    }

    if (toInsert.length > 0) {
        console.log(`Inserting ${toInsert.length} PYQs...`);
        await db.insert(pyqs).values(toInsert);
        console.log("Successfully inserted PYQs.");
    } else {
        console.log("No valid missing PYQs found (maybe subjects are missing).");
    }
}

main().catch(console.error);
