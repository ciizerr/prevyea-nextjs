"use client";

import Link from "next/link";
import { MoveLeft, Ghost, Search, FileX, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import ClickSpark from "@/components/reactbits/ClickSpark";

export default function NotFound() {
    return (
        <div className="min-h-[100dvh] bg-white dark:bg-[#050505] flex flex-col items-center justify-center p-6 text-center overflow-hidden relative selection:bg-indigo-500/30">
            
            {/* Ambient Background Blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[500px] bg-indigo-500/5 dark:bg-indigo-600/10 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[100px] rounded-full -z-10" />

            {/* Background Big 404 - More Dramatic */}
            <h1 className="text-[25vw] sm:text-[20rem] font-black text-zinc-900/[0.03] dark:text-white/[0.02] leading-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none tracking-tighter uppercase whitespace-nowrap">
                Lost Archive
            </h1>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-2xl w-full space-y-12 relative z-10"
            >
                {/* Funny Visual Element */}
                <div className="relative inline-block">
                    <motion.div
                        animate={{ 
                            y: [0, -20, 0],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="relative z-20"
                    >
                        <div className="bg-zinc-950 dark:bg-zinc-100 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                            <motion.div
                                animate={{ opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent pointer-events-none"
                            />
                            <Ghost className="h-24 w-24 text-zinc-100 dark:text-zinc-900" />
                        </div>
                    </motion.div>
                    
                    {/* Shadow underneath */}
                    <div className="w-24 h-4 bg-zinc-900/10 dark:bg-black/40 blur-md rounded-full mx-auto mt-8 animate-pulse" />
                </div>

                {/* Error Text */}
                <div className="space-y-4">
                    <h2 className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter leading-none">
                        This Page <br className="sm:hidden" />
                        <span className="text-zinc-400">Dropped Out.</span>
                    </h2>
                    <div className="inline-flex px-3 py-1 bg-rose-50 dark:bg-rose-500/10 rounded-full border border-rose-100 dark:border-rose-500/20 text-[9px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">
                        Status: Semester Backlog 404
                    </div>
                </div>

                <div className="space-y-6 max-w-md mx-auto">
                    <p className="text-zinc-500 dark:text-zinc-400 font-bold text-sm leading-relaxed">
                        It couldn&apos;t handle the pressure of the 6th semester and decided to ghost us. Or maybe you typed something that doesn&apos;t exist—like an easy Internal exam.
                    </p>

                    <div className="flex flex-col gap-3 pt-6">
                        <ClickSpark className="w-full">
                            <Link 
                                href="/" 
                                className="group w-full flex justify-center items-center py-5 px-8 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-2xl shadow-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 gap-3"
                            >
                                <MoveLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                Teleport to Safety
                            </Link>
                        </ClickSpark>
                        
                        <div className="flex items-center gap-4 py-4">
                            <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-900" />
                            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">Try Searching Instead</span>
                            <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-900" />
                        </div>

                        <Link 
                            href="/vault" 
                            className="w-full flex justify-center items-center py-5 px-8 bg-white dark:bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all gap-3"
                        >
                            <Search className="h-4 w-4" />
                            Browse The Vault
                        </Link>
                    </div>
                </div>

                {/* Funny Footer Logs */}
                <div className="pt-12 flex flex-col items-center gap-2 opacity-30 select-none">
                    <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-500">
                        <Terminal className="h-3 w-3" />
                        <span>librarian@pudl:~$ locate_lost_students --force</span>
                    </div>
                    <div className="text-[9px] font-mono text-emerald-500">
                        [SUCCESS] Found 0 results. They are probably at the cafeteria.
                    </div>
                </div>
            </motion.div>

            {/* Random Floating Icons for "Debris" Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-10 blur-sm overflow-hidden">
                <motion.div animate={{ y: [0, -100], x: [0, 50], rotate: 360 }} transition={{ duration: 15, repeat: Infinity }} className="absolute top-[20%] left-[10%]"><FileX className="h-12 w-12" /></motion.div>
                <motion.div animate={{ y: [0, 100], x: [0, -30], rotate: -360 }} transition={{ duration: 20, repeat: Infinity }} className="absolute bottom-[20%] right-[15%]"><Search className="h-16 w-16" /></motion.div>
                <div className="absolute top-[40%] right-[10%] border border-zinc-500/20 w-32 h-32 rounded-full" />
            </div>

        </div>
    );
}
