"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { User, Briefcase, ImageIcon, Bell, Key } from "lucide-react";

const SETTINGS_TABS = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "roles", label: "Community Roles", icon: Briefcase },
    { id: "appearance", label: "Look & Feel", icon: ImageIcon },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Account", icon: Key },
];

export function SettingsSubNav(props: { isMobile?: boolean }) {
    return (
        <Suspense fallback={null}>
            <SettingsSubNavContent {...props} />
        </Suspense>
    );
}

function SettingsSubNavContent({ isMobile = false }: { isMobile?: boolean }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const activeTab = searchParams.get("tab") || "profile";

    const setTab = (tab: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tab);
        router.push(`${pathname}?${params.toString()}`);
    };

    if (pathname !== "/settings") return null;

    if (isMobile) {
        return (
            <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:hidden">
                <div className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-[2rem] p-2 flex items-center justify-around shadow-2xl">
                    {SETTINGS_TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setTab(tab.id)}
                                className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
                                    isActive 
                                    ? "text-indigo-600 dark:text-indigo-400" 
                                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                                }`}
                            >
                                <Icon className={`h-5 w-5 ${isActive ? "scale-110" : ""}`} />
                                <span className="text-[10px] font-black uppercase tracking-tighter leading-none">{tab.label.split(' ')[0]}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1 bg-zinc-100/50 dark:bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 animate-in fade-in slide-in-from-left-4 duration-500">
            {SETTINGS_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => setTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${
                            isActive
                                ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-white/50 dark:hover:bg-zinc-800/50"
                        }`}
                    >
                        <Icon className="h-3.5 w-3.5" />
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
