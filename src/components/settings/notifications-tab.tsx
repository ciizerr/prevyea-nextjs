"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

// ─── Constants ─────────────────────────────────────────────────────

const NOTIFICATION_OPTIONS = [
    { key: "pyq_uploads", label: "New PYQ Uploads", description: "Get notified when someone uploads a new past paper for your course.", defaultOn: true },
    { key: "announcements", label: "Community Announcements", description: "Receive updates about exams, events, and library maintenance.", defaultOn: true },
    { key: "marketing", label: "Marketing Emails", description: "Occasional promotional emails and offers.", defaultOn: false },
];

// ─── Main Component ────────────────────────────────────────────────

export default function NotificationsTab() {
    const [prefs, setPrefs] = useState<Record<string, boolean>>(() => {
        if (typeof window === "undefined") return {};
        try {
            const stored = localStorage.getItem("notification_prefs");
            if (stored) return JSON.parse(stored);
        } catch { /* ignore */ }
        const defaults: Record<string, boolean> = {};
        NOTIFICATION_OPTIONS.forEach((o) => { defaults[o.key] = o.defaultOn; });
        return defaults;
    });

    const toggle = (key: string) => {
        setPrefs((prev) => {
            const next = { ...prev, [key]: !prev[key] };
            localStorage.setItem("notification_prefs", JSON.stringify(next));
            return next;
        });
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
                <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">Notifications</h1>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium">Choose what you want to be notified about.</p>
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
            <p className="text-xs text-zinc-500 font-medium">Notification preferences are saved to your browser.</p>
        </div>
    );
}
