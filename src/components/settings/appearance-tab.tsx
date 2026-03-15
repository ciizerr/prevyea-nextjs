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
        label: "Device Preference",
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
                <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">Look & Feel</h1>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium">Customize how the PU Digital Library looks on your device.</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-6">
                    <label className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">Theme Preference</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
                        {THEME_OPTIONS.map((opt) => {
                            const isActive = theme === opt.key;
                            const Icon = opt.icon;
                            return (
                                <button
                                    key={opt.key}
                                    onClick={() => setTheme(opt.key)}
                                    className={`group border rounded-[2rem] p-6 cursor-pointer transition-all duration-300 text-left ${opt.cardBg} ${isActive
                                        ? "border-indigo-500 shadow-xl shadow-indigo-500/10 ring-4 ring-indigo-500/5"
                                        : "border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/30 hover:bg-white dark:hover:bg-zinc-900 shadow-sm"
                                        }`}
                                >
                                    <div className="scale-x-105 origin-center">{opt.preview}</div>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-3">
                                            <Icon className={`h-5 w-5 transition-colors ${isActive ? "text-indigo-500" : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"}`} />
                                            <span className={`text-base font-black tracking-tight transition-colors ${opt.labelColor} ${!isActive && "opacity-60 group-hover:opacity-100"}`}>{opt.label}</span>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                                            ? "bg-indigo-500 scale-110"
                                            : "border-2 border-zinc-200 dark:border-zinc-800 group-hover:border-indigo-500/50"
                                            }`}>
                                            {isActive && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider mt-4">System preference follows your device settings automatically.</p>
                </div>
            </div>
        </div>
    );
}
