"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";

export async function completeOnboardingAction(formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("Unauthorized");

        const username = formData.get("username") as string;
        const collegeId = formData.get("collegeId") as string;
        const courseId = formData.get("courseId") as string;
        const sessionPayload = formData.get("session") as string;

        if (!username || !courseId || !sessionPayload || !collegeId) {
            throw new Error("Missing required fields.");
        }

        // 1. Strict formatting validation
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!usernameRegex.test(username)) {
            throw new Error("Invalid username format.");
        }

        // 2. Check if the user has already onboarded
        const currentUser = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
        });

        if (currentUser?.username) {
            throw new Error("Username already set. It cannot be changed.");
        }

        // 3. Uniqueness check
        const existingUsername = await db.query.users.findFirst({
            where: eq(users.username, username.toLowerCase()),
        });

        if (existingUsername) {
            throw new Error("Username already taken. Please choose another.");
        }

        // 4. Update the user record
        await db.update(users)
            .set({
                username: username.toLowerCase(),
                collegeId: collegeId,
                course: courseId,
                session: sessionPayload
            })
            .where(eq(users.id, session.user.id));

        return { success: true, message: "Onboarding complete!" };
    } catch (error) {
        console.error("Onboarding Error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to complete onboarding." };
    }
}

export async function getUserProfileAction() {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("Unauthorized");

        const user = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
        });

        if (!user) throw new Error("User not found.");

        return {
            success: true,
            data: {
                id: user.id,
                name: user.name ?? "",
                username: user.username ?? "",
                email: user.email,
                image: user.image ?? "",
                role: user.role ?? "USER",
                course: user.course ?? "",
                session: user.session ?? "",
                collegeId: user.collegeId ?? "",
            }
        };
    } catch (error) {
        console.error("Get Profile Error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to fetch profile." };
    }
}

export async function updateProfileAction(formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("Unauthorized");

        const name = formData.get("name") as string;
        const image = formData.get("image") as string;
        const course = formData.get("course") as string;
        const sessionPayload = formData.get("session") as string;
        const collegeId = formData.get("collegeId") as string;

        if (!name?.trim()) {
            throw new Error("Name is required.");
        }

        await db.update(users)
            .set({
                name: name.trim(),
                image: image?.trim() || null,
                course: course || null,
                session: sessionPayload || null,
                collegeId: collegeId || null,
            })
            .where(eq(users.id, session.user.id));

        return { success: true, message: "Profile updated successfully!" };
    } catch (error) {
        console.error("Update Profile Error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to update profile." };
    }
}

export async function deleteAccountAction() {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("Unauthorized");

        const userId = session.user.id;

        // 1. Preserve user-contributed content by setting foreign keys to null
        // Assuming pyqs and notices have uploaderId / authorId
        // We will need to import these schemas in the action if not already present
        const { pyqs, notices, accounts, sessions, roleApplications } = await import("@/db/schema");

        await db.update(pyqs)
            .set({ uploaderId: null })
            .where(eq(pyqs.uploaderId, userId));

        await db.update(notices)
            .set({ authorId: null })
            .where(eq(notices.authorId, userId));

        // 2. Cascade delete dependent records first
        await db.delete(accounts).where(eq(accounts.userId, userId));
        await db.delete(sessions).where(eq(sessions.userId, userId));
        await db.delete(roleApplications).where(eq(roleApplications.userId, userId));

        // 3. Delete the user record
        await db.delete(users).where(eq(users.id, userId));

        return { success: true, message: "Account deleted successfully." };
    } catch (error) {
        console.error("Delete Account Error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to delete account." };
    }
}

