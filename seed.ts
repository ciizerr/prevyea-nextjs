import { db } from "./src/db/index";
import { courses, subjects } from "./src/db/schema";
import crypto from "crypto";

async function seed() {
    console.log("Seeding Database...");

    // 1. Create Courses
    const courseId1 = crypto.randomUUID();
    const courseId2 = crypto.randomUUID();

    await db.insert(courses).values([
        { id: courseId1, name: "BCA" },
        { id: courseId2, name: "B.Sc IT" },
    ]);
    console.log("✅ Courses Seeded");

    // 2. Create Subjects for BCA Sem 3
    await db.insert(subjects).values([
        { id: crypto.randomUUID(), name: "Operating Systems", courseId: courseId1, semester: "Sem 3" },
        { id: crypto.randomUUID(), name: "Computer Architecture", courseId: courseId1, semester: "Sem 3" },
        { id: crypto.randomUUID(), name: "Object Oriented Programming (C++)", courseId: courseId1, semester: "Sem 3" },
        { id: crypto.randomUUID(), name: "Data Structures", courseId: courseId1, semester: "Sem 3" },
    ]);

    // 3. Create Subjects for BCA Sem 4
    await db.insert(subjects).values([
        { id: crypto.randomUUID(), name: "Software Engineering", courseId: courseId1, semester: "Sem 4" },
        { id: crypto.randomUUID(), name: "Java Programming", courseId: courseId1, semester: "Sem 4" },
    ]);

    // 4. Create Subjects for B.Sc IT Sem 2
    await db.insert(subjects).values([
        { id: crypto.randomUUID(), name: "Database Management Systems", courseId: courseId2, semester: "Sem 2" },
        { id: crypto.randomUUID(), name: "Web Programming", courseId: courseId2, semester: "Sem 2" },
    ]);

    console.log("✅ Subjects Seeded");
}

seed().catch(console.error);
