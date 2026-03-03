"use server";

import { db } from "@/db";
import { courses, subjects } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getCoursesAction() {
    try {
        const allCourses = await db.select().from(courses);
        return { success: true, data: allCourses };
    } catch (error) {
        console.error("Failed to fetch courses:", error);
        return { success: false, error: "Failed to fetch courses" };
    }
}

export async function getSubjectsAction(courseId: string, semester: string) {
    try {
        if (!courseId || !semester) {
            return { success: true, data: [] }; // Return empty if prerequisites missing
        }

        const validSubjects = await db
            .select()
            .from(subjects)
            .where(
                and(
                    eq(subjects.courseId, courseId),
                    eq(subjects.semester, semester)
                )
            );

        return { success: true, data: validSubjects };
    } catch (error) {
        console.error("Failed to fetch subjects:", error);
        return { success: false, error: "Failed to fetch subjects" };
    }
}
