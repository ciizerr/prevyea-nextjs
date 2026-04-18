"use client";

import { MessageCircle, FolderOpen, ChevronRight, Check, X } from "lucide-react";
import ClickSpark from "@/components/reactbits/ClickSpark";
import Link from "next/link";

export default function StruggleVsSolution() {
    return (
        <section className="w-full py-16 md:py-24 lg:py-40 px-4 relative overflow-hidden bg-zinc-50 dark:bg-[#050505]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 md:mb-32 space-y-3 md:space-y-4">
                    <div className="inline-flex px-3 md:px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-full border border-indigo-100 dark:border-indigo-500/20 text-[9px] md:text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2 md:mb-4">
                        The Student Experience
                    </div>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
                        Engineered for PU Students.
                    </h2>
                    <p className="text-base md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium">
                        We replaced chaotic social threads and expiring links with a high-fidelity digital infrastructure.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-16 items-stretch max-w-6xl mx-auto relative">

                    {/* Left Side: The Legacy Experience */}
                    <div 
                        className="relative w-full min-h-[380px] md:min-h-[550px] h-auto rounded-2xl md:rounded-[3rem] bg-zinc-200/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/60 overflow-hidden flex flex-col p-5 md:p-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-700 animate-in fade-in slide-in-from-left-4 duration-700"
                    >
                        <div className="flex items-center justify-between mb-5 md:mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-9 md:w-10 h-9 md:h-10 rounded-xl md:rounded-2xl bg-zinc-300 dark:bg-zinc-800 flex items-center justify-center">
                                    <MessageCircle className="h-4 w-4 md:h-5 md:w-5 text-zinc-500" />
                                </div>
                                <div>
                                    <h3 className="font-black text-zinc-900 dark:text-zinc-200 text-xs md:text-sm">Community Group Chat</h3>
                                    <p className="text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Unorganized Threads</p>
                                </div>
                            </div>
                            <X className="h-4 w-4 md:h-5 md:w-5 text-rose-500/50" />
                        </div>

                        {/* Fake Chat bubbles */}
                        <div className="space-y-3 md:space-y-4">
                            {[
                                { user: "A", msg: "Does anyone have the 2022 OOPs paper?", color: "bg-blue-500" },
                                { user: "S", msg: "Check the pinned message link.", color: "bg-emerald-500", self: true },
                                { user: "C", msg: "That link expired 3 months ago...", color: "bg-amber-500" },
                                { user: "D", msg: "Can someone re-upload it please?", color: "bg-purple-500" },
                            ].map((c, i) => (
                                <div key={i} className={`flex gap-2 md:gap-3 ${c.self ? "flex-row-reverse" : ""}`}>
                                    <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full ${c.color} opacity-20 shrink-0`} />
                                    <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl text-[11px] md:text-xs font-bold leading-relaxed ${c.self ? "bg-zinc-300 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-tr-none" : "bg-white dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 rounded-tl-none border border-zinc-100 dark:border-zinc-800"}`}>
                                        {c.msg}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto pt-6 md:pt-8 flex items-center justify-center opacity-30">
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-zinc-400">The Legacy Experience</span>
                        </div>
                    </div>

                    {/* Right Side: The PU Digital Library */}
                    <div 
                        className="relative w-full min-h-[380px] md:min-h-[550px] h-auto rounded-2xl md:rounded-[3rem] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] md:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] dark:shadow-none overflow-hidden flex flex-col p-5 md:p-8 lg:p-12 hover:border-indigo-500/30 transition-colors duration-500 animate-in fade-in slide-in-from-right-4 duration-700"
                    >
                        {/* Ambient Light — hidden on mobile for perf */}
                        <div className="hidden md:block absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 blur-[100px] -mr-20 -mt-20 pointer-events-none" />

                        <div className="flex items-center justify-between mb-6 md:mb-10">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="w-10 md:w-12 h-10 md:h-12 rounded-xl md:rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center">
                                    <FolderOpen className="h-5 w-5 md:h-6 md:w-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="font-black text-zinc-900 dark:text-white text-base md:text-lg">Resource Manager</h3>
                                    <p className="text-[9px] md:text-[10px] font-black text-emerald-500 uppercase tracking-widest">Instant Access</p>
                                </div>
                            </div>
                            <Check className="h-5 w-5 md:h-6 md:w-6 text-emerald-500" />
                        </div>

                        {/* High Fidelity List */}
                        <div className="space-y-3 md:space-y-4 flex-1">
                            {[
                                { title: "C++ Programming", tag: "2024 PYQ", status: "Verified" },
                                { title: "Software Engineering", tag: "Study Notes", status: "New" },
                                { title: "Computer Networks", tag: "Handwritten", status: "HD Scan" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3.5 md:p-5 rounded-xl md:rounded-[1.5rem] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80 group">
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                        <div className="min-w-0">
                                            <p className="font-black text-zinc-900 dark:text-zinc-100 text-xs md:text-sm">{item.title}</p>
                                            <p className="text-[8px] md:text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{item.tag}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <span className="text-[8px] md:text-[9px] font-black bg-white dark:bg-zinc-800 px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 shadow-sm border border-zinc-100 dark:border-zinc-700">
                                            {item.status}
                                        </span>
                                        <ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4 text-zinc-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 md:mt-8 pt-4">
                            <ClickSpark className="w-full">
                                <Link href="/vault" className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-black text-[10px] md:text-xs uppercase tracking-wider md:tracking-[0.2em] py-4 md:py-5 rounded-xl md:rounded-[1.5rem] shadow-2xl transition-all flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95">
                                    Enter the Library
                                    <Check className="h-4 w-4" />
                                </Link>
                            </ClickSpark>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
