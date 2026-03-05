"use server";

import { db } from "@/db";
import { courses, subjects, colleges, users, collegeCourses } from "@/db/schema";
import { auth } from "@/auth";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function checkAdminAccess() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const currentUser = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });

    if (currentUser?.role !== "ADMIN") {
        throw new Error("Insufficient permissions. Only Admins can manage curriculum.");
    }
    return currentUser;
}

export async function createCollegeAction(formData: FormData) {
    try {
        await checkAdminAccess();
        const name = formData.get("name") as string;
        if (!name || name.trim() === "") throw new Error("College name is required");

        const id = crypto.randomUUID();
        await db.insert(colleges).values({ id, name: name.trim() });

        revalidatePath("/management");
        revalidatePath("/settings"); // Users might need to see the new college
        return { success: true, message: "College created successfully!" };
    } catch (error) {
        console.error("Create College Error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to create college" };
    }
}

export async function createCourseAction(formData: FormData) {
    try {
        await checkAdminAccess();
        const name = formData.get("name") as string;
        const semestersStr = formData.get("totalSemesters") as string;
        const collegeIds = formData.getAll("collegeIds") as string[];

        if (!name || name.trim() === "") throw new Error("Course name is required");
        if (collegeIds.length === 0) throw new Error("At least one College is required");

        const totalSemesters = semestersStr ? parseInt(semestersStr, 10) : 6;
        if (isNaN(totalSemesters) || totalSemesters < 1 || totalSemesters > 12) {
            throw new Error("Total semesters must be between 1 and 12");
        }

        const id = crypto.randomUUID();

        await db.transaction(async (tx) => {
            await tx.insert(courses).values({
                id,
                name: name.trim(),
                totalSemesters,
            });

            for (const cId of collegeIds) {
                await tx.insert(collegeCourses).values({
                    collegeId: cId,
                    courseId: id
                });
            }
        });

        revalidatePath("/management");
        return { success: true, message: "Course created successfully!" };
    } catch (error) {
        console.error("Create Course Error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to create course" };
    }
}

export async function createSubjectAction(formData: FormData) {
    try {
        await checkAdminAccess();
        const name = formData.get("name") as string;
        const courseId = formData.get("courseId") as string;
        const semester = formData.get("semester") as string;

        if (!name || name.trim() === "") throw new Error("Subject name is required");
        if (!courseId) throw new Error("Course ID is required");
        if (!semester) throw new Error("Semester is required");

        const id = crypto.randomUUID();
        await db.insert(subjects).values({
            id,
            name: name.trim(),
            courseId,
            semester
        });

        revalidatePath("/management");
        return { success: true, message: "Subject created successfully!" };
    } catch (error) {
        console.error("Create Subject Error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to create subject" };
    }
}

// Public action for dropping down menus in settings/signup
export async function getCollegesAction() {
    try {
        const result = await db.query.colleges.findMany();
        return { success: true, data: result };
    } catch (error) {
        console.error("Get Colleges Error:", error);
        return { success: false, error: "Failed to fetch colleges" };
    }
}

export async function getCoursesByCollegeAction(collegeId: string) {
    if (!collegeId) return { success: false, error: "College ID required" };
    try {
        const result = await db
            .select({
                id: courses.id,
                name: courses.name,
            })
            .from(courses)
            .innerJoin(collegeCourses, eq(courses.id, collegeCourses.courseId))
            .where(eq(collegeCourses.collegeId, collegeId));
        return { success: true, data: result };
    } catch (error) {
        console.error("Get Courses Error:", error);
        return { success: false, error: "Failed to fetch courses" };
    }
}

export async function getSubjectsByCourseAction(courseId: string) {
    if (!courseId) return { success: false, error: "Course ID required" };
    try {
        const result = await db.query.subjects.findMany({
            where: eq(subjects.courseId, courseId)
        });
        return { success: true, data: result };
    } catch (error) {
        console.error("Get Subjects Error:", error);
        return { success: false, error: "Failed to fetch subjects" };
    }
}

export async function deleteCollegeAction(id: string) {
    try {
        await checkAdminAccess();
        if (!id) throw new Error("College ID is required");
        await db.delete(colleges).where(eq(colleges.id, id));
        revalidatePath("/management");
        return { success: true, message: "College deleted successfully" };
    } catch (error) {
        console.error("Delete College Error:", error);
        return { success: false, error: "Failed to delete college" };
    }
}

export async function deleteCourseAction(id: string) {
    try {
        await checkAdminAccess();
        if (!id) throw new Error("Course ID is required");
        await db.delete(courses).where(eq(courses.id, id));
        revalidatePath("/management");
        return { success: true, message: "Course deleted successfully" };
    } catch (error) {
        console.error("Delete Course Error:", error);
        return { success: false, error: "Failed to delete course" };
    }
}

export async function deleteSubjectAction(id: string) {
    try {
        await checkAdminAccess();
        if (!id) throw new Error("Subject ID is required");
        await db.delete(subjects).where(eq(subjects.id, id));
        revalidatePath("/management");
        return { success: true, message: "Subject deleted successfully" };
    } catch (error) {
        console.error("Delete Subject Error:", error);
        return { success: false, error: "Failed to delete subject" };
    }
}

// ─── File Management ────────────────────────────────────────────────────────

export async function getFilesForManagementAction() {
    try {
        await checkAdminAccess();
        const { pyqs, users, subjects, courses } = await import("@/db/schema");
        const result = await db
            .select({
                id: pyqs.id,
                title: pyqs.title,
                type: pyqs.type,
                year: pyqs.year,
                status: pyqs.status,
                viewLink: pyqs.viewLink,
                uploaderName: users.name,
                subjectName: subjects.name,
                courseName: courses.name,
                semester: pyqs.semester,
                createdAt: pyqs.createdAt,
            })
            .from(pyqs)
            .leftJoin(users, eq(pyqs.uploaderId, users.id))
            .leftJoin(subjects, eq(pyqs.subjectId, subjects.id))
            .leftJoin(courses, eq(pyqs.courseId, courses.id))
            .orderBy(desc(pyqs.createdAt));
        return { success: true, data: result };
    } catch (error) {
        console.error("Get Files Error:", error);
        return { success: false, error: "Failed to fetch files" };
    }
}

export async function deleteFileAction(id: string) {
    try {
        await checkAdminAccess();
        if (!id) throw new Error("File ID is required");

        const { pyqs } = await import("@/db/schema");

        // Fetch the record first so we have the Cloudinary public_id (stored in driveId)
        const [record] = await db.select({ driveId: pyqs.driveId }).from(pyqs).where(eq(pyqs.id, id));

        // Delete from Cloudinary if we have a public_id
        let cloudinaryWarning: string | null = null;
        if (record?.driveId) {
            try {
                const cloudinary = (await import("cloudinary")).v2;
                cloudinary.config({ secure: true });
                const result = await cloudinary.uploader.destroy(record.driveId, { resource_type: "raw" });
                if (result.result !== "ok" && result.result !== "not found") {
                    cloudinaryWarning = `Cloudinary: ${result.result}`;
                }
            } catch (err) {
                // Don't block DB deletion if Cloudinary is unreachable
                cloudinaryWarning = "Cloudinary deletion failed — file may still exist on CDN";
                console.error("Cloudinary delete error:", err);
            }
        }

        // Delete from DB
        await db.delete(pyqs).where(eq(pyqs.id, id));
        revalidatePath("/management");
        revalidatePath("/vault");
        revalidatePath("/syllabus");
        return { success: true, warning: cloudinaryWarning };
    } catch (error) {
        console.error("Delete File Error:", error);
        return { success: false, error: "Failed to delete file" };
    }
}

export async function updateFileTitleAction(id: string, title: string) {
    try {
        await checkAdminAccess();
        if (!id || !title?.trim()) throw new Error("ID and title are required");
        const { pyqs } = await import("@/db/schema");
        await db.update(pyqs).set({ title: title.trim() }).where(eq(pyqs.id, id));
        revalidatePath("/management");
        revalidatePath("/vault");
        return { success: true };
    } catch (error) {
        console.error("Update File Error:", error);
        return { success: false, error: "Failed to update file" };
    }
}

