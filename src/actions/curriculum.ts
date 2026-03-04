"use server";

import { db } from "@/db";
import { courses, subjects, collegeCourses, pyqs } from "@/db/schema";
import { eq, and, inArray, desc } from "drizzle-orm";

export async function getCoursesAction() {
    try {
        // Return structured dataset flattening Course x College associations for frontend components 
        const allCourses = await db.select({
            id: courses.id,
            name: courses.name,
            totalSemesters: courses.totalSemesters,
            collegeId: collegeCourses.collegeId,
        })
            .from(courses)
            .leftJoin(collegeCourses, eq(courses.id, collegeCourses.courseId));

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

export async function getFilesAction(subjectId: string, types: ("PYQ" | "Notes" | "Syllabus")[]) {
    try {
        if (!subjectId || !types || types.length === 0) {
            return { success: true, data: [] };
        }

        const files = await db
            .select({
                id: pyqs.id,
                title: pyqs.title,
                type: pyqs.type,
                year: pyqs.year,
                viewLink: pyqs.viewLink,
                downloadLink: pyqs.downloadLink,
                uploaderId: pyqs.uploaderId,
                views: pyqs.views,
                downloads: pyqs.downloads,
                createdAt: pyqs.createdAt,
            })
            .from(pyqs)
            .where(
                and(
                    eq(pyqs.subjectId, subjectId),
                    inArray(pyqs.type, types),
                    eq(pyqs.status, "APPROVED")
                )
            )
            .orderBy(desc(pyqs.year), desc(pyqs.createdAt));

        return { success: true, data: files };
    } catch (error) {
        console.error("Failed to fetch files:", error);
        return { success: false, error: "Failed to fetch files" };
    }
}
