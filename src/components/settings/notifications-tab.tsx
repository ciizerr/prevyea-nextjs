"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { updateNotificationPrefsAction } from "@/actions/user";

// ─── Constants ─────────────────────────────────────────────────────

const NOTIFICATION_OPTIONS = [
    { key: "pyq_uploads", label: "New Document Uploads", description: "Get notified when someone uploads a new past paper or notes for your selected course.", defaultOn: true },
    { key: "announcements", label: "Community Announcements", description: "Receive updates about exams, events, and library maintenance.", defaultOn: true },
];

// ─── Main Component ────────────────────────────────────────────────

export default function NotificationsTab({ initialPyqs, initialNotices }: { initialPyqs: boolean, initialNotices: boolean }) {
    const [prefs, setPrefs] = useState<Record<string, boolean>>({
        pyq_uploads: initialPyqs,
        announcements: initialNotices
    });

    const [isPending, startTransition] = useTransition();

    const toggle = (key: string) => {
        setPrefs((prev) => {
            const next = { ...prev, [key]: !prev[key] };
            startTransition(async () => {
                await updateNotificationPrefsAction(next.pyq_uploads, next.announcements);
            });
            return next;
        });
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">Notifications</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium">Choose what you want to be notified about.</p>
                </div>
                {isPending && <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />}
            </div>

            <div className="space-y-4 max-w-2xl">
                {NOTIFICATION_OPTIONS.map((opt) => {
                    const isOn = prefs[opt.key] ?? opt.defaultOn;
                    return (
                        <button
                            key={opt.key}
                            onClick={() => toggle(opt.key)}
                            className="w-full flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-left transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
                        >
                            <div>
                                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-1">{opt.label}</h4>
                                <p className="text-xs text-zinc-500">{opt.description}</p>
                            </div>
                            <div className={`w-11 h-6 rounded-full relative shrink-0 ml-4 transition-colors duration-200 ${isOn ? "bg-indigo-500" : "bg-zinc-300 dark:bg-zinc-700"}`}>
                                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-200 flex items-center justify-center ${isOn ? "right-0.5 text-indigo-500" : "left-0.5 text-transparent"
                                    }`}>
                                    {isOn && <CheckCircle2 className="h-3 w-3" />}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
            <p className="text-xs text-zinc-500 font-medium">Notification preferences are instantly saved to your profile and span across all your devices.</p>
        </div>
    );
}
