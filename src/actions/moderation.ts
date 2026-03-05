"use server";

import { db } from "@/db";
import { pyqs, users, roleApplications, notifications } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and, ne } from "drizzle-orm";
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
        const remark = formData.get("remark") as string | null;

        if (!pyqId) throw new Error("Missing Document ID");

        const pyq = await db.query.pyqs.findFirst({ where: eq(pyqs.id, pyqId) });
        if (!pyq) throw new Error("Document not found");

        await db.update(pyqs)
            .set({ status: "APPROVED" })
            .where(eq(pyqs.id, pyqId));

        if (pyq.uploaderId) {
            let message = `Your document "${pyq.title}" has been approved and is now live in the vault!`;
            if (remark) message += `\nReviewer Remark: ${remark}`;

            await db.insert(notifications).values({
                id: crypto.randomUUID(),
                userId: pyq.uploaderId,
                title: "Document Approved",
                message,
                read: false
            });
        }

        // Notify other users of the same course who have notifications enabled
        const targetUsers = await db.query.users.findMany({
            where: and(
                eq(users.notifyPyqs, true),
                eq(users.course, pyq.courseId),
                pyq.uploaderId ? ne(users.id, pyq.uploaderId) : undefined
            )
        });

        if (targetUsers.length > 0) {
            await db.insert(notifications).values(
                targetUsers.map(u => ({
                    id: crypto.randomUUID(),
                    userId: u.id,
                    title: `New Document for your Course`,
                    message: `A new document "${pyq.title}" has just been added to the vault for your course!`,
                    read: false,
                    link: "/vault"
                }))
            );
        }

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
        const remark = formData.get("remark") as string | null;

        if (!pyqId) throw new Error("Missing Document ID");

        // 1. Fetch the document to get the Cloudinary Public ID and Uploader ID
        const doc = await db.query.pyqs.findFirst({
            where: eq(pyqs.id, pyqId)
        });

        if (!doc) throw new Error("Document not found");

        // 2. Notify User before deletion
        if (doc.uploaderId) {
            let message = `Your document "${doc.title}" has been rejected and removed.`;
            if (remark) message += `\nReviewer Remark: ${remark}`;

            await db.insert(notifications).values({
                id: crypto.randomUUID(),
                userId: doc.uploaderId,
                title: "Document Rejected",
                message,
                read: false
            });
        }

        // 3. Delete from Cloudinary to save space
        if (doc.driveId) {
            await cloudinary.uploader.destroy(doc.driveId, { resource_type: "raw" });
        }

        // 4. Delete from Turso Database
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
        const remark = formData.get("remark") as string | null;
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
            .set({
                status: "APPROVED",
                updatedAt: new Date(),
                adminNote: remark || null
            })
            .where(eq(roleApplications.id, applicationId));

        // 5. Notify the user
        let message = `Your application to become a ${application.role} has been approved! Registration complete.`;
        if (remark) message += `\nAdmin Remark: ${remark}`;

        await db.insert(notifications).values({
            id: crypto.randomUUID(),
            userId: application.userId,
            title: "Role Application Approved",
            message,
            read: false
        });

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
        const remark = formData.get("remark") as string | null;
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
            .set({
                status: "REJECTED",
                updatedAt: new Date(),
                adminNote: remark || null
            })
            .where(eq(roleApplications.id, applicationId));

        // 4. Notify the user
        let message = `Your application for the ${application.role} role has been reviewed and rejected.`;
        if (remark) message += `\nAdmin Remark: ${remark}`;

        await db.insert(notifications).values({
            id: crypto.randomUUID(),
            userId: application.userId,
            title: "Role Application Rejected",
            message,
            read: false
        });

        revalidatePath("/verification");

        return { success: true, message: "Application Rejected!" };
    } catch (error) {
        console.error("Application Rejection Error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Rejection failed" };
    }
}
