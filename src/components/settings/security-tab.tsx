"use client";

import { signOut } from "next-auth/react";
import { useTransition, useState } from "react";
import { deleteAccountAction } from "@/actions/user";
import { Loader2, AlertTriangle, X } from "lucide-react";

export default function SecurityTab() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleConfirmDelete = () => {
        setError(null);
        startTransition(async () => {
            const result = await deleteAccountAction();
            if (result.success) {
                // Sign out locally and redirect to home
                await signOut({ callbackUrl: "/" });
            } else {
                setError(result.error || "Failed to delete account.");
                setShowConfirm(false);
            }
        });
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300 relative">

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3 text-red-600 dark:text-red-500">
                                <AlertTriangle className="h-6 w-6" />
                                <h3 className="text-xl font-bold">Delete Account</h3>
                            </div>
                            <button
                                onClick={() => setShowConfirm(false)}
                                disabled={isPending}
                                className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                            Are you absolutely sure you want to delete your account? This action cannot be undone and you will lose access to the platform.
                            <br /><br />
                            Your uploaded documents will remain, but will be shown without your identity.
                        </p>

                        <div className="flex items-center justify-end gap-3 mt-8">
                            <button
                                onClick={() => setShowConfirm(false)}
                                disabled={isPending}
                                className="px-5 py-2.5 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isPending}
                                className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Deleting...</> : "Yes, Delete My Account"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">Account</h1>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium">Manage your account access and data privacy.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200/60 dark:border-zinc-800/60 rounded-[2.5rem] shadow-xl shadow-zinc-200/10 dark:shadow-none transition-all hover:bg-white dark:hover:bg-zinc-900">
                    <h4 className="font-black text-zinc-900 dark:text-zinc-100 text-[10px] mb-3 uppercase tracking-widest">Authentication</h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">You are signed in via <span className="font-bold text-indigo-500">OAuth (Google/GitHub)</span>. Password management is handled by your provider.</p>
                </div>

                <div className="p-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200/60 dark:border-zinc-800/60 rounded-[2.5rem] shadow-xl shadow-zinc-200/10 dark:shadow-none transition-all hover:bg-white dark:hover:bg-zinc-900">
                    <h4 className="font-black text-zinc-900 dark:text-zinc-100 text-[10px] mb-3 uppercase tracking-widest">Active Session</h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">Sign out from your current session on this device.</p>
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all active:scale-95"
                    >
                        Sign Out
                    </button>
                </div>

                <div className="lg:col-span-2 p-8 bg-rose-50/10 dark:bg-rose-950/5 border border-rose-200/30 dark:border-rose-900/20 rounded-[2.5rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-rose-500/10 transition-colors" />
                    <h4 className="font-black text-rose-700 dark:text-rose-400 text-[10px] mb-3 uppercase tracking-widest flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Privacy & Deletion
                    </h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-2xl leading-relaxed font-medium">Permanently delete your account and all associated data. This action cannot be undone and your identity will be removed from all contributions.</p>

                    {error && (
                        <div className="mb-6 p-4 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-rose-200 dark:border-rose-800/50">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={() => setShowConfirm(true)}
                        disabled={isPending}
                        className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white bg-rose-600 hover:bg-rose-700 rounded-2xl shadow-lg shadow-rose-600/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}
