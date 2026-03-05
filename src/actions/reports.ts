"use server";

import { db } from "@/db";
import { bugReports, users, notifications } from "@/db/schema";
import { auth } from "@/auth";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createReportAction(title: string, description: string) {
    const session = await auth();
    if (!session?.user?.email) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const user = await db.query.users.findFirst({
            where: eq(users.email, session.user.email)
        });

        if (!user) return { success: false, error: "User not found" };

        const reportId = crypto.randomUUID();
        await db.insert(bugReports).values({
            id: reportId,
            userId: user.id,
            title,
            description,
            status: "PENDING"
        });

        // Notify Admins/Moderators
        const admins = await db.query.users.findMany({
            where: inArray(users.role, ["ADMIN", "MODERATOR"])
        });

        if (admins.length > 0) {
            await db.insert(notifications).values(
                admins.map(admin => ({
                    id: crypto.randomUUID(),
                    userId: admin.id,
                    title: "New Bug Report",
                    message: `${user.name || "A user"} reported a bug: "${title}".`,
                    read: false,
                    link: "/verification"
                }))
            );
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to create report:", error);
        return { success: false, error: "Failed to submit report" };
    }
}

export async function resolveBugReportAction(formData: FormData) {
    const session = await auth();
    // Only MODERATOR, REVIEWER or ADMIN are generally on the verification page.
    // Ensure auth is solid
    if (!session?.user?.id) throw new Error("Unauthorized");

    const reportId = formData.get("reportId") as string;
    const remark = formData.get("remark") as string | null;
    if (!reportId) throw new Error("No report ID provided");

    const currentUser = await db.query.users.findFirst({
        where: eq(users.id, session.user.id as string),
    });

    if (currentUser?.role !== "ADMIN" && currentUser?.role !== "MODERATOR") {
        throw new Error("Unauthorized");
    }

    try {
        const report = await db.query.bugReports.findFirst({
            where: eq(bugReports.id, reportId)
        });

        if (!report) throw new Error("Report not found");

        await db.update(bugReports).set({
            status: "RESOLVED",
            adminNote: remark || null
        }).where(eq(bugReports.id, reportId));

        let message = `Your bug report "${report.title}" has been reviewed and resolved by our team. Thanks for helping!`;
        if (remark) {
            message += `\nAdmin Remark: ${remark}`;
        }

        // Notify the user
        await db.insert(notifications).values({
            id: crypto.randomUUID(),
            userId: report.userId,
            title: "Bug Report Resolved",
            message,
            read: false,
        });

        revalidatePath("/verification");
        return { success: true };
    } catch (error) {
        console.error("Failed to resolve bug report:", error);
        throw new Error("Failed to resolve bug report");
    }
}

export async function rejectBugReportAction(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const reportId = formData.get("reportId") as string;
    const remark = formData.get("remark") as string | null;
    if (!reportId) throw new Error("No report ID provided");

    const currentUser = await db.query.users.findFirst({
        where: eq(users.id, session.user.id as string),
    });

    if (currentUser?.role !== "ADMIN" && currentUser?.role !== "MODERATOR") {
        throw new Error("Unauthorized");
    }

    try {
        const report = await db.query.bugReports.findFirst({
            where: eq(bugReports.id, reportId)
        });

        if (!report) throw new Error("Report not found");

        await db.update(bugReports).set({
            status: "REJECTED",
            adminNote: remark || null
        }).where(eq(bugReports.id, reportId));

        let message = `Your bug report "${report.title}" was reviewed but marked as duplicate or invalid.`;
        if (remark) {
            message += `\nAdmin Remark: ${remark}`;
        }

        // Notify the user
        await db.insert(notifications).values({
            id: crypto.randomUUID(),
            userId: report.userId,
            title: "Bug Report Rejected",
            message,
            read: false,
        });

        revalidatePath("/verification");
        return { success: true };
    } catch (error) {
        console.error("Failed to reject bug report:", error);
        throw new Error("Failed to reject bug report");
    }
}
