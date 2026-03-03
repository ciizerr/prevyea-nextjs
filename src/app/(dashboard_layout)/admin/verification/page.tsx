import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { pyqs, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { CheckCircle2, XCircle, ExternalLink, Clock } from "lucide-react";
import { approvePYQAction, rejectPYQAction } from "@/actions/moderation";

export default async function AdminVerificationPage() {
    const session = await auth();

    // 1. Strict Role Protection
    if (!session?.user?.id) {
        redirect("/login");
    }

    const currentUser = await db.query.users.findFirst({
        where: eq(users.id, session.user.id as string),
    });

    if (currentUser?.role !== "ADMIN" && currentUser?.role !== "MODERATOR") {
        redirect("/dashboard"); // Kick normal users out
    }

    // 2. Fetch PENDING pyqs with uploader details
    const pendingUploads = await db
        .select({
            pyq: pyqs,
            uploader: {
                name: users.name,
                email: users.email,
            }
        })
        .from(pyqs)
        .leftJoin(users, eq(pyqs.uploaderId, users.id))
        .where(eq(pyqs.status, "PENDING"))
        .orderBy(desc(pyqs.createdAt));

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-amber-100 dark:bg-amber-500/10 p-2 rounded-xl text-amber-600 dark:text-amber-500">
                        <Clock className="h-6 w-6" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">Verification Queue</h1>
                </div>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Review community submitted PYQs and Notes. Approved documents instantly appear in the public Vault.
                </p>
            </div>

            {pendingUploads.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center text-zinc-500 dark:text-zinc-400 shadow-sm">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-emerald-500 opacity-50" />
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">All Caught Up!</h3>
                    <p>There are currently no document submissions awaiting your review.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {pendingUploads.map(({ pyq, uploader }) => (
                        <div key={pyq.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">

                            {/* Document Info */}
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{pyq.title}</h3>
                                    <span className="bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                        Pending
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
                                    <span className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg font-medium">{pyq.course} • {pyq.semester}</span>
                                    <span className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg font-medium">{pyq.subject}</span>
                                    <span className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg font-medium">{pyq.year}</span>
                                </div>
                                <div className="text-sm text-zinc-500 mt-2">
                                    Uploaded by: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{uploader?.name || "Anonymous Student"}</span> ({uploader?.email || "No email"})
                                    on {pyq.createdAt ? new Date(pyq.createdAt).toLocaleDateString() : 'Unknown date'}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-row md:flex-col lg:flex-row w-full md:w-auto gap-3 shrink-0">
                                <a
                                    href={pyq.viewLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 px-6 py-3 rounded-xl font-bold transition-colors"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Preview PDF
                                </a>
                                <form className="flex gap-3 flex-1 md:flex-none">
                                    {/* Inputs for Server Actions */}
                                    <input type="hidden" name="pyqId" value={pyq.id} />

                                    <button
                                        formAction={async (formData) => {
                                            "use server";
                                            await approvePYQAction(formData);
                                        }}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                        Approve
                                    </button>

                                    <button
                                        formAction={async (formData) => {
                                            "use server";
                                            await rejectPYQAction(formData);
                                        }}
                                        className="flex items-center justify-center p-3 text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-xl transition-colors"
                                        title="Reject & Delete"
                                    >
                                        <XCircle className="h-5 w-5" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
