"use server";

import { db } from "@/db";
import { roleApplications, users } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";

export async function getMyApplicationsAction() {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("Unauthorized");

        const apps = await db
            .select()
            .from(roleApplications)
            .where(eq(roleApplications.userId, session.user.id));

        return { success: true, data: apps };
    } catch (error) {
        console.error("Get Applications Error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to fetch applications." };
    }
}

export async function applyForRoleAction(formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("Unauthorized");

        const role = formData.get("role") as string;
        const reason = formData.get("reason") as string;

        if (!role || !reason?.trim()) {
            throw new Error("Role and reason are required.");
        }

        if (role !== "REVIEWER" && role !== "MODERATOR") {
            throw new Error("Invalid role.");
        }

        if (reason.trim().length < 20) {
            throw new Error("Please provide a more detailed reason (at least 20 characters).");
        }

        // Check if user already has this role
        const currentUser = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
        });

        if (currentUser?.role === role || currentUser?.role === "ADMIN") {
            throw new Error("You already have this role or a higher one.");
        }

        // Check for existing pending application for same role
        const existing = await db
            .select()
            .from(roleApplications)
            .where(
                and(
                    eq(roleApplications.userId, session.user.id),
                    eq(roleApplications.role, role),
                    eq(roleApplications.status, "PENDING")
                )
            );

        if (existing.length > 0) {
            throw new Error("You already have a pending application for this role.");
        }

        await db.insert(roleApplications).values({
            id: crypto.randomUUID(),
            userId: session.user.id,
            role,
            reason: reason.trim(),
        });

        return { success: true, message: "Application submitted successfully!" };
    } catch (error) {
        console.error("Apply Role Error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to submit application." };
    }
}
