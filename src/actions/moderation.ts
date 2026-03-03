"use server";

import { db } from "@/db";
import { pyqs, users } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

// Ensure Cloudinary is configured
cloudinary.config({ secure: true });

async function checkAdminOrModerator() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const currentUser = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });

    if (currentUser?.role !== "ADMIN" && currentUser?.role !== "MODERATOR") {
        throw new Error("Insufficient permissions");
    }
    return currentUser;
}

export async function approvePYQAction(formData: FormData) {
    try {
        await checkAdminOrModerator();
        const pyqId = formData.get("pyqId") as string;

        if (!pyqId) throw new Error("Missing Document ID");

        await db.update(pyqs)
            .set({ status: "APPROVED" })
            .where(eq(pyqs.id, pyqId));

        revalidatePath("/admin/verification");
        revalidatePath("/vault");

        return { success: true, message: "Document Approved!" };
    } catch (error) {
        console.error("Approval Error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Approval failed" };
    }
}

export async function rejectPYQAction(formData: FormData) {
    try {
        await checkAdminOrModerator();
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

        revalidatePath("/admin/verification");

        return { success: true, message: "Document Rejected and Deleted!" };
    } catch (error) {
        console.error("Rejection Error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Rejection failed" };
    }
}
