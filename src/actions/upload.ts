"use server";

import { v2 as cloudinary } from "cloudinary";
import { db } from "@/db";
import { pyqs, users, notifications } from "@/db/schema";
import { auth } from "@/auth";
import { inArray } from "drizzle-orm";
import crypto from "crypto";

// Cloudinary will automatically pick up the CLOUDINARY_URL env variable.
// We just need to ensure the config is explicitly initialized if needed.
cloudinary.config({ secure: true });

export async function uploadPYQAction(formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("You must be logged in to upload documents.");

        const file = formData.get("file") as File | null;
        const title = formData.get("title") as string;
        const type = formData.get("type") as "PYQ" | "Notes" | "Syllabus";
        const courseId = formData.get("courseId") as string;
        const semester = formData.get("semester") as string;
        const subjectId = formData.get("subjectId") as string;
        const year = parseInt(formData.get("year") as string);

        if (!file || !title || !type || !courseId || !semester || !subjectId || !year) {
            throw new Error("Missing required fields.");
        }

        // Ensure it's a PDF or Markdown
        if (file.type !== "application/pdf" && !file.name.endsWith(".md")) {
            throw new Error("Only PDF or Markdown (.md) files are allowed.");
        }

        // Enforce 5 MB limit server-side
        const MAX_BYTES = 5 * 1024 * 1024;
        if (file.size > MAX_BYTES) {
            throw new Error("File is too large. Maximum allowed size is 5 MB.");
        }

        // Read file into an ArrayBuffer, then convert to a Node Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload the Buffer directly to Cloudinary using a Promise stream
        const uploadResult = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "pu-library-pyqs", // Creates a specific folder in your loudinary dashboard
                    resource_type: "raw", // "raw" is strictly required by Cloudinary for PDFs/Docs
                    public_id: file.name, // Raw files in Cloudinary must include the file extension
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as { secure_url: string; public_id: string });
                }
            );

            // Pipe our file Buffer into the Cloudinary stream
            uploadStream.end(buffer);
        });

        if (!uploadResult?.secure_url) {
            throw new Error("Cloudinary upload failed to return a secure URL.");
        }

        // Insert into Turso DB
        await db.insert(pyqs).values({
            id: crypto.randomUUID(),
            title,
            type,
            courseId,
            semester,
            subjectId,
            year,
            driveId: uploadResult.public_id,
            viewLink: uploadResult.secure_url,
            downloadLink: uploadResult.secure_url,
            uploaderId: session.user.id,
            status: "PENDING",
            createdAt: new Date(), // Explicit Date object so Drizzle stores a proper Unix integer
        });

        // Notify Moderators/Admins/Reviewers
        const reviewers = await db.query.users.findMany({
            where: inArray(users.role, ["ADMIN", "MODERATOR", "REVIEWER"])
        });

        if (reviewers.length > 0) {
            await db.insert(notifications).values(
                reviewers.map(r => ({
                    id: crypto.randomUUID(),
                    userId: r.id,
                    title: "New Document Uploaded",
                    message: `A new document "${title}" is waiting for your review.`,
                    read: false,
                    link: "/verification"
                }))
            );
        }

        return {
            success: true,
            message: "File successfully uploaded to Cloudinary & registered to Database!",
            data: { url: uploadResult.secure_url },
        };

    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown upload failed",
        };
    }
}
