import { config } from 'dotenv';
config({ path: '.env.local' });

async function main() {
    const { db } = await import('./src/db/index.ts');
    const { pyqs, subjects, courses } = await import('./src/db/schema.ts');
    const { eq } = await import('drizzle-orm');

    try {
        const existingPyqs = await db
            .select({
                id: pyqs.id,
                title: pyqs.title,
                year: pyqs.year,
                semester: pyqs.semester,
                subjectId: pyqs.subjectId,
                courseId: pyqs.courseId,
                courseName: courses.name,
                subjectName: subjects.name,
            })
            .from(pyqs)
            .leftJoin(courses, eq(pyqs.courseId, courses.id))
            .leftJoin(subjects, eq(pyqs.subjectId, subjects.id));
        
        const fs = await import('fs');
        fs.writeFileSync('existing-pyqs.json', JSON.stringify(existingPyqs, null, 2));
        console.log("Wrote existing-pyqs.json");
    } catch (e) {
        console.error(e);
    }
}

main().catch(console.error);
