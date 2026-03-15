"use client";

import { useState, useTransition } from "react";
import { Shield, Award, CheckCircle2, XCircle, Loader2, Clock, Send } from "lucide-react";
import ClickSpark from "@/components/reactbits/ClickSpark";
import { getMyApplicationsAction, applyForRoleAction } from "@/actions/roles";

// ─── Types ─────────────────────────────────────────────────────────

export interface RoleApp {
    id: string;
    role: string;
    status: string | null;
    reason: string;
    adminNote: string | null;
    createdAt: Date | null;
}

interface UserProfile {
    id: string;
    name: string;
    username: string;
    email: string;
    image: string;
    role: string;
    course: string;
    session: string;
}

interface RolesTabProps {
    profile: UserProfile | null;
    roleApps: RoleApp[];
    setRoleApps: (v: RoleApp[]) => void;
}

// ─── Constants ─────────────────────────────────────────────────────

const ROLE_DEFINITIONS = [
    {
        roleKey: "REVIEWER",
        title: "Content Reviewer",
        description: "Reviewers are responsible for verifying newly uploaded PYQs for accuracy, readability, and correct categorization before they go public.",
        icon: Award,
        color: "indigo",
    },
    {
        roleKey: "MODERATOR",
        title: "Community Moderator",
        description: "Moderators help manage community discussions, resolve disputes, and ensure the Notice Board and comments follow university guidelines.",
        icon: Shield,
        color: "emerald",
    },
];

// ─── Sub-components ────────────────────────────────────────────────

function StatusBadge({ status }: { status: string | null | undefined }) {
    if (!status || status === undefined) {
        return <span className="px-2.5 py-1 text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg">Not Applied</span>;
    }
    if (status === "PENDING") {
        return <span className="px-2.5 py-1 text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg border border-amber-200 dark:border-amber-900/50 flex items-center gap-1"><Clock className="h-3 w-3" /> Processing</span>;
    }
    if (status === "APPROVED") {
        return <span className="px-2.5 py-1 text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Approved</span>;
    }
    if (status === "REJECTED") {
        return <span className="px-2.5 py-1 text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg flex items-center gap-1"><XCircle className="h-3 w-3" /> Rejected</span>;
    }
    return null;
}

// ─── Main Component ────────────────────────────────────────────────

export default function RolesTab({ profile, roleApps, setRoleApps }: RolesTabProps) {
    const [applyingFor, setApplyingFor] = useState<string | null>(null);
    const [applyReason, setApplyReason] = useState("");
    const [roleStatus, setRoleStatus] = useState<{ success: boolean; message: string } | null>(null);
    const [isApplying, startApplyTransition] = useTransition();

    const handleApply = (roleKey: string) => {
        setRoleStatus(null);
        startApplyTransition(async () => {
            const formData = new FormData();
            formData.set("role", roleKey);
            formData.set("reason", applyReason);
            const result = await applyForRoleAction(formData);
            if (result.success) {
                setRoleStatus({ success: true, message: result.message || "Applied!" });
                setApplyingFor(null);
                setApplyReason("");
                const res = await getMyApplicationsAction();
                if (res.success && res.data) setRoleApps(res.data as RoleApp[]);
            } else {
                setRoleStatus({ success: false, message: result.error || "Failed." });
            }
        });
    };

    const userAlreadyHasRole = (roleKey: string) =>
        profile?.role === roleKey || profile?.role === "ADMIN";

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
                <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">Community Roles</h1>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl">Help us moderate, review, and grow the PU Digital Library community by applying for a specialized role.</p>
            </div>

            {roleStatus && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 max-w-3xl ${roleStatus.success ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400" : "bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"}`}>
                    {roleStatus.success ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <XCircle className="h-5 w-5 shrink-0" />}
                    <p className="text-sm font-semibold">{roleStatus.message}</p>
                </div>
            )}

            <div className="space-y-6 max-w-3xl">
                {ROLE_DEFINITIONS.map((roleDef) => {
                    const Icon = roleDef.icon;
                    const app = roleApps.find((a) => a.role === roleDef.roleKey);
                    const appStatus = app?.status;
                    const hasRole = userAlreadyHasRole(roleDef.roleKey);
                    const canApply = !hasRole && (!appStatus || appStatus === "REJECTED");
                    const isFormOpen = applyingFor === roleDef.roleKey;

                    const bgColor = roleDef.color === "indigo"
                        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                        : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400";
                    const hoverBorder = roleDef.color === "indigo"
                        ? "hover:border-indigo-500/30 dark:hover:border-indigo-500/30"
                        : "hover:border-emerald-500/30 dark:hover:border-emerald-500/30";
                    const btnColor = roleDef.color === "indigo"
                        ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20"
                        : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20";

                    return (
                        <div key={roleDef.roleKey} className={`relative group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm ${hoverBorder} transition-all duration-300`}>
                            <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
                                <div className="flex flex-col sm:flex-row items-start gap-6">
                                    <div className={`p-5 rounded-3xl ${bgColor} shrink-0 shadow-inner`}>
                                        <Icon className="h-10 w-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">{roleDef.title}</h3>
                                            {hasRole ? (
                                                <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-lg flex items-center gap-1.5 shadow-sm"><CheckCircle2 className="h-3 w-3" /> Active</span>
                                            ) : (
                                                <StatusBadge status={appStatus} />
                                            )}
                                        </div>
                                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-lg">{roleDef.description}</p>
                                        {app?.adminNote && appStatus === "REJECTED" && (
                                            <div className="p-3 bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/20 rounded-xl">
                                                <p className="text-[11px] text-red-600 dark:text-red-400 font-bold uppercase tracking-wider mb-1">Feedback</p>
                                                <p className="text-sm text-red-500 dark:text-red-400 font-medium italic">&quot;{app.adminNote}&quot;</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="shrink-0 w-full lg:w-auto">
                                    {canApply && !isFormOpen && (
                                        <ClickSpark className="w-full">
                                            <button
                                                onClick={() => { setApplyingFor(roleDef.roleKey); setApplyReason(""); setRoleStatus(null); }}
                                                className={`w-full lg:w-auto px-8 py-4 font-black text-[11px] uppercase tracking-widest ${btnColor} text-white rounded-2xl transition-all shadow-xl active:scale-95`}
                                            >
                                                Apply Now
                                            </button>
                                        </ClickSpark>
                                    )}

                                    {hasRole && (
                                        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-center">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Currently Assigned</span>
                                        </div>
                                    )}

                                    {appStatus === "PENDING" && (
                                        <div className="p-4 bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20 rounded-2xl text-center">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 flex items-center justify-center gap-2">
                                                <Clock className="h-3.5 w-3.5" />
                                                Review In Progress
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Application Form */}
                            {isFormOpen && (
                                <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800/60 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Tell us about yourself and why you want to be a {roleDef.title}:</label>
                                    <textarea
                                        value={applyReason}
                                        onChange={(e) => setApplyReason(e.target.value)}
                                        placeholder="Do you have deep knowledge related to your courses? Do you agree not to review files that are not under your course or your specific knowledge? Please explain."
                                        rows={4}
                                        autoFocus
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all font-medium text-sm resize-none"
                                    />
                                    <p className="text-xs text-zinc-500 mt-1 mb-4">Minimum 20 characters required.</p>
                                    <div className="flex items-center gap-3 justify-end">
                                        <button
                                            onClick={() => { setApplyingFor(null); setApplyReason(""); setRoleStatus(null); }}
                                            className="px-5 py-2.5 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <ClickSpark>
                                            <button
                                                onClick={() => handleApply(roleDef.roleKey)}
                                                disabled={isApplying || applyReason.trim().length < 20}
                                                className={`px-6 py-2.5 text-sm font-bold text-white ${btnColor} rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                                            >
                                                {isApplying ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : <><Send className="h-4 w-4" /> Submit Application</>}
                                            </button>
                                        </ClickSpark>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
