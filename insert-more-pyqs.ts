import { config } from 'dotenv';
config({ path: '.env.local' });
import crypto from 'crypto';

async function main() {
    const { db } = await import('./src/db/index.ts');
    const { pyqs, subjects, courses } = await import('./src/db/schema.ts');
    const fs = await import('fs');

    const repoData = JSON.parse(fs.readFileSync('repo-pyqs.json', 'utf8'));
    
    const allCourses = await db.select().from(courses);
    const bcaCourse = allCourses.find((c:any) => c.name === "BCA");
    const allSubjects = await db.select().from(subjects);

    const toInsert = [];

    // 1. Insert Sem 2 AECC (maps to AECC-2)
    const sem2Aecc = repoData.filter((r:any) => r.semester === 'sem2' && r.subject === 'aecc');
    const subjectAecc2 = allSubjects.find((s:any) => s.name === 'AECC-2' && s.semester === 'Sem 2');
    
    if (subjectAecc2) {
        for (const r of sem2Aecc) {
            const id = crypto.randomUUID();
            const driveId = `pu-library-pyqs/${id}-AECC-2 {${r.year}}.pdf`;
            const link = `https://prevyea.vercel.app${r.url}`;
            toInsert.push({
                id: id,
                title: `AECC-2 (${r.year})`,
                courseId: bcaCourse.id,
                semester: 'Sem 2',
                subjectId: subjectAecc2.id,
                type: "PYQ" as const,
                year: r.year,
                driveId: driveId,
                viewLink: link,
                downloadLink: link,
                status: "APPROVED" as const
            });
        }
    }

    // 2. Duplicate Sem 5 DSE-1 and DSE-2 for Sem 6
    const sem5Dse = repoData.filter((r:any) => r.semester === 'sem5' && r.subject.startsWith('dse'));
    const subjectDse1Sem6 = allSubjects.find((s:any) => s.name === 'DSE-1' && s.semester === 'Sem 6');
    const subjectDse2Sem6 = allSubjects.find((s:any) => s.name === 'DSE-2' && s.semester === 'Sem 6');

    for (const r of sem5Dse) {
        const subName = r.subject.toUpperCase().replace('DSE', 'DSE-');
        const subject = subName === 'DSE-1' ? subjectDse1Sem6 : subjectDse2Sem6;
        if (subject) {
            const id = crypto.randomUUID();
            const driveId = `pu-library-pyqs/${id}-${subName} {${r.year}}.pdf`;
            const link = `https://prevyea.vercel.app${r.url}`;
            toInsert.push({
                id: id,
                title: `${subName} (${r.year})`,
                courseId: bcaCourse.id,
                semester: 'Sem 6',
                subjectId: subject.id,
                type: "PYQ" as const,
                year: r.year,
                driveId: driveId,
                viewLink: link,
                downloadLink: link,
                status: "APPROVED" as const
            });
        }
    }

    if (toInsert.length > 0) {
        console.log(`Inserting ${toInsert.length} additional PYQs (AECC-2 and Sem 6 DSEs)...`);
        await db.insert(pyqs).values(toInsert);
        console.log("Successfully inserted PYQs.");
    } else {
        console.log("No PYQs to insert.");
    }
}

main().catch(console.error);
