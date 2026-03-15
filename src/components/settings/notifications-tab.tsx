"use client";

import { useState, useTransition } from "react";
import { Loader2, FileUp, Megaphone } from "lucide-react";
import { updateNotificationPrefsAction } from "@/actions/user";

// ─── Constants ─────────────────────────────────────────────────────

const NOTIFICATION_OPTIONS = [
    { key: "pyq_uploads", label: "Learning Resources", description: "Get notified when new past papers or notes are added to your course.", icon: FileUp, onColor: "text-blue-500", onBg: "bg-blue-500/10" },
    { key: "announcements", label: "Updates & Alerts", description: "Stay informed about exams, events, and important platform updates.", icon: Megaphone, onColor: "text-amber-500", onBg: "bg-amber-500/10" },
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {NOTIFICATION_OPTIONS.map((opt) => {
                    const isOn = prefs[opt.key] ?? true;
                    const Icon = opt.icon;
                    return (
                        <button
                            key={opt.key}
                            onClick={() => toggle(opt.key)}
                            className={`group w-full flex flex-col p-6 rounded-[2rem] text-left transition-all duration-300 border ${
                                isOn 
                                ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/20 dark:shadow-none" 
                                : "bg-zinc-50 dark:bg-zinc-950 border-zinc-100 dark:border-zinc-900 opacity-80"
                            }`}
                        >
                            <div className="flex items-center justify-between mb-6 w-full">
                                <div className={`p-4 rounded-2xl transition-all ${isOn ? `${opt.onBg} ${opt.onColor}` : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"}`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <div className={`w-12 h-6 rounded-full relative shrink-0 transition-colors duration-300 ${isOn ? "bg-indigo-500" : "bg-zinc-200 dark:bg-zinc-800"}`}>
                                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all duration-300 flex items-center justify-center ${isOn ? "right-1" : "left-1"}`}>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className={`font-black text-sm mb-1 transition-colors ${isOn ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500"}`}>{opt.label}</h4>
                                <p className="text-xs text-zinc-500 leading-relaxed font-medium">{opt.description}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
            <p className="text-xs text-zinc-500 font-medium">Notification preferences are instantly saved to your profile and span across all your devices.</p>
        </div>
    );
}
