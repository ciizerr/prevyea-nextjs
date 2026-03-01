"use client";

import { useState } from "react";
import { Lock, FileText, ChevronDown, ChevronUp, ZoomIn, Download, Share2 } from "lucide-react";
import ClickSpark from "@/components/reactbits/ClickSpark";

export default function SneakPeek() {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <section className="w-full py-24 md:py-32 px-4 relative bg-zinc-100 dark:bg-zinc-900/50 border-y border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12 md:mb-16 space-y-4 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Try before you commit.
                    </h2>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                        High-quality, scanned, and digitally enhanced PYQs. See for yourself.
                    </p>
                </div>

                {/* Mock PDF Viewer Container */}
                <div
                    className="relative w-full max-w-4xl mx-auto bg-zinc-200/50 dark:bg-zinc-950 rounded-2xl md:rounded-3xl border border-zinc-300/50 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col"
                    style={{ height: "600px" }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    {/* PDF Viewer Toolbar */}
                    <div className="h-14 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-300 dark:border-zinc-800 flex items-center justify-between px-4 shrink-0 z-20">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                            <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate max-w-[150px] sm:max-w-xs">
                                2024_OOP_C++_PYQ_Final.pdf
                            </span>
                        </div>
                        <div className="hidden sm:flex items-center gap-4 text-zinc-500">
                            <div className="flex items-center gap-2 border-r border-zinc-300 dark:border-zinc-700 pr-4">
                                <ChevronDown className="h-4 w-4 cursor-not-allowed opacity-50" />
                                <span className="text-xs font-mono">1 / 14</span>
                                <ChevronUp className="h-4 w-4 cursor-not-allowed opacity-50" />
                            </div>
                            <ZoomIn className="h-4 w-4 cursor-not-allowed opacity-50" />
                            <Download className="h-4 w-4 cursor-not-allowed opacity-50" />
                            <Share2 className="h-4 w-4 cursor-not-allowed opacity-50" />
                        </div>
                    </div>

                    {/* PDF Content Area */}
                    <div className="flex-1 overflow-hidden relative bg-zinc-300/30 dark:bg-zinc-950/50 flex flex-col items-center pt-8 px-4">

                        {/* Page 1 (Clear) */}
                        <div className="w-full max-w-2xl bg-white dark:bg-zinc-100 shadow-xl rounded-sm aspect-[1/1.4] p-8 md:p-12 relative z-10 mx-auto shrink-0 transition-transform duration-700 ease-out group">

                            {/* Mock Document Content */}
                            <div className="w-full h-full flex flex-col opacity-90">
                                <div className="text-center border-b-2 border-zinc-800 pb-4 mb-6">
                                    <h1 className="text-xl md:text-2xl font-black text-black tracking-widest uppercase">Patna University</h1>
                                    <h2 className="text-lg font-bold text-black mt-2">B.C.A. (Part-III) Examination, 2024</h2>
                                    <h3 className="font-semibold text-black mt-1">Paper - VII : Object Oriented Programming in C++</h3>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-black mb-8">
                                    <span>Time : 3 Hours</span>
                                    <span>Full Marks : 100</span>
                                </div>
                                <div className="space-y-6 text-black font-serif">
                                    <p className="font-semibold italic">Answer any FIVE questions. All questions carry equal marks.</p>

                                    <div className="flex gap-4">
                                        <span className="font-bold">1.</span>
                                        <div className="space-y-2">
                                            <p>(a) What are the basic concepts of Object Oriented Programming? Explain with suitable examples.</p>
                                            <p>(b) Differentiate between structured programming and object-oriented programming.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <span className="font-bold">2.</span>
                                        <div className="space-y-2">
                                            <p>What is function overloading? Write a C++ program to overload a function &apos;area&apos; that calculates the area of a circle, a rectangle, and a triangle.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <span className="font-bold">3.</span>
                                        <div className="space-y-2">
                                            <p>Explain the concept of constructors and destructors. Can we overload constructors? Justify your answer with an example.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 opacity-50">
                                        <span className="font-bold">4.</span>
                                        <div className="space-y-2">
                                            <p>What is Inheritance? Explain the different types of inheritance supported by C++...</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Page 2 (Blurred overlay starts here) */}
                        <div className="w-full max-w-2xl bg-white dark:bg-zinc-100 shadow-xl rounded-sm aspect-[1/1.4] p-8 mt-8 relative z-0 mx-auto shrink-0 blur-md opacity-50">
                            {/* Fake lines to look like text */}
                            <div className="w-full h-4 bg-zinc-300 rounded mb-4"></div>
                            <div className="w-5/6 h-4 bg-zinc-300 rounded mb-4"></div>
                            <div className="w-full h-4 bg-zinc-300 rounded mb-4"></div>
                            <div className="w-3/4 h-4 bg-zinc-300 rounded mb-8"></div>
                            <div className="w-full h-40 bg-zinc-200 rounded mb-4"></div>
                        </div>

                        {/* Overlay Glass Panel (The Hook) */}
                        <div className={`absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-zinc-900/10 dark:bg-black/40 backdrop-blur-[8px] transition-all duration-500 ${isHovering ? 'bg-zinc-900/40 dark:bg-black/60 backdrop-blur-[12px]' : ''}`}>
                            <div className={`bg-white dark:bg-zinc-900 p-8 md:p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border border-zinc-200 dark:border-zinc-800 transition-transform duration-500 ${isHovering ? 'scale-105' : 'scale-100'}`}>
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 dark:text-blue-400">
                                    <Lock className="h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                                    Unlock the full document
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400 mb-8">
                                    Join the library to view all 14 pages, access the answer key, and download the PDF.
                                </p>
                                <ClickSpark className="w-full">
                                    <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer">
                                        Sign Up Free
                                    </button>
                                </ClickSpark>
                                <p className="text-xs text-zinc-500 mt-4">Takes less than 30 seconds.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
