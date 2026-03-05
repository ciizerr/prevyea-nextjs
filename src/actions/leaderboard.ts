"use server";

import { db } from "@/db";
import { users, pyqs, courses } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export interface LeaderboardUser {
    id: string;
    username: string | null;
    name: string | null;
    image: string | null;
    role: string | null;
    courseName: string | null;
    uploadCount: number;
}

export async function getLeaderboardAction(): Promise<{ success: boolean; data?: LeaderboardUser[]; error?: string }> {
    try {
        // Find all users who have approved uploads and count them
        // Using drizzle's query builder for grouping
        const results = await db
            .select({
                id: users.id,
                username: users.username,
                name: users.name,
                image: users.image,
                role: users.role,
                courseId: users.course, // We need to fetch course name separately or join
                uploadCount: sql<number>`count(${pyqs.id})`.mapWith(Number)
            })
            .from(users)
            .innerJoin(pyqs, eq(users.id, pyqs.uploaderId))
            .where(eq(pyqs.status, "APPROVED"))
            .groupBy(users.id)
            .orderBy(desc(sql`count(${pyqs.id})`))
            .limit(100);

        // Optional: Get all courses to map courseId to courseName without a massive complex join
        const allCourses = await db.select().from(courses);
        const courseMap = new Map(allCourses.map(c => [c.id, c.name]));

        const formattedResults: LeaderboardUser[] = results.map(row => ({
            id: row.id,
            username: row.username,
            name: row.name,
            image: row.image,
            role: row.role,
            courseName: row.courseId ? (courseMap.get(row.courseId) || "No Course") : "No Course",
            uploadCount: row.uploadCount,
        }));

        return { success: true, data: formattedResults };
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return { success: false, error: "Failed to load leaderboard." };
    }
}
