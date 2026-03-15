"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react";
import { PreviewModal } from "@/components/management/preview-modal";

interface PendingUpload {
    pyq: {
        id: string;
        title: string;
        courseId: string;
        semester: string;
        subjectId: string;
        year: number;
        viewLink: string;
        type: string;
        createdAt: Date | null | string;
    };
    uploader: { name: string | null; email: string } | null;
    course: { name: string } | null;
    subject: { name: string } | null;
}

interface DocumentQueueProps {
    pendingUploads: PendingUpload[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    approveAction: (formData: FormData) => any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rejectAction: (formData: FormData) => any;
}

export function DocumentQueue({ pendingUploads, approveAction, rejectAction }: DocumentQueueProps) {
    const [previewFile, setPreviewFile] = useState<{ url: string; title: string } | null>(null);

    return (
        <section>
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-amber-100 dark:bg-amber-500/10 p-2 rounded-xl text-amber-600 dark:text-amber-500">
                        <Clock className="h-6 w-6" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">Document Queue</h1>
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
                    {pendingUploads.map(({ pyq, uploader, course, subject }) => (
                        <div key={pyq.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                            
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{pyq.title}</h3>
                                    <span className="bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                        Pending
                                    </span>
                                    <span className="bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                        {pyq.type}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
                                    <span className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg font-medium">{course?.name || pyq.courseId} • {pyq.semester}</span>
                                    <span className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg font-medium">{subject?.name || pyq.subjectId}</span>
                                    <span className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg font-medium">{pyq.year}</span>
                                </div>
                                <div className="text-sm text-zinc-500 mt-2">
                                    Uploaded by: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{uploader?.name || "Anonymous Student"}</span> ({uploader?.email || "No email"}) 
                                    on {pyq.createdAt ? new Date(pyq.createdAt).toLocaleDateString() : "Unknown date"}
                                </div>
                            </div>

                            <div className="flex flex-col w-full md:w-auto lg:w-80 gap-3 shrink-0">
                                <button
                                    onClick={() => setPreviewFile({ url: pyq.viewLink, title: pyq.title })}
                                    className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 px-6 py-3 rounded-xl font-bold transition-colors"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Preview PDF
                                </button>
                                <form className="flex flex-col gap-3 w-full" action={async (formData) => {
                                    const confirmResult = confirm("Approve this file?");
                                    if (confirmResult) await approveAction(formData);
                                }}>
                                    <textarea
                                        name="remark"
                                        placeholder="Optional remark to user..."
                                        className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                                        rows={2}
                                    />
                                    <div className="flex gap-3">
                                        <input type="hidden" name="pyqId" value={pyq.id} />
                                        <button
                                            type="submit"
                                            className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
                                        >
                                            <CheckCircle2 className="h-4 w-4" />
                                            Approve
                                        </button>
                                        <button
                                            formAction={rejectAction}
                                            className="flex items-center justify-center p-3 text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-xl transition-colors"
                                            title="Reject & Delete"
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

            <PreviewModal 
                isOpen={!!previewFile} 
                onClose={() => setPreviewFile(null)} 
                url={previewFile?.url || ""} 
                title={previewFile?.title || ""} 
            />
        </section>
    );
}
