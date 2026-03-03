"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

// ─── Constants ─────────────────────────────────────────────────────

const THEME_OPTIONS = [
    {
        key: "light",
        label: "Light",
        icon: Sun,
        preview: (
            <div className="w-full h-24 bg-white rounded border border-zinc-200 shadow-sm flex flex-col p-2 space-y-2 mb-3">
                <div className="h-4 w-1/3 bg-zinc-200 rounded"></div>
                <div className="h-full w-full bg-zinc-100 rounded"></div>
            </div>
        ),
        cardBg: "bg-zinc-50",
        labelColor: "text-zinc-900",
    },
    {
        key: "dark",
        label: "Dark",
        icon: Moon,
        preview: (
            <div className="w-full h-24 bg-zinc-900 rounded border border-zinc-800 shadow-sm flex flex-col p-2 space-y-2 mb-3">
                <div className="h-4 w-1/3 bg-zinc-800 rounded"></div>
                <div className="h-full w-full bg-zinc-950 rounded border border-zinc-800/50"></div>
            </div>
        ),
        cardBg: "bg-zinc-950",
        labelColor: "text-zinc-100",
    },
    {
        key: "system",
        label: "System Sync",
        icon: Monitor,
        preview: (
            <div className="w-full h-24 rounded border border-zinc-200 dark:border-zinc-800 shadow-sm flex overflow-hidden mb-3">
                <div className="w-1/2 h-full bg-white p-2">
                    <div className="h-4 w-2/3 bg-zinc-200 rounded mb-2"></div>
                </div>
                <div className="w-1/2 h-full bg-zinc-950 p-2 border-l border-zinc-800">
                    <div className="h-4 w-2/3 bg-zinc-800 rounded mb-2"></div>
                </div>
            </div>
        ),
        cardBg: "bg-zinc-50 dark:bg-zinc-900",
        labelColor: "text-zinc-900 dark:text-zinc-100",
    },
];

// ─── Main Component ────────────────────────────────────────────────

export default function AppearanceTab() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
                <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">Appearance</h1>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium">Customize how the PU library looks on your device.</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-4">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Theme Preference</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
                        {THEME_OPTIONS.map((opt) => {
                            const isActive = theme === opt.key;
                            const Icon = opt.icon;
                            return (
                                <button
                                    key={opt.key}
                                    onClick={() => setTheme(opt.key)}
                                    className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-200 text-left ${opt.cardBg} ${isActive
                                            ? "border-indigo-500 shadow-sm shadow-indigo-500/10"
                                            : "border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50"
                                        }`}
                                >
                                    {opt.preview}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Icon className={`h-4 w-4 ${isActive ? "text-indigo-500" : "text-zinc-400"}`} />
                                            <span className={`text-sm font-bold ${opt.labelColor}`}>{opt.label}</span>
                                        </div>
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${isActive
                                                ? "bg-indigo-500"
                                                : "border border-zinc-300 dark:border-zinc-600"
                                            }`}>
                                            {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    <p className="text-xs text-zinc-500 font-medium mt-2">Theme changes are applied instantly and saved to your browser.</p>
                </div>
            </div>
        </div>
    );
}
