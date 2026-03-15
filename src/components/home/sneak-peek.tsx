"use client";

import { useState } from "react";
import { Lock, FileText, ChevronDown, ChevronUp, ZoomIn, Download, Share2, Sparkles } from "lucide-react";
import ClickSpark from "@/components/reactbits/ClickSpark";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SneakPeek() {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <section className="w-full py-24 md:py-40 px-4 relative bg-zinc-50 dark:bg-[#080808] overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16 md:mb-24 space-y-4 relative z-10">
                    <div className="inline-flex px-4 py-1.5 bg-amber-50 dark:bg-amber-500/10 rounded-full border border-amber-100 dark:border-amber-500/20 text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-4">
                        Quality Assurance
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
                        High Fidelity Resources.
                    </h2>
                    <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium">
                        Digitally enhanced scans, OCR-enabled text, and verified answer keys. No more blurry photos.
                    </p>
                </div>

                {/* Mock PDF Viewer Container */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative w-full max-w-5xl mx-auto bg-white dark:bg-zinc-950 rounded-[3rem] border border-zinc-200 dark:border-zinc-800/80 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.1)] dark:shadow-none overflow-hidden flex flex-col"
                    style={{ height: "650px" }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    {/* PDF Viewer Toolbar */}
                    <div className="h-16 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between px-8 shrink-0 z-20">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-rose-500" />
                            </div>
                            <div className="min-w-0">
                                <span className="font-black text-xs text-zinc-900 dark:text-zinc-100 block truncate">
                                    2024_OOP_C++_OFFICIAL_PYQ.pdf
                                </span>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Digital Edition</span>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-6">
                            <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-xl text-zinc-500 border border-zinc-200/50 dark:border-zinc-700/50">
                                <ChevronDown className="h-4 w-4 cursor-not-allowed opacity-30" />
                                <span className="text-[10px] font-black font-mono">1 / 14</span>
                                <ChevronUp className="h-4 w-4 cursor-not-allowed opacity-30" />
                            </div>
                            <div className="flex items-center gap-4 text-zinc-400">
                                <ZoomIn className="h-4 w-4 opacity-50" />
                                <Download className="h-4 w-4 opacity-50" />
                                <Share2 className="h-4 w-4 opacity-50" />
                            </div>
                        </div>
                    </div>

                    {/* PDF Content Area */}
                    <div className="flex-1 overflow-hidden relative bg-zinc-100/50 dark:bg-[#0a0a0a] flex flex-col items-center pt-10 px-6">

                        {/* Page 1 (Clear) */}
                        <div className="w-full max-w-3xl bg-white shadow-2xl rounded-xl aspect-[1/1.414] p-12 md:p-16 relative z-10 mx-auto shrink-0 transition-transform duration-1000 ease-out border border-zinc-100">

                            {/* Mock Document Content */}
                            <div className="w-full h-full flex flex-col opacity-90 selection:bg-indigo-100">
                                <div className="text-center border-b-[3px] border-zinc-900 pb-8 mb-10">
                                    <h1 className="text-2xl md:text-3xl font-black text-black tracking-[0.2em] uppercase leading-none mb-4">Patna University</h1>
                                    <h2 className="text-lg font-bold text-zinc-800">Vocational Degree Examination, 2024</h2>
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mt-3">Final Professional Edition</p>
                                </div>
                                <div className="flex justify-between items-end text-xs font-black text-zinc-900 mb-12 uppercase tracking-widest">
                                    <div className="space-y-1">
                                        <p className="text-zinc-400">Time Limit</p>
                                        <p>180 Minutes</p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-zinc-400">Maximum Marks</p>
                                        <p>100 Points</p>
                                    </div>
                                </div>
                                <div className="space-y-8 text-zinc-900 font-serif leading-relaxed">
                                    <p className="font-bold italic text-zinc-600 border-l-4 border-indigo-500 pl-4 py-2 bg-indigo-50/50 rounded-r-lg">Note: Answer any FIVE questions from the following selection.</p>

                                    <div className="flex gap-6 group">
                                        <span className="font-black text-indigo-600">01.</span>
                                        <div className="space-y-3">
                                            <p className="font-bold">(a) Contrast the core architectural paradigms of Procedural vs. Object Oriented Systems.</p>
                                            <p className="font-medium text-zinc-700">(b) Define polymorphism and encapsulate its significance in scalable software design.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-6">
                                        <span className="font-black text-indigo-600">02.</span>
                                        <div className="space-y-3">
                                            <p className="font-bold text-zinc-400">What is function overloading? Implement a strategy in C++...</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Page 2 (Blurred overlay) */}
                        <div className="w-full max-w-3xl bg-white shadow-xl rounded-xl aspect-[1/1.414] p-12 mt-10 relative z-0 mx-auto shrink-0 blur-xl opacity-30 border border-zinc-100">
                            <div className="w-full h-6 bg-zinc-200 rounded-full mb-6"></div>
                            <div className="w-5/6 h-6 bg-zinc-200 rounded-full mb-6"></div>
                            <div className="w-full h-80 bg-zinc-100 rounded-[2rem] mb-6"></div>
                        </div>

                        {/* Overlay Glass Panel (The Hook) */}
                        <div className={`absolute inset-0 z-30 flex flex-col items-center justify-center p-6 transition-all duration-700 ${isHovering ? 'backdrop-blur-[12px] bg-white/10 dark:bg-black/40' : 'backdrop-blur-[6px] bg-transparent'}`}>
                            <motion.div 
                                animate={{ scale: isHovering ? 1.05 : 1, y: isHovering ? -10 : 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="bg-white dark:bg-zinc-900 p-10 md:p-14 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] dark:shadow-none max-w-md w-full text-center border border-zinc-200 dark:border-zinc-800 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500" />
                                
                                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-indigo-600 dark:text-indigo-400 shadow-inner">
                                    <Lock className="h-10 w-10" />
                                </div>
                                <h3 className="text-3xl font-black text-zinc-900 dark:text-white mb-4 tracking-tight">
                                    Restricted Content
                                </h3>
                                <p className="text-zinc-500 dark:text-zinc-400 mb-10 font-medium leading-relaxed">
                                    Join the PU Digital Library to unlock the full 14-page document, high-res downloads, and official answer keys.
                                </p>
                                <ClickSpark className="w-full">
                                    <Link href="/login" className="w-full block bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl shadow-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3">
                                        Sign In to Access
                                        <Sparkles className="h-4 w-4" />
                                    </Link>
                                </ClickSpark>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-6">Instant Verification • 100% Secure</p>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
