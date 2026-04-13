"use server";

import { db } from "@/db";
import { pyqs, users, courses, subjects } from "@/db/schema";
import { auth } from "@/auth";
import { eq, desc, sum, count, and } from "drizzle-orm";

export type DashboardUpload = {
    id: string;
    title: string;
    courseName: string | null;
    semester: string;
    subjectName: string | null;
    createdAt: Date | null;
    uploaderName: string | null;
    downloadLink: string;
    type: "PYQ" | "Notes" | "Syllabus";
    subjectId: string;
};

export async function getDashboardData() {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const userId = session.user.id;
        const userName = session.user.name || "Student";

        // Fetch user stats
        const userStatsQuery = await db.select({
            totalDownloads: sum(pyqs.downloads),
            totalUploads: count(pyqs.id)
        }).from(pyqs).where(and(eq(pyqs.uploaderId, userId), eq(pyqs.status, "APPROVED")));

        const stats = userStatsQuery[0];
        const totalDownloads = Number(stats?.totalDownloads || 0);
        const totalUploads = Number(stats?.totalUploads || 0);

        // Fetch pending reviews
        const pendingQuery = await db.select({
            pendingUploads: count(pyqs.id)
        }).from(pyqs).where(and(eq(pyqs.uploaderId, userId), eq(pyqs.status, "PENDING")));

        const pendingUploads = Number(pendingQuery[0]?.pendingUploads || 0);
        // const communityPoints = (totalUploads * 50) + (totalDownloads * 5); // Unused
        // Study hours saved estimate - 2 hours per download + 5 hours per upload // Unused
        // const studyHoursSaved = (totalDownloads * 2) + (totalUploads * 5); // Unused

        // Fetch Rank
        const leaderboardQuery = await db.select({
            uploaderId: pyqs.uploaderId,
            uploadCount: count(pyqs.id)
        })
            .from(pyqs)
            .where(eq(pyqs.status, "APPROVED"))
            .groupBy(pyqs.uploaderId)
            .orderBy(desc(count(pyqs.id)));

        const rankIndex = leaderboardQuery.findIndex(l => l.uploaderId === userId);
        const userRank = rankIndex !== -1 ? rankIndex + 1 : "Unranked";

        // Fetch User Info for Routine
        const currentUser = await db.query.users.findFirst({
            where: eq(users.id, userId),
        });

        // Fetch recent global uploads
        const recentUploads = await db.select({
            id: pyqs.id,
            title: pyqs.title,
            courseName: courses.name,
            semester: pyqs.semester,
            subjectName: subjects.name,
            createdAt: pyqs.createdAt,
            uploaderName: users.name,
            downloadLink: pyqs.downloadLink,
            type: pyqs.type,
            subjectId: pyqs.subjectId,
        })
            .from(pyqs)
            .leftJoin(courses, eq(pyqs.courseId, courses.id))
            .leftJoin(subjects, eq(pyqs.subjectId, subjects.id))
            .leftJoin(users, eq(pyqs.uploaderId, users.id))
            .where(eq(pyqs.status, "APPROVED"))
            .orderBy(desc(pyqs.createdAt))
            .limit(3);

        return {
            success: true,
            data: {
                userName,
                totalDownloads,
                totalUploads,
                pendingUploads,
                userRank,
                recentUploads: recentUploads as DashboardUpload[],
                userCourseId: currentUser?.course || null,
                userSemester: currentUser?.semester || null
            }
        };
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return { success: false, error: "Failed to load dashboard data" };
    }
}
