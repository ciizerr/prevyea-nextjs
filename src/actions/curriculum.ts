"use server";

import { db } from "@/db";
import { courses, subjects, collegeCourses, pyqs, users } from "@/db/schema";
import { eq, and, inArray, desc, sql } from "drizzle-orm";

export async function getCoursesAction() {
    try {
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
            return { success: true, data: [] };
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
                uploaderName: users.name,
                uploaderUsername: users.username,
                views: pyqs.views,
                downloads: pyqs.downloads,
                createdAt: pyqs.createdAt,
            })
            .from(pyqs)
            .leftJoin(users, eq(pyqs.uploaderId, users.id))
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

export async function incrementDownloadAction(pyqId: string) {
    try {
        if (!pyqId) return { success: false };
        await db
            .update(pyqs)
            .set({ downloads: sql`${pyqs.downloads} + 1` })
            .where(eq(pyqs.id, pyqId));
        return { success: true };
    } catch (error) {
        console.error("Failed to increment download count:", error);
        return { success: false };
    }
}

export async function fetchMarkdownContent(url: string) {
    try {
        if (!url) return { success: false, error: "No URL provided" };
        const res = await fetch(url);
        if (!res.ok) {
            return { success: false, error: `Failed to fetch: ${res.status}` };
        }
        const text = await res.text();
        return { success: true, data: text };
    } catch (error) {
        console.error("Failed to fetch markdown content:", error);
        return { success: false, error: "Failed to fetch markdown content" };
    }
}
