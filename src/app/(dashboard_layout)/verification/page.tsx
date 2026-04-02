import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { pyqs, users, roleApplications, bugReports, courses, subjects } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { approvePYQAction, rejectPYQAction, approveApplicationAction, rejectApplicationAction } from "@/actions/moderation";
import { resolveBugReportAction, rejectBugReportAction } from "@/actions/reports";
import { DocumentQueue } from "@/components/verification/document-queue";
import { RoleApplicationQueue } from "@/components/verification/role-application-queue";
import { BugReportQueue } from "@/components/verification/bug-report-queue";

export default async function AdminVerificationPage() {
    const session = await auth();

    // 1. Strict Role Protection
    if (!session?.user?.id) {
        redirect("/login");
    }

    const currentUser = await db.query.users.findFirst({
        where: eq(users.id, session.user.id as string),
    });

    if (currentUser?.role !== "ADMIN" && currentUser?.role !== "MODERATOR" && currentUser?.role !== "REVIEWER") {
        redirect("/dashboard"); // Kick normal users out
    }

    // 2. Fetch PENDING pyqs with uploader details
    const pendingUploads = await db
        .select({
            pyq: pyqs,
            uploader: {
                name: users.name,
                email: users.email,
                username: users.username,
            },
            course: { name: courses.name },
            subject: { name: subjects.name }
        })
        .from(pyqs)
        .leftJoin(users, eq(pyqs.uploaderId, users.id))
        .leftJoin(courses, eq(pyqs.courseId, courses.id))
        .leftJoin(subjects, eq(pyqs.subjectId, subjects.id))
        .where(eq(pyqs.status, "PENDING"))
        .orderBy(desc(pyqs.createdAt));

    // 3. Fetch PENDING Role Applications (with typed casts for the queue)
    const pendingAppsRaw = await db.select({
        app: roleApplications,
        user: { 
            name: users.name, 
            email: users.email,
            username: users.username,
            instagram: users.instagram,
            discord: users.discord,
            github: users.github
        }
    })
    .from(roleApplications)
    .leftJoin(users, eq(roleApplications.userId, users.id))
    .where(currentUser.role === "ADMIN" 
        ? eq(roleApplications.status, "PENDING") 
        : and(eq(roleApplications.status, "PENDING"), eq(roleApplications.role, "REVIEWER")))
    .orderBy(desc(roleApplications.createdAt));

    // Fix typings for the component
    const pendingApps = pendingAppsRaw.map(r => ({
        app: {
            ...r.app,
            createdAt: r.app.createdAt ? r.app.createdAt.toISOString() : null
        },
        user: r.user
    }));

    // 4. Fetch PENDING Bug Reports (Admin Only)
    let pendingBugs: { 
        bug: { 
            id: string; 
            userId: string; 
            title: string; 
            description: string; 
            status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED" | null; 
            adminNote: string | null; 
            createdAt: Date | null; 
            updatedAt: Date | null; 
        }; 
        user: { name: string | null; email: string } | null 
    }[] = [];
    if (currentUser.role === "ADMIN") {
        const pendingBugsRaw = await db.select({
            bug: bugReports,
            user: { name: users.name, email: users.email }
        })
        .from(bugReports)
        .leftJoin(users, eq(bugReports.userId, users.id))
        .where(eq(bugReports.status, "PENDING"))
        .orderBy(desc(bugReports.createdAt));

        pendingBugs = pendingBugsRaw;
    }

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24">

            {/* --- SECTION: DOCUMENTS --- */}
            <DocumentQueue 
                pendingUploads={pendingUploads} 
                approveAction={approvePYQAction} 
                rejectAction={rejectPYQAction} 
            />

            {/* --- SECTION: ROLE APPLICATIONS --- */}
            {(currentUser.role === "ADMIN" || currentUser.role === "MODERATOR") && (
                <div className="pt-16 border-t border-zinc-200/60 dark:border-zinc-800/60">
                    <RoleApplicationQueue 
                        pendingApps={pendingApps} 
                        approveAction={approveApplicationAction} 
                        rejectAction={rejectApplicationAction} 
                    />
                </div>
            )}

            {/* --- SECTION: BUG REPORTS --- */}
            {(currentUser.role === "ADMIN") && (
                <div className="pt-16 border-t border-zinc-200/60 dark:border-zinc-800/60">
                    <BugReportQueue 
                        pendingBugs={pendingBugs} 
                        resolveAction={resolveBugReportAction} 
                        rejectAction={rejectBugReportAction} 
                    />
                </div>
            )}

        </div>
    );
}
