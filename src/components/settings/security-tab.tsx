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
                <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">Security</h1>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium">Manage your account security settings.</p>
            </div>
            <div className="max-w-2xl space-y-6">
                <div className="p-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-2">Authentication Method</h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">You are signed in via <span className="font-bold text-zinc-700 dark:text-zinc-300">OAuth (Google/GitHub)</span>. Password management is not available for OAuth accounts.</p>
                </div>

                <div className="p-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-2">Active Session</h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Sign out from your current session on this device.</p>
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="px-5 py-2.5 text-sm font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>

                <div className="p-6 bg-red-50/50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 rounded-2xl">
                    <h4 className="font-bold text-red-700 dark:text-red-400 text-sm mb-2">Danger Zone</h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm rounded-lg border border-red-200 dark:border-red-800">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={() => setShowConfirm(true)}
                        disabled={isPending}
                        className="px-5 py-2.5 text-sm font-bold text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}
