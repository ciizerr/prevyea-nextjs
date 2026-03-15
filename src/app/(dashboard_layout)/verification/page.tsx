import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { pyqs, users, roleApplications, bugReports, courses, subjects } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { CheckCircle2, XCircle, ShieldQuestion, Bug } from "lucide-react";
import { approvePYQAction, rejectPYQAction, approveApplicationAction, rejectApplicationAction } from "@/actions/moderation";
import { resolveBugReportAction, rejectBugReportAction } from "@/actions/reports";
import { DocumentQueue } from "@/components/verification/document-queue";

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

    // 3. Fetch PENDING Role Applications
    let pendingApps: { app: typeof roleApplications.$inferSelect, user: { name: string | null, email: string, instagram: string | null, discord: string | null, github: string | null } | null }[] = [];

    if (currentUser.role === "ADMIN") {
        pendingApps = await db.select({
            app: roleApplications,
            user: { 
                name: users.name, 
                email: users.email,
                instagram: users.instagram,
                discord: users.discord,
                github: users.github
            }
        })
            .from(roleApplications)
            .leftJoin(users, eq(roleApplications.userId, users.id))
            .where(eq(roleApplications.status, "PENDING"))
            .orderBy(desc(roleApplications.createdAt));
    } else if (currentUser.role === "MODERATOR") {
        pendingApps = await db.select({
            app: roleApplications,
            user: { 
                name: users.name, 
                email: users.email,
                instagram: users.instagram,
                discord: users.discord,
                github: users.github
            }
        })
            .from(roleApplications)
            .leftJoin(users, eq(roleApplications.userId, users.id))
            .where(and(eq(roleApplications.status, "PENDING"), eq(roleApplications.role, "REVIEWER")))
            .orderBy(desc(roleApplications.createdAt));
    }

    // 4. Fetch PENDING Bug Reports
    let pendingBugs: { bug: typeof bugReports.$inferSelect, user: { name: string | null, email: string } | null }[] = [];
    if (currentUser.role === "ADMIN" || currentUser.role === "MODERATOR") {
        pendingBugs = await db.select({
            bug: bugReports,
            user: { name: users.name, email: users.email }
        })
            .from(bugReports)
            .leftJoin(users, eq(bugReports.userId, users.id))
            .where(eq(bugReports.status, "PENDING"))
            .orderBy(desc(bugReports.createdAt));
    }

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-16">

            {/* --- SECTION: DOCUMENTS (Client Component) --- */}
            <DocumentQueue 
                pendingUploads={pendingUploads} 
                approveAction={approvePYQAction} 
                rejectAction={rejectPYQAction} 
            />

            {/* --- SECTION: ROLE APPLICATIONS --- */}
            {(currentUser.role === "ADMIN" || currentUser.role === "MODERATOR") && (
                <section>
                    <div className="mb-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-indigo-100 dark:bg-indigo-500/10 p-2 rounded-xl text-indigo-600 dark:text-indigo-500">
                                <ShieldQuestion className="h-6 w-6" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">Role Applications</h2>
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400">
                            Review and approve user requests to join the moderation team.
                        </p>
                    </div>

                    {pendingApps.length === 0 ? (
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center text-zinc-500 dark:text-zinc-400 shadow-sm">
                            <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-emerald-500 opacity-50" />
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">No Applications</h3>
                            <p>There are currently no role applications awaiting your review.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {pendingApps.map(({ app, user }) => (
                                <div key={app.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                                                Request for <span className="text-indigo-600 dark:text-indigo-400">{app.role}</span>
                                            </h3>
                                            <span className="bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                Pending
                                            </span>
                                        </div>
                                        <div className="text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                            <span className="font-semibold block mb-1">Reason provided:</span>
                                            &quot;{app.reason}&quot;
                                        </div>

                                        {/* Social Contacts */}
                                        {(user?.instagram || user?.discord || user?.github) && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {user?.instagram && (
                                                    <a href={`https://instagram.com/${user.instagram}`} target="_blank" rel="noreferrer" className="text-xs bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400 px-2 py-1 rounded-lg border border-pink-100 dark:border-pink-800/50 hover:bg-pink-100 transition-colors">
                                                        Instagram: @{user.instagram}
                                                    </a>
                                                )}
                                                {user?.discord && (
                                                    <span className="text-xs bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 px-2 py-1 rounded-lg border border-indigo-100 dark:border-indigo-800/50">
                                                        Discord: {user.discord}
                                                    </span>
                                                )}
                                                {user?.github && (
                                                    <a href={`https://github.com/${user.github}`} target="_blank" rel="noreferrer" className="text-xs bg-zinc-100 text-zinc-900 dark:bg-white/10 dark:text-zinc-300 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 transition-colors">
                                                        GitHub: {user.github}
                                                    </a>
                                                )}
                                            </div>
                                        )}

                                        <div className="text-sm text-zinc-500 mt-2">
                                            Applied by: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{user?.name || "Unknown"}</span> ({user?.email || "No email"})
                                            on {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Unknown date'}
                                        </div>
                                    </div>

                                    <div className="flex flex-col w-full md:w-auto lg:w-80 gap-3 shrink-0">
                                        <form className="flex flex-col gap-3 w-full">
                                            <textarea
                                                name="remark"
                                                placeholder="Optional remark to user..."
                                                className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                                                rows={2}
                                            />
                                            <div className="flex gap-3">
                                                <input type="hidden" name="applicationId" value={app.id} />

                                                <button
                                                    formAction={async (formData) => {
                                                        "use server";
                                                        await approveApplicationAction(formData);
                                                    }}
                                                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
                                                >
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    Approve
                                                </button>

                                                <button
                                                    formAction={async (formData) => {
                                                        "use server";
                                                        await rejectApplicationAction(formData);
                                                    }}
                                                    className="flex items-center justify-center p-3 text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-xl transition-colors"
                                                    title="Reject Application"
                                                >
                                                    <XCircle className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* --- SECTION: BUG REPORTS --- */}
            {(currentUser.role === "ADMIN" || currentUser.role === "MODERATOR") && (
                <section>
                    <div className="mb-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-red-100 dark:bg-red-500/10 p-2 rounded-xl text-red-600 dark:text-red-500">
                                <Bug className="h-6 w-6" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">Bug Reports</h2>
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400">
                            Review and resolve user-submitted platform issues.
                        </p>
                    </div>

                    {pendingBugs.length === 0 ? (
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center text-zinc-500 dark:text-zinc-400 shadow-sm">
                            <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-emerald-500 opacity-50" />
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Zero Bugs Found</h3>
                            <p>No new bug reports are currently awaiting your action.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {pendingBugs.map(({ bug, user }) => (
                                <div key={bug.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                                                {bug.title}
                                            </h3>
                                            <span className="bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                Pending
                                            </span>
                                        </div>
                                        <div className="text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 whitespace-pre-wrap">
                                            {bug.description}
                                        </div>
                                        <div className="text-sm text-zinc-500 mt-2">
                                            Reported by: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{user?.name || "Unknown"}</span> ({user?.email || "No email"})
                                            on {new Date(bug.createdAt!).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="flex flex-col w-full md:w-auto lg:w-80 gap-3 shrink-0">
                                        <form className="flex flex-col gap-3 w-full">
                                            <textarea
                                                name="remark"
                                                placeholder="Optional remark to user..."
                                                className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                                                rows={2}
                                            />
                                            <div className="flex gap-3">
                                                <input type="hidden" name="reportId" value={bug.id} />

                                                <button
                                                    formAction={async (formData) => {
                                                        "use server";
                                                        await resolveBugReportAction(formData);
                                                    }}
                                                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
                                                >
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    Resolve
                                                </button>

                                                <button
                                                    formAction={async (formData) => {
                                                        "use server";
                                                        await rejectBugReportAction(formData);
                                                    }}
                                                    className="flex items-center justify-center p-3 text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-xl transition-colors"
                                                    title="Reject Report"
                                                >
                                                    <XCircle className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

        </div>
    );
}
