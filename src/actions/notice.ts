"use server";

import { db } from "@/db";
import { notices, users, notifications } from "@/db/schema";
import { auth } from "@/auth";
import { eq, desc, and, or, isNull, gt, lt, isNotNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getNoticesAction() {
    try {
        const now = new Date();
        const results = await db
            .select({
                id: notices.id,
                title: notices.title,
                content: notices.content,
                type: notices.type,
                createdAt: notices.createdAt,
                updatedAt: notices.updatedAt,
                expiresAt: notices.expiresAt,
                authorId: notices.authorId,
                authorName: users.name,
                authorRole: users.role,
            })
            .from(notices)
            .leftJoin(users, eq(notices.authorId, users.id))
            // Show only non-expired notices
            .where(or(isNull(notices.expiresAt), gt(notices.expiresAt, now)))
            .orderBy(desc(notices.createdAt));

        return { success: true, data: results };
    } catch (error) {
        console.error("Failed to fetch notices:", error);
        return { success: false, error: "Failed to load notices." };
    }
}

export async function createNoticeAction(formData: FormData) {
    try {
        const session = await auth();
        // @ts-expect-error - Custom role type
        const role = session?.user?.role;

        if (!session?.user?.id || (role !== "ADMIN" && role !== "MODERATOR")) {
            return { success: false, error: "Unauthorized. Only Admins and Moderators can create notices." };
        }

        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const type = formData.get("type") as "Exam" | "Event" | "General";
        const expiresAtRaw = formData.get("expiresAt") as string | null;

        if (!title || !content || !type) {
            return { success: false, error: "Please provide all required fields." };
        }

        const expiresAt = expiresAtRaw ? new Date(expiresAtRaw) : null;

        await db.insert(notices).values({
            id: crypto.randomUUID(),
            title,
            content,
            type,
            authorId: session.user.id,
            expiresAt: expiresAt ?? undefined,
        });

        // Notify users who opted in for announcements
        const targetUsers = await db.query.users.findMany({
            where: eq(users.notifyNotices, true)
        });

        if (targetUsers.length > 0) {
            await db.insert(notifications).values(
                targetUsers.map(u => ({
                    id: crypto.randomUUID(),
                    userId: u.id,
                    title: `New ${type} Announcement`,
                    message: title,
                    read: false,
                    link: "/notice"
                }))
            );
        }

        revalidatePath("/notice");
        return { success: true, message: "Notice published successfully!" };
    } catch (error) {
        console.error("Failed to create notice:", error);
        return { success: false, error: "An unexpected error occurred." };
    }
}

export async function updateNoticeAction(formData: FormData) {
    try {
        const session = await auth();
        // @ts-expect-error - Custom role type
        const role = session?.user?.role;

        if (!session?.user?.id || (role !== "ADMIN" && role !== "MODERATOR")) {
            return { success: false, error: "Unauthorized." };
        }

        const id = formData.get("id") as string;
        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const type = formData.get("type") as "Exam" | "Event" | "General";
        const expiresAtRaw = formData.get("expiresAt") as string | null;

        if (!id || !title || !content || !type) {
            return { success: false, error: "Please provide all required fields." };
        }

        const expiresAt = expiresAtRaw ? new Date(expiresAtRaw) : null;

        await db.update(notices)
            .set({
                title,
                content,
                type,
                expiresAt: expiresAt ?? undefined,
                updatedAt: new Date(),
            })
            .where(and(eq(notices.id, id), eq(notices.authorId, session.user.id)));

        revalidatePath("/notice");
        return { success: true, message: "Notice updated successfully!" };
    } catch (error) {
        console.error("Failed to update notice:", error);
        return { success: false, error: "An unexpected error occurred." };
    }
}
export async function getArchivedNoticesAction() {
    try {
        const session = await auth();
        // @ts-expect-error - Custom role type
        const role = session?.user?.role;
        if (!session?.user?.id || (role !== "ADMIN" && role !== "MODERATOR")) {
            return { success: false, error: "Unauthorized." };
        }

        const now = new Date();
        const results = await db
            .select({
                id: notices.id,
                title: notices.title,
                content: notices.content,
                type: notices.type,
                createdAt: notices.createdAt,
                updatedAt: notices.updatedAt,
                expiresAt: notices.expiresAt,
                authorId: notices.authorId,
                authorName: users.name,
                authorRole: users.role,
            })
            .from(notices)
            .leftJoin(users, eq(notices.authorId, users.id))
            // Only notices that HAD an expiry and it has now passed
            .where(and(isNotNull(notices.expiresAt), lt(notices.expiresAt, now)))
            .orderBy(desc(notices.expiresAt));

        return { success: true, data: results };
    } catch (error) {
        console.error("Failed to fetch archived notices:", error);
        return { success: false, error: "Failed to load archived notices." };
    }
}

export async function deleteNoticeAction(id: string) {
    try {
        const session = await auth();
        // @ts-expect-error - Custom role type
        const role = session?.user?.role;
        const userId = session?.user?.id;

        if (!userId || (role !== "ADMIN" && role !== "MODERATOR")) {
            return { success: false, error: "Unauthorized." };
        }

        const condition = role === "ADMIN"
            ? eq(notices.id, id)
            : and(eq(notices.id, id), eq(notices.authorId, userId));

        await db.delete(notices).where(condition);

        revalidatePath("/notice");
        return { success: true, message: "Notice deleted." };
    } catch (error) {
        console.error("Failed to delete notice:", error);
        return { success: false, error: "An unexpected error occurred." };
    }
}
