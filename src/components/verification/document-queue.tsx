"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, XCircle, Clock, ExternalLink, User, Book, Calendar, Info, AlertCircle, FileText } from "lucide-react";
import { PreviewModal } from "@/components/management/preview-modal";
import { toast } from "sonner";
import ClickSpark from "@/components/reactbits/ClickSpark";
import Link from "next/link";

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
    uploader: { name: string | null; email: string; username: string | null } | null;
    course: { name: string } | null;
    subject: { name: string } | null;
}

interface DocumentQueueProps {
    pendingUploads: PendingUpload[];
    approveAction: (formData: FormData) => Promise<{ success: boolean; message?: string; error?: string }>;
    rejectAction: (formData: FormData) => Promise<{ success: boolean; message?: string; error?: string }>;
}

export function DocumentQueue({ pendingUploads, approveAction, rejectAction }: DocumentQueueProps) {
    const [previewFile, setPreviewFile] = useState<{ url: string; title: string } | null>(null);

    return (
        <section className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="bg-amber-100 dark:bg-amber-500/10 p-3 rounded-2xl text-amber-600 dark:text-amber-500 shadow-sm border border-amber-200/50 dark:border-amber-500/20">
                            <FileText className="h-7 w-7" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 italic">Document Queue</h1>
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400 font-bold max-w-xl text-lg">
                        Processing <span className="text-amber-600 dark:text-amber-400">{pendingUploads.length} materials</span> awaiting verification.
                    </p>
                </div>
            </div>

            {pendingUploads.length === 0 ? (
                <div className="bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800/60 rounded-[4rem] p-24 text-center shadow-2xl">
                    <div className="w-28 h-28 bg-emerald-50 dark:bg-emerald-500/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-100 dark:border-emerald-500/10 rotate-3">
                        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                    </div>
                    <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 mb-2 tracking-tight">Queue clear!</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 font-bold max-w-xs mx-auto">Sit back and relax, your work here is done for now.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-12">
                    {pendingUploads.map((item) => (
                        <ReviewCard key={item.pyq.id} item={item} approveAction={approveAction} rejectAction={rejectAction} onPreview={(url, title) => setPreviewFile({ url, title })} />
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

function ReviewCard({ item, approveAction, rejectAction, onPreview }: { item: PendingUpload; approveAction: (formData: FormData) => Promise<{ success: boolean; message?: string; error?: string }>; rejectAction: (formData: FormData) => Promise<{ success: boolean; message?: string; error?: string }>; onPreview: (url: string, title: string) => void }) {
    const { pyq, uploader, subject } = item;
    const [isPending, startTransition] = useTransition();
    const [confirmState, setConfirmState] = useState<"IDLE" | "APPROVING" | "REJECTING">("IDLE");
    const [remark, setRemark] = useState("");

    const handleApprove = async () => {
        const formData = new FormData();
        formData.append("pyqId", pyq.id);
        formData.append("remark", remark);

        startTransition(async () => {
            try {
                await approveAction(formData);
                toast.success("Resource Approved!");
            } catch (err) {
                toast.error("Approval failed.");
                console.error(err);
            } finally {
                setConfirmState("IDLE");
            }
        });
    };

    const handleReject = async () => {
        const formData = new FormData();
        formData.append("pyqId", pyq.id);
        formData.append("remark", remark);

        startTransition(async () => {
            try {
                await rejectAction(formData);
                toast.success("Resource Rejected.");
            } catch (err) {
                toast.error("Rejection failed.");
                console.error(err);
            } finally {
                setConfirmState("IDLE");
            }
        });
    };

    return (
        <div className={`relative group bg-white/60 dark:bg-zinc-950/40 backdrop-blur-md border-2 rounded-[3.5rem] transition-all duration-500 overflow-hidden shadow-sm hover:shadow-2xl ${confirmState === "APPROVING" ? "border-emerald-500/60 shadow-emerald-500/10" :
                confirmState === "REJECTING" ? "border-red-500/60 shadow-red-500/10" :
                    "border-zinc-200/80 dark:border-zinc-800/80"
            }`}>
            <div className="flex flex-col xl:flex-row divide-y xl:divide-y-0 xl:divide-x divide-zinc-200/50 dark:divide-zinc-800/50">

                {/* Main Content Info (60%) */}
                <div className="flex-1 p-8 md:p-12 space-y-8">
                    {/* Primary Subject & Title */}
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="px-5 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl">
                                {subject?.name || "Uncategorized"}
                            </span>
                            <span className={`px-5 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest border-2 ${pyq.type === "PYQ" ? "bg-indigo-50/50 text-indigo-600 border-indigo-100/50 dark:bg-indigo-500/5 dark:border-indigo-500/20" :
                                    "bg-amber-50/50 text-amber-600 border-amber-100/50 dark:bg-amber-500/5 dark:border-amber-500/20"
                                }`}>
                                {pyq.type}
                            </span>
                        </div>
                        <h3 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter leading-[0.9]">
                            {pyq.title}
                        </h3>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex items-center gap-4 group/item">
                            <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900 rounded-2xl shadow-inner border border-zinc-100 dark:border-zinc-800 group-hover/item:scale-105 transition-transform">
                                <Calendar className="h-5 w-5 text-zinc-400" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Year</span>
                                <span className="text-base font-bold text-zinc-800 dark:text-zinc-200">{pyq.year}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 group/item">
                            <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900 rounded-2xl shadow-inner border border-zinc-100 dark:border-zinc-800 group-hover/item:scale-105 transition-transform">
                                <Book className="h-5 w-5 text-zinc-400" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Semester</span>
                                <span className="text-base font-bold text-zinc-800 dark:text-zinc-200">{pyq.semester}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 group/item">
                            <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900 rounded-2xl shadow-inner border border-zinc-100 dark:border-zinc-800 group-hover/item:scale-105 transition-transform">
                                <User className="h-5 w-5 text-zinc-400" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Uploader</span>
                                <Link
                                    href={`/u/${uploader?.username}`}
                                    className="text-base font-bold text-zinc-800 dark:text-zinc-200 hover:text-indigo-600 transition-colors line-clamp-1"
                                >
                                    {uploader?.name || "Anonymous"}
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                        <Clock className="h-3.5 w-3.5" />
                        Submitted on {pyq.createdAt ? new Date(pyq.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                </div>

                {/* Reviewer Controls (40%) */}
                <div className="w-full xl:w-[450px] p-8 md:p-12 bg-zinc-50/50 dark:bg-zinc-900/10 flex flex-col gap-6">
                    <button
                        onClick={() => onPreview(pyq.viewLink, pyq.title)}
                        className="w-full relative group/btn overflow-hidden bg-white dark:bg-zinc-950 px-8 py-5 rounded-[2rem] border-2 border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all shadow-lg hover:shadow-indigo-500/5"
                    >
                        <div className="relative z-10 flex items-center justify-center gap-3">
                            <ExternalLink className="h-5 w-5 text-indigo-600" />
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white">Preview Document</span>
                        </div>
                    </button>

                    <div className="flex-1 flex flex-col gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 pl-2 flex items-center gap-2">
                                <Info className="h-3 w-3" /> Note to Creator
                            </label>
                            <textarea
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                                placeholder="State rejection reason or words of appreciation..."
                                className="w-full min-h-[160px] text-sm font-bold bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 rounded-[2rem] px-6 py-5 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 placeholder:text-zinc-300 dark:placeholder:text-zinc-700 transition-all resize-none shadow-inner"
                            />
                        </div>

                        {confirmState === "IDLE" ? (
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setConfirmState("APPROVING")}
                                    className="flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white p-5 rounded-[1.75rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
                                >
                                    <CheckCircle2 className="h-5 w-5" /> Approve
                                </button>
                                <button
                                    onClick={() => setConfirmState("REJECTING")}
                                    className="flex items-center justify-center gap-3 bg-white dark:bg-zinc-950 border-2 border-red-500/50 text-red-500 p-5 rounded-[1.75rem] font-black text-xs uppercase tracking-widest transition-all hover:bg-red-50 dark:hover:bg-red-500/10 active:scale-95"
                                >
                                    <XCircle className="h-5 w-5" /> Reject
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 p-2 animate-in slide-in-from-right-4 duration-300">
                                <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest ${confirmState === 'APPROVING' ? 'text-emerald-600 bg-emerald-50/50 border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/20' : 'text-red-600 bg-red-50/50 border-red-100 dark:bg-red-500/5 dark:border-red-500/20'
                                    }`}>
                                    <AlertCircle className="h-4 w-4" />
                                    Confirm Action?
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <ClickSpark className="flex-1">
                                        <button
                                            onClick={confirmState === "APPROVING" ? handleApprove : handleReject}
                                            disabled={isPending}
                                            className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest text-white shadow-xl transition-all active:scale-95 disabled:opacity-50 ${confirmState === "APPROVING" ? "bg-emerald-600 shadow-emerald-600/20" : "bg-red-600 shadow-red-600/20"
                                                }`}
                                        >
                                            {isPending ? "Hold on..." : "YES"}
                                        </button>
                                    </ClickSpark>
                                    <button
                                        disabled={isPending}
                                        onClick={() => setConfirmState("IDLE")}
                                        className="py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 active:scale-95 transition-all"
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Decorative Gradients */}
            <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />
        </div>
    );
}
