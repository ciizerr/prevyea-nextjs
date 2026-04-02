"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, XCircle, ShieldQuestion, User, Mail, MessageSquare, Clock, AlertCircle, Info } from "lucide-react";
import { SimpleInstagram, SimpleGithub, SimpleDiscord } from "@/components/si-icons";
import { toast } from "sonner";
import ClickSpark from "@/components/reactbits/ClickSpark";
import Link from "next/link";

interface RoleApp {
    id: string;
    role: string;
    status: string | null;
    reason: string;
    adminNote: string | null;
    createdAt: Date | null | string;
}

interface RoleUser {
    name: string | null;
    email: string;
    username: string | null;
    instagram: string | null;
    discord: string | null;
    github: string | null;
}

interface RoleApplicationQueueProps {
    pendingApps: { app: RoleApp, user: RoleUser | null }[];
    approveAction: (formData: FormData) => Promise<{ success: boolean; message?: string; error?: string }>;
    rejectAction: (formData: FormData) => Promise<{ success: boolean; message?: string; error?: string }>;
}

export function RoleApplicationQueue({ pendingApps, approveAction, rejectAction }: RoleApplicationQueueProps) {
    return (
        <section className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 dark:bg-indigo-500/10 p-3 rounded-2xl text-indigo-600 dark:text-indigo-500 shadow-sm border border-indigo-200/50 dark:border-indigo-500/20">
                            <ShieldQuestion className="h-7 w-7" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 italic">Moderation Requests</h1>
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400 font-bold max-w-xl text-lg">
                        Processing <span className="text-indigo-600 dark:text-indigo-400">{pendingApps.length} applicants</span> seeking roles.
                    </p>
                </div>
            </div>

            {pendingApps.length === 0 ? (
                <div className="bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800/60 rounded-[4rem] p-24 text-center shadow-2xl">
                    <div className="w-28 h-28 bg-emerald-50 dark:bg-emerald-500/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-100 dark:border-emerald-500/10 -rotate-3">
                        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                    </div>
                    <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 mb-2 tracking-tight">Zero Applications!</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 font-bold max-w-xs mx-auto">All potential mods have been reviewed. Status: Clear.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-12">
                    {pendingApps.map(({ app, user }) => (
                         <RoleCard key={app.id} app={app} user={user} approveAction={approveAction} rejectAction={rejectAction} />
                    ))}
                </div>
            )}
        </section>
    );
}

function RoleCard({ app, user, approveAction, rejectAction }: { app: RoleApp, user: RoleUser | null, approveAction: (formData: FormData) => Promise<{ success: boolean; message?: string; error?: string }>, rejectAction: (formData: FormData) => Promise<{ success: boolean; message?: string; error?: string }> }) {
    const [isPending, startTransition] = useTransition();
    const [confirmState, setConfirmState] = useState<"IDLE" | "APPROVING" | "REJECTING">("IDLE");
    const [remark, setRemark] = useState("");

    const handleApprove = async () => {
        const formData = new FormData();
        formData.append("applicationId", app.id);
        formData.append("remark", remark);

        startTransition(async () => {
             try {
                await approveAction(formData);
                toast.success(`User promoted to ${app.role}!`);
            } catch (err) {
                toast.error("Promotion failed.");
                console.error(err);
            } finally {
                setConfirmState("IDLE");
            }
        });
    };

    const handleReject = async () => {
        const formData = new FormData();
        formData.append("applicationId", app.id);
        formData.append("remark", remark);

        startTransition(async () => {
            try {
                await rejectAction(formData);
                toast.success("Application rejected.");
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
            confirmState === "APPROVING" ? "border-emerald-500/60 shadow-emerald-500/10" :
            confirmState === "REJECTING" ? "border-red-500/60 shadow-red-500/10" :
            "border-zinc-200/80 dark:border-zinc-800/80"
        }`}>
            <div className="flex flex-col xl:flex-row divide-y xl:divide-y-0 xl:divide-x divide-zinc-200/50 dark:divide-zinc-800/50">
                
                {/* Main Content Info (60%) */}
                <div className="flex-1 p-8 md:p-12 space-y-8">
                    {/* Primary Role Info */}
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="px-5 py-2 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl">
                                ROLE: {app.role}
                            </span>
                            <span className="px-5 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-zinc-200/50">
                                PENDING
                            </span>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-3xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 shadow-inner shrink-0 leading-none">
                                <User className="h-10 w-10" />
                            </div>
                            <div className="space-y-1">
                                <Link 
                                    href={`/u/${user?.username}`} 
                                    className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter hover:text-indigo-600 transition-colors leading-[0.9]"
                                >
                                    {user?.name || "Unknown User"}
                                </Link>
                                <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                    @{user?.username || "anonymous"} • <Mail className="h-3 w-3" /> {user?.email}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Socials & Reason */}
                    <div className="space-y-6">
                        <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2.5rem] relative shadow-inner overflow-hidden">
                            <MessageSquare className="absolute -top-4 -right-4 h-24 w-24 text-zinc-100 dark:text-zinc-800 -rotate-12 opacity-40" />
                            <div className="relative">
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 block">Application Reasoning</span>
                                <p className="text-xl font-bold text-zinc-700 dark:text-zinc-200 leading-relaxed italic pr-12">
                                    &quot;{app.reason}&quot;
                                </p>
                            </div>
                        </div>

                        {/* Social Verification Pills */}
                        {(user?.instagram || user?.discord || user?.github) && (
                            <div className="flex flex-wrap gap-3 pt-2">
                                {user?.instagram && (
                                    <a href={`https://instagram.com/${user.instagram}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-5 py-3 bg-pink-50 dark:bg-pink-500/5 text-pink-600 dark:text-pink-400 rounded-2xl text-xs font-bold border border-pink-100 dark:border-pink-500/10 hover:shadow-lg hover:shadow-pink-500/5 transition-all">
                                        <SimpleInstagram size={16} /> @{user.instagram}
                                    </a>
                                )}
                                {user?.discord && (
                                    <div className="flex items-center gap-3 px-5 py-3 bg-indigo-50 dark:bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 rounded-2xl text-xs font-bold border border-indigo-100 dark:border-indigo-500/10 shadow-sm">
                                        <SimpleDiscord size={16} /> {user.discord}
                                    </div>
                                )}
                                {user?.github && (
                                    <a href={`https://github.com/${user.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-5 py-3 bg-zinc-50 dark:bg-white/5 text-zinc-900 dark:text-zinc-300 rounded-2xl text-xs font-bold border border-zinc-200 dark:border-zinc-700 hover:shadow-lg transition-all">
                                        <SimpleGithub size={16} /> {user.github}
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4 pt-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                        <Clock className="h-3.5 w-3.5" /> 
                        Applied on {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                </div>

                {/* Reviewer Controls (40%) */}
                <div className="w-full xl:w-[450px] p-8 md:p-12 bg-zinc-50/50 dark:bg-zinc-900/10 flex flex-col gap-6">
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 pl-2 flex items-center gap-2">
                                <Info className="h-3 w-3" /> Note to Applicant
                            </label>
                            <textarea
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                                placeholder="Explain your decision or welcome the applicant..."
                                className="w-full min-h-[220px] text-sm font-bold bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 rounded-[2rem] px-6 py-5 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 placeholder:text-zinc-300 dark:placeholder:text-zinc-700 transition-all resize-none shadow-inner"
                            />
                        </div>

                        {confirmState === "IDLE" ? (
                            <div className="grid grid-cols-2 gap-4">
                                <ClickSpark className="flex-1">
                                    <button
                                        disabled={isPending}
                                        onClick={() => setConfirmState("APPROVING")}
                                        className="w-full flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white p-5 rounded-[1.75rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        <CheckCircle2 className="h-5 w-5" /> Approve
                                    </button>
                                </ClickSpark>
                                <button
                                    disabled={isPending}
                                    onClick={() => setConfirmState("REJECTING")}
                                    className="flex items-center justify-center gap-3 bg-white dark:bg-zinc-950 border-2 border-red-500/50 text-red-500 p-5 rounded-[1.75rem] font-black text-xs uppercase tracking-widest transition-all hover:bg-red-50 dark:hover:bg-red-500/10 active:scale-95 disabled:opacity-50"
                                >
                                    <XCircle className="h-5 w-5" /> Reject
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 p-2 animate-in slide-in-from-right-4 duration-300">
                                <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest ${
                                    confirmState === 'APPROVING' ? 'text-emerald-600 bg-emerald-50/50 border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/20' : 'text-red-600 bg-red-50/50 border-red-100 dark:bg-red-500/5 dark:border-red-500/20'
                                }`}>
                                    <AlertCircle className="h-4 w-4" />
                                    Confirm Promotion?
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <ClickSpark className="flex-1">
                                        <button
                                            onClick={confirmState === "APPROVING" ? handleApprove : handleReject}
                                            disabled={isPending}
                                            className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest text-white shadow-xl transition-all active:scale-95 disabled:opacity-50 ${
                                                confirmState === "APPROVING" ? "bg-emerald-600 shadow-emerald-600/20" : "bg-red-600 shadow-red-600/20"
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
            <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
        </div>
    );
}
