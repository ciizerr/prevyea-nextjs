"use server";

import { db } from "@/db";
import { pyqs, subjects } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";

export async function getLandingStats() {
    try {
        const pyqsCountResult = await db.select({ value: count(pyqs.id) }).from(pyqs).where(eq(pyqs.status, "APPROVED"));
        const subjectsCountResult = await db.select({ value: count(subjects.id) }).from(subjects);

        return {
            pyqsCount: pyqsCountResult[0].value,
            subjectsCount: subjectsCountResult[0].value,
        };
    } catch (error) {
        console.error("Failed to fetch landing stats:", error);
        return { pyqsCount: 500, subjectsCount: 10 }; // Fallback numbers
    }
}

export async function getRecentPyqs() {
    try {
        // Fetch the 4 newest items
        const result = await db
            .select({
                id: pyqs.id,
                title: pyqs.title,
                type: pyqs.type,
                year: pyqs.year,
                createdAt: pyqs.createdAt,
            })
            .from(pyqs)
            .where(eq(pyqs.status, "APPROVED"))
            .orderBy(desc(pyqs.createdAt))
            .limit(4);

        return result || [];
    } catch (error) {
        console.error("Failed to fetch recent pyqs:", error);
        return [];
    }
}
