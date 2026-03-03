"use client";

import { signOut } from "next-auth/react";

export default function SecurityTab() {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
                    <button className="px-5 py-2.5 text-sm font-bold text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}
