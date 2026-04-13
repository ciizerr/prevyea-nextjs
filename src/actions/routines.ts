"use server";

import { db } from "@/db";
import { routines, courses } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Fetches the routine for a specific course, semester, and day.
 */
export async function getTodayRoutine(courseId: string, semester: string, dayOfWeek: number) {
    if (!courseId || !semester) return null;
    
    try {
        return await db.query.routines.findFirst({
            where: and(
                eq(routines.courseId, courseId),
                eq(routines.semester, semester),
                eq(routines.dayOfWeek, dayOfWeek)
            )
        });
    } catch (error) {
        console.error("Error fetching routine:", error);
        return null;
    }
}

/**
 * Normalizes semester strings (e.g., "SEM II", "Semester 4", "2") to standard "Sem X" format.
 */
function normalizeSemester(input: string): string {
    let semester = input.trim().toUpperCase();
    
    // Remove common prefixes
    semester = semester.replace(/^(SEM|SEMESTER)\s+/i, "");
    
    // Roman Numeral Mapping
    const romanMap: Record<string, string> = {
        "I": "1", "II": "2", "III": "3", "IV": "4", "V": "5", "VI": "6", "VII": "7", "VIII": "8"
    };
    
    if (romanMap[semester]) {
        semester = romanMap[semester];
    }
    
    // Final check - ensure it's a number or already in Sem X format
    const num = parseInt(semester);
    if (!isNaN(num)) {
        return `Sem ${num}`;
    }
    
    // Fallback to title case Sem X if already formatted correctly
    return semester.charAt(0).toUpperCase() + semester.slice(1).toLowerCase();
}

/**
 * Processes a CSV string and updates the routines table.
 * Expected CSV Format: Course, Semester, Day, Schedule
 * Day can be index (0-6) or full name (e.g., Monday).
 */
export async function bulkAddRoutines(csvContent: string) {
    try {
        const lines = csvContent.split(/\r?\n/).filter(line => line.trim());
        if (lines.length < 2) return { success: false, error: "CSV must contain headers and at least one data row." };

        // Fetch all courses for mapping names to IDs
        const allCourses = await db.select().from(courses);
        const routineData: {
            id: string;
            courseId: string;
            semester: string;
            dayOfWeek: number;
            schedule: string;
        }[] = [];
        const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const cols: string[] = [];
            let current = "";
            let inQuotes = false;

            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    cols.push(current.trim().replace(/^"|"$/g, ''));
                    current = "";
                } else {
                    current += char;
                }
            }
            cols.push(current.trim().replace(/^"|"$/g, ''));

            if (cols.length < 4) continue;

            const courseName = cols[0];
            const semesterRaw = cols[1];
            const dayStr = cols[2];
            const schedule = cols[3];

            const semester = normalizeSemester(semesterRaw);

            const course = allCourses.find(c => c.name.toLowerCase() === courseName.toLowerCase());
            if (!course) {
                console.warn(`Course not found: ${courseName}`);
                continue;
            }

            let dayOfWeek = parseInt(dayStr);
            if (isNaN(dayOfWeek)) {
                dayOfWeek = days.indexOf(dayStr.toLowerCase());
            }

            if (dayOfWeek < 0 || dayOfWeek > 6) {
                console.warn(`Invalid day: ${dayStr}`);
                continue;
            }

            routineData.push({
                id: crypto.randomUUID(),
                courseId: course.id,
                semester,
                dayOfWeek,
                schedule
            });
        }

        if (routineData.length === 0) return { success: false, error: "No valid routine data entries found." };

        // Batch processing (Upsert logic)
        await db.transaction(async (tx) => {
            for (const item of routineData) {
                const existing = await tx.query.routines.findFirst({
                    where: and(
                        eq(routines.courseId, item.courseId),
                        eq(routines.semester, item.semester),
                        eq(routines.dayOfWeek, item.dayOfWeek)
                    )
                });

                if (existing) {
                    await tx.update(routines).set({ schedule: item.schedule }).where(eq(routines.id, existing.id));
                } else {
                    await tx.insert(routines).values(item);
                }
            }
        });

        revalidatePath("/dashboard");
        revalidatePath("/management");
        return { success: true, count: routineData.length };
    } catch (error) {
        console.error("Bulk Add Routines Error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to process file." };
    }
}

/**
 * Fetches all routines with their associated course names.
 */
export async function getAllRoutines() {
    try {
        const data = await db.select({
            id: routines.id,
            courseId: routines.courseId,
            courseName: courses.name,
            semester: routines.semester,
            dayOfWeek: routines.dayOfWeek,
            schedule: routines.schedule,
        })
        .from(routines)
        .leftJoin(courses, eq(routines.courseId, courses.id))
        .orderBy(courses.name, routines.semester, routines.dayOfWeek);

        return { success: true, data };
    } catch (error) {
        console.error("Error fetching all routines:", error);
        return { success: false, error: "Failed to fetch routines." };
    }
}

/**
 * Deletes a routine entry by ID.
 */
export async function deleteRoutineAction(id: string) {
    try {
        await db.delete(routines).where(eq(routines.id, id));
        revalidatePath("/dashboard");
        revalidatePath("/management");
        return { success: true };
    } catch (error) {
        console.error("Error deleting routine:", error);
        return { success: false, error: "Failed to delete routine." };
    }
}

/**
 * Deletes ALL routine entries from the database.
 */
export async function deleteAllRoutinesAction() {
    try {
        await db.delete(routines);
        revalidatePath("/dashboard");
        revalidatePath("/management");
        return { success: true };
    } catch (error) {
        console.error("Error clearing all routines:", error);
        return { success: false, error: "Failed to clear routine data." };
    }
}
