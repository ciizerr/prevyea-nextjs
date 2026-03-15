"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Search, FileText, BookOpen, LayoutDashboard,
    Settings, Terminal, Sparkles, Command
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const COMMANDS = [
    { id: "archive", name: "Browse Archive", icon: FileText, shortcut: "A", href: "/vault" },
    { id: "syllabus", name: "Official Syllabus", icon: BookOpen, shortcut: "S", href: "/syllabus" },
    { id: "notice", name: "Internal Notices", icon: Sparkles, shortcut: "N", href: "/notice" },
    { id: "dashboard", name: "User Dashboard", icon: LayoutDashboard, shortcut: "D", href: "/dashboard" },
    { id: "settings", name: "Preference Settings", icon: Settings, shortcut: ",", href: "/settings" },
];

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const router = useRouter();

    const toggle = useCallback(() => setIsOpen(prev => !prev), []);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                toggle();
            }
            if (e.key === "Escape") setIsOpen(false);
        };

        window.addEventListener("keydown", down);
        return () => window.removeEventListener("keydown", down);
    }, [toggle]);

    const handleAction = (href: string) => {
        router.push(href);
        setIsOpen(false);
    };

    const filteredCommands = COMMANDS.filter(cmd =>
        cmd.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-md z-[100]"
                    />

                    {/* Palette */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] z-[101] overflow-hidden"
                    >
                        <div className="p-4 border-b border-zinc-100 dark:border-zinc-900 flex items-center gap-4">
                            <Search className="h-6 w-6 text-zinc-400" />
                            <input
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search for anything..."
                                className="flex-1 bg-transparent border-none outline-none text-xl font-bold text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 py-2"
                            />
                            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest leading-none">ESC</span>
                            </div>
                        </div>

                        <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] px-4 py-2">Quick Navigation</p>
                                {filteredCommands.map((cmd) => (
                                    <button
                                        key={cmd.id}
                                        onClick={() => handleAction(cmd.href)}
                                        className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                                <cmd.icon className="h-5 w-5" />
                                            </div>
                                            <span className="font-bold text-zinc-900 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-50">{cmd.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest px-2 py-1 bg-zinc-50 dark:bg-zinc-950 rounded-lg group-hover:bg-indigo-500/10 group-hover:text-indigo-500 transition-all">GO</span>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {query.length > 0 && filteredCommands.length === 0 && (
                                <div className="p-12 text-center text-zinc-500">
                                    <Terminal className="h-10 w-10 mx-auto mb-4 opacity-20" />
                                    <p className="font-bold">No results found for &quot;{query}&quot;</p>
                                    <p className="text-xs uppercase tracking-widest mt-2">Try checking for typos or different keywords</p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-zinc-50 dark:bg-[#0a0a0a] border-t border-zinc-100 dark:border-zinc-900 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 opacity-40">
                                    <Command className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">+ K</span>
                                </div>
                                <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800" />
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Digital Archive v1.1.3</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-emerald-500" />
                                <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Enhanced Search</span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
