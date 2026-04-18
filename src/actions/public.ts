"use server";

import { db } from "@/db";
import { pyqs, subjects, users, courses } from "@/db/schema";
import { eq, desc, count, sql, and, isNotNull } from "drizzle-orm";

export async function getLandingStats() {
    try {
        const pyqsCountResult = await db.select({ value: count(pyqs.id) }).from(pyqs).where(eq(pyqs.status, "APPROVED"));
        const subjectsCountResult = await db.select({ value: count(subjects.id) }).from(subjects);
        const usersCountResult = await db.select({ value: count(users.id) }).from(users);

        return {
            pyqsCount: pyqsCountResult[0].value,
            subjectsCount: subjectsCountResult[0].value,
            usersCount: usersCountResult[0].value,
        };
    } catch (error) {
        console.error("Failed to fetch landing stats:", error);
        return { pyqsCount: 500, subjectsCount: 10, usersCount: 13 }; // Fallback numbers
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
                subjectId: pyqs.subjectId,
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

export async function getLeaderboard() {
    try {
        const topUsersQuery = await db.select({
            uploaderId: pyqs.uploaderId,
            uploads: sql<number>`count(${pyqs.id})`.mapWith(Number),
        })
            .from(pyqs)
            .where(and(eq(pyqs.status, "APPROVED"), isNotNull(pyqs.uploaderId)))
            .groupBy(pyqs.uploaderId)
            .orderBy(desc(sql<number>`count(${pyqs.id})`))
            .limit(5);

        const allCourses = await db.select().from(courses);
        const courseMap = new Map(allCourses.map(c => [c.id, c.name]));

        const leaderboardData = [];
        let rank = 1;

        for (const u of topUsersQuery) {
            if (!u.uploaderId) continue;

            const userDocs = await db.select().from(users).where(eq(users.id, u.uploaderId)).limit(1);
            if (userDocs.length === 0) continue;
            const user = userDocs[0];

            const recentUploads = await db.select({ title: pyqs.title })
                .from(pyqs)
                .where(and(eq(pyqs.uploaderId, u.uploaderId), eq(pyqs.status, "APPROVED")))
                .orderBy(desc(pyqs.createdAt))
                .limit(1);

            let recentText = "Contributed to archive";
            if (recentUploads.length > 0) {
                recentText = `Uploaded ${recentUploads[0].title}`;
            }

            leaderboardData.push({
                rank: rank++,
                name: user.name || user.username || "Unknown Student",
                course: user.course ? (courseMap.get(user.course) || "General") : "General",
                uploads: u.uploads,
                points: Math.floor(u.uploads * 10),
                recent: recentText
            });
        }

        return leaderboardData;
    } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
        return [];
    }
}
