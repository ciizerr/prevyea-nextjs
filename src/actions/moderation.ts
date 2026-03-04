"use server";

import { db } from "@/db";
import { pyqs, users, roleApplications } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

// Ensure Cloudinary is configured
cloudinary.config({ secure: true });

async function checkReviewerAccess() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const currentUser = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });

    if (currentUser?.role !== "ADMIN" && currentUser?.role !== "MODERATOR" && currentUser?.role !== "REVIEWER") {
        throw new Error("Insufficient permissions");
    }
    return currentUser;
}

async function checkApplicationReviewAccess(requestedRole: "MODERATOR" | "REVIEWER") {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const currentUser = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });

    if (!currentUser) throw new Error("Unauthorized");

    // ADMIN can approve any application
    if (currentUser.role === "ADMIN") return currentUser;
    // MODERATOR can only approve REVIEWER applications
    if (currentUser.role === "MODERATOR" && requestedRole === "REVIEWER") return currentUser;

    throw new Error("Insufficient permissions to review this role application");
}

export async function approvePYQAction(formData: FormData) {
    try {
        await checkReviewerAccess();
        const pyqId = formData.get("pyqId") as string;

        if (!pyqId) throw new Error("Missing Document ID");

        await db.update(pyqs)
            .set({ status: "APPROVED" })
            .where(eq(pyqs.id, pyqId));

        revalidatePath("/verification");
        revalidatePath("/vault");

        return { success: true, message: "Document Approved!" };
    } catch (error) {
        console.error("Approval Error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Approval failed" };
    }
}

export async function rejectPYQAction(formData: FormData) {
    try {
        await checkReviewerAccess();
        const pyqId = formData.get("pyqId") as string;

        if (!pyqId) throw new Error("Missing Document ID");

        // 1. Fetch the document to get the Cloudinary Public ID
        const doc = await db.query.pyqs.findFirst({
            where: eq(pyqs.id, pyqId)
        });

        if (!doc) throw new Error("Document not found");

        // 2. Delete from Cloudinary to save space
        if (doc.driveId) {
            await cloudinary.uploader.destroy(doc.driveId, { resource_type: "raw" });
        }

        // 3. Delete from Turso Database
        await db.delete(pyqs).where(eq(pyqs.id, pyqId));

        revalidatePath("/verification");

        return { success: true, message: "Document Rejected and Deleted!" };
    } catch (error) {
        console.error("Rejection Error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Rejection failed" };
    }
}

export async function approveApplicationAction(formData: FormData) {
    try {
        const applicationId = formData.get("applicationId") as string;
        if (!applicationId) throw new Error("Missing Application ID");

        // 1. Fetch the application to see what role is being requested
        const application = await db.query.roleApplications.findFirst({
            where: eq(roleApplications.id, applicationId)
        });

        if (!application) throw new Error("Application not found");
        if (application.status !== "PENDING") throw new Error("Application is already processed");

        // 2. Verify permission to approve this specific role request
        await checkApplicationReviewAccess(application.role as "MODERATOR" | "REVIEWER");

        // 3. Update User's role
        await db.update(users)
            .set({ role: application.role as "MODERATOR" | "REVIEWER" })
            .where(eq(users.id, application.userId));

        // 4. Mark application as APPROVED
        await db.update(roleApplications)
            .set({ status: "APPROVED", updatedAt: new Date() })
            .where(eq(roleApplications.id, applicationId));

        revalidatePath("/verification");

        return { success: true, message: "Application Approved!" };
    } catch (error) {
        console.error("Application Approval Error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Approval failed" };
    }
}

export async function rejectApplicationAction(formData: FormData) {
    try {
        const applicationId = formData.get("applicationId") as string;
        if (!applicationId) throw new Error("Missing Application ID");

        // 1. Fetch the application to see what role is being requested
        const application = await db.query.roleApplications.findFirst({
            where: eq(roleApplications.id, applicationId)
        });

        if (!application) throw new Error("Application not found");
        if (application.status !== "PENDING") throw new Error("Application is already processed");

        // 2. Verify permission to reject this specific role request
        await checkApplicationReviewAccess(application.role as "MODERATOR" | "REVIEWER");

        // 3. Mark application as REJECTED
        await db.update(roleApplications)
            .set({ status: "REJECTED", updatedAt: new Date() })
            .where(eq(roleApplications.id, applicationId));

        revalidatePath("/verification");

        return { success: true, message: "Application Rejected!" };
    } catch (error) {
        console.error("Application Rejection Error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Rejection failed" };
    }
}
