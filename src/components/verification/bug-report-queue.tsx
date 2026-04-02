"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Bug, User, Mail, MessageSquare, Clock, AlertCircle, Trash2, Info } from "lucide-react";
import { toast } from "sonner";
import ClickSpark from "@/components/reactbits/ClickSpark";

interface BugReport {
    id: string;
    userId: string | null;
    title: string;
    description: string;
    status: string | null;
    adminNote: string | null;
    createdAt: Date | null | string;
}

interface BugReportQueueProps {
    pendingBugs: { bug: BugReport, user: { name: string | null, email: string } | null }[];
    resolveAction: (formData: FormData) => Promise<{ success: boolean; message?: string; error?: string }>;
    rejectAction: (formData: FormData) => Promise<{ success: boolean; message?: string; error?: string }>;
}

export function BugReportQueue({ pendingBugs, resolveAction, rejectAction }: BugReportQueueProps) {
    return (
        <section className="space-y-10 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-100 dark:bg-red-500/10 p-3 rounded-2xl text-red-600 dark:text-red-500 shadow-sm border border-red-200/50 dark:border-red-500/20">
                            <Bug className="h-7 w-7" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 italic">Bug Tracker</h1>
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400 font-bold max-w-xl text-lg">
                        Addressing <span className="text-red-600 dark:text-red-400">{pendingBugs.length} reported issues</span> to maintain stability.
                    </p>
                </div>
            </div>

            {pendingBugs.length === 0 ? (
                <div className="bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800/60 rounded-[4rem] p-24 text-center shadow-2xl">
                    <div className="w-28 h-28 bg-emerald-50 dark:bg-emerald-500/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-100 dark:border-emerald-500/10 rotate-12">
                        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                    </div>
                    <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 mb-2 tracking-tight">Zero Bugs!</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 font-bold max-w-xs mx-auto">Platform status: Stable. All reports have been resolved.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-12">
                    {pendingBugs.map(({ bug, user }) => (
                         <BugCard key={bug.id} bug={bug} user={user} resolveAction={resolveAction} rejectAction={rejectAction} />
                    ))}
                </div>
            )}
        </section>
    );
}

function BugCard({ bug, user, resolveAction, rejectAction }: { bug: BugReport, user: { name: string | null, email: string } | null, resolveAction: (formData: FormData) => Promise<{ success: boolean; message?: string; error?: string }>, rejectAction: (formData: FormData) => Promise<{ success: boolean; message?: string; error?: string }> }) {
    const [isPending, startTransition] = useTransition();
    const [remark, setRemark] = useState("");
    const [confirmState, setConfirmState] = useState<"IDLE" | "RESOLVING" | "REJECTING">("IDLE");

    const handleResolve = async () => {
        const formData = new FormData();
        formData.append("reportId", bug.id);
        formData.append("remark", remark);

        startTransition(async () => {
            try {
                await resolveAction(formData);
                toast.success("Bug report RESOLVED!");
            } catch (err) {
                toast.error("Status update failed.");
                console.error(err);
            } finally {
                setConfirmState("IDLE");
            }
        });
    };

    const handleReject = async () => {
        const formData = new FormData();
        formData.append("reportId", bug.id);
        formData.append("remark", remark);

        startTransition(async () => {
             try {
                await rejectAction(formData);
                toast.success("Bug report rejected.");
            } catch (err) {
                toast.error("Rejection failed.");
                console.error(err);
            } finally {
                setConfirmState("IDLE");
            }
        });
    };

    return (
        <div className={`relative group bg-white/60 dark:bg-zinc-950/40 backdrop-blur-md border-2 rounded-[3.5rem] transition-all duration-500 overflow-hidden shadow-sm hover:shadow-2xl ${
            confirmState === "RESOLVING" ? "border-emerald-500/60 shadow-emerald-500/10" :
            confirmState === "REJECTING" ? "border-red-500/60 shadow-red-500/10" :
            "border-zinc-200/80 dark:border-zinc-800/80"
        }`}>
            <div className="flex flex-col xl:flex-row divide-y xl:divide-y-0 xl:divide-x divide-zinc-200/50 dark:divide-zinc-800/50">
                
                {/* Main Content Info (60%) */}
                <div className="flex-1 p-8 md:p-12 space-y-8">
                    {/* Primary Bug Info */}
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="px-5 py-2 bg-red-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl">
                                STATUS: {bug.status || "REPORTED"}
                            </span>
                            <span className="px-5 py-2 bg-red-50 dark:bg-red-500/5 text-red-600 dark:text-red-400 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-red-100 dark:border-red-500/20 shadow-inner">
                                PRIORITY: HIGH
                            </span>
                        </div>
                        <div className="space-y-1">
                             <h3 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter leading-[0.9]">
                                {bug.title}
                            </h3>
                             <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                Report ID: {bug.id.slice(0, 8)} • {bug.id}
                            </div>
                        </div>
                    </div>

                    {/* Description Area */}
                    <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2.5rem] relative shadow-inner overflow-hidden">
                        <MessageSquare className="absolute -top-4 -right-4 h-24 w-24 text-zinc-100 dark:text-zinc-800 -rotate-12 opacity-40" />
                        <div className="relative">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 block italic">Bug Description</span>
                            <p className="text-lg font-bold text-zinc-700 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
                                {bug.description}
                            </p>
                        </div>
                    </div>

                    {/* Reporter Context */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                        <div className="flex items-center gap-4 bg-white/40 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm">
                             <div className="p-3 bg-zinc-100 dark:bg-zinc-950 rounded-xl text-zinc-400">
                                <User className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Reporter</span>
                                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">{user?.name || "Anonymous User"}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white/40 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm">
                            <div className="p-3 bg-zinc-100 dark:bg-zinc-950 rounded-xl text-zinc-400">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Contact</span>
                                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">{user?.email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                        <Clock className="h-3.5 w-3.5" /> 
                        Reported on {bug.createdAt ? new Date(bug.createdAt).toLocaleDateString() : 'Pending'}
                    </div>
                </div>

                {/* Developer Controls (40%) */}
                <div className="w-full xl:w-[450px] p-8 md:p-12 bg-zinc-50/50 dark:bg-zinc-900/10 flex flex-col gap-6">
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 pl-2 flex items-center gap-2">
                                <Info className="h-3 w-3" /> Fix Implementation Note
                            </label>
                            <textarea
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                                placeholder="Details about the resolution or fix applied..."
                                className="w-full min-h-[220px] text-sm font-bold bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 rounded-[2rem] px-6 py-5 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500/50 placeholder:text-zinc-300 dark:placeholder:text-zinc-700 transition-all resize-none shadow-inner"
                            />
                        </div>

                        {confirmState === "IDLE" ? (
                            <div className="grid grid-cols-2 gap-4">
                                <ClickSpark className="flex-1">
                                    <button
                                        disabled={isPending}
                                        onClick={() => setConfirmState("RESOLVING")}
                                        className="w-full flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white p-5 rounded-[1.75rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/10 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        <CheckCircle2 className="h-5 w-5" /> Resolve
                                    </button>
                                </ClickSpark>
                                <button
                                    disabled={isPending}
                                    onClick={() => setConfirmState("REJECTING")}
                                    className="flex items-center justify-center gap-3 bg-white dark:bg-zinc-950 border-2 border-red-500/50 text-red-500 p-5 rounded-[1.75rem] font-black text-xs uppercase tracking-widest transition-all hover:bg-red-50 dark:hover:bg-red-500/10 active:scale-95 disabled:opacity-50"
                                >
                                    <Trash2 className="h-5 w-5" /> Reject
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 p-2 animate-in slide-in-from-right-4 duration-300">
                                <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest ${
                                    confirmState === 'RESOLVING' ? 'text-emerald-600 bg-emerald-50/50 border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/20' : 'text-red-600 bg-red-50/50 border-red-100 dark:bg-red-500/5 dark:border-red-500/20'
                                }`}>
                                    <AlertCircle className="h-4 w-4" />
                                    Confirm Action?
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <ClickSpark className="flex-1">
                                        <button
                                            onClick={confirmState === "RESOLVING" ? handleResolve : handleReject}
                                            disabled={isPending}
                                            className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest text-white shadow-xl transition-all active:scale-95 disabled:opacity-50 ${
                                                confirmState === "RESOLVING" ? "bg-emerald-600 shadow-emerald-600/20" : "bg-red-600 shadow-red-600/20"
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

            {/* Decorative Assets */}
            <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-red-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-red-500/10 blur-[80px] rounded-full pointer-events-none" />
        </div>
    );
}
