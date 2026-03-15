"use server";

import { db } from "@/db";
import { notifications, users } from "@/db/schema";
import { auth } from "@/auth";
import { eq, desc, lt, and } from "drizzle-orm";

export async function getNotificationsAction() {
    const session = await auth();
    if (!session?.user?.email) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const user = await db.query.users.findFirst({
            where: eq(users.email, session.user.email)
        });

        if (!user) return { success: false, error: "User not found" };

        // 1. Delete read notifications older than 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        await db.delete(notifications).where(
            and(
                eq(notifications.userId, user.id),
                eq(notifications.read, true),
                lt(notifications.createdAt, sevenDaysAgo)
            )
        ).catch((err) => console.error("Pruning Old Notifications Failed:", err));

        // 2. Fetch fresh notifications
        const userNotifications = await db.query.notifications.findMany({
            where: eq(notifications.userId, user.id),
            orderBy: [desc(notifications.createdAt)],
            limit: 20
        });

        return { success: true, data: userNotifications };
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
        return { success: false, error: "Failed to fetch notifications" };
    }
}

export async function markAsReadAction(id: string) {
    const session = await auth();
    if (!session?.user?.email) return { success: false };

    try {
        await db.update(notifications)
            .set({ read: true })
            .where(eq(notifications.id, id));
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}

export async function markAllAsReadAction() {
    const session = await auth();
    if (!session?.user?.email) return { success: false };

    try {
        const user = await db.query.users.findFirst({
            where: eq(users.email, session.user.email)
        });
        if (!user) return { success: false };

        await db.update(notifications)
            .set({ read: true })
            .where(eq(notifications.userId, user.id));
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}
export async function clearNotificationsAction() {
    const session = await auth();
    if (!session?.user?.email) return { success: false };

    try {
        const user = await db.query.users.findFirst({
            where: eq(users.email, session.user.email)
        });
        if (!user) return { success: false };

        await db.delete(notifications)
            .where(eq(notifications.userId, user.id));
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}
