"use client";

import { Search, Sparkles, Terminal, BookOpen, Layers } from "lucide-react";
import Typewriter from "@/components/reactbits/Typewriter";
import ClickSpark from "@/components/reactbits/ClickSpark";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const sq = query.trim();
        if (sq) {
            if (sq.toLowerCase().includes("syllabus")) {
                router.push(`/syllabus?search=${encodeURIComponent(sq)}`);
            } else {
                router.push(`/vault?search=${encodeURIComponent(sq)}`);
            }
        }
    };

    return (
        <section className="w-full relative overflow-hidden flex flex-col items-center justify-center text-center pt-20 pb-12 md:pt-40 md:pb-32 px-4">
            {/* High-End Ambient Background — reduced blur on mobile */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1400px] overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[400px] md:w-[800px] h-[300px] md:h-[600px] bg-indigo-500/10 dark:bg-indigo-600/10 blur-[80px] md:blur-[180px] rounded-full mix-blend-plus-lighter" />
                <div className="hidden md:block absolute bottom-0 right-[10%] w-[400px] h-[400px] bg-emerald-500/5 dark:bg-emerald-500/5 blur-[120px] rounded-full" />
            </div>

            <div 
                className="max-w-5xl mx-auto space-y-8 md:space-y-12 relative z-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700"
            >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-zinc-500 dark:text-zinc-400 mb-2 md:mb-4">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    The Official PU Digital Resource Hub
                </div>

                {/* Main Header */}
                <div className="space-y-6 max-w-4xl mx-auto flex flex-col justify-center">
                    <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] text-zinc-900 dark:text-zinc-50 min-h-[80px] sm:min-h-[100px] md:min-h-[160px]">
                        <Typewriter
                            phrases={[
                                "Access 2024 PYQ Papers.",
                                "Find Verified Study Notes.",
                                "Browse Official Syllabus.",
                                "Built for PU Vocational Core.",
                                "Your Digital Study Library."
                            ]}
                            typingSpeed={60}
                            deletingSpeed={40}
                            delayBetweenPhrases={3000}
                            cursorClassName="text-indigo-600 dark:text-indigo-400 font-light opacity-50"
                        />
                    </h1>
                </div>

                {/* Re-imagined Spotlight Search */}
                <div className="w-full max-w-3xl mx-auto mt-6 md:mt-12 relative group p-1 md:p-2">
                    <div className="hidden md:block absolute -inset-2 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 dark:from-indigo-600/10 dark:to-emerald-600/10 rounded-[2.5rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition duration-1000" />
                    
                    <form onSubmit={handleSearch} className="relative flex items-center shadow-[0_8px_30px_-10px_rgba(0,0,0,0.1)] md:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-none rounded-2xl md:rounded-[2rem] bg-white/80 dark:bg-zinc-950/80 md:backdrop-blur-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-1.5 md:p-2 transition-all duration-500 group-focus-within:border-zinc-400/50 dark:group-focus-within:border-zinc-700/50 md:group-focus-within:scale-[1.02]">
                        <div className="pl-3 md:pl-6 pr-2 md:pr-3 flex items-center shrink-0">
                            <Search className="h-5 w-5 md:h-6 md:w-6 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="What are you studying today?"
                            className="flex-1 bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-bold text-sm sm:text-lg md:text-xl py-3 sm:py-4 md:py-5 min-w-0"
                            autoComplete="off"
                        />
                        <div className="hidden sm:flex items-center gap-1.5 pr-4 shrink-0">
                            <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                <Terminal className="h-4 w-4 text-zinc-400" />
                            </div>
                        </div>
                        <ClickSpark className="shrink-0">
                            <button type="submit" className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 font-black text-[10px] md:text-xs uppercase tracking-wider md:tracking-[0.2em] px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 rounded-xl md:rounded-[1.5rem] transition-all hover:bg-zinc-800 dark:hover:bg-white active:scale-95 shadow-xl shadow-zinc-900/10">
                                Search
                            </button>
                        </ClickSpark>
                    </form>

                    {/* Quick Tags */}
                    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mt-5 md:mt-8">
                        {['BCA', 'B.Sc IT', 'PYQs 2024', 'OS Notes', 'Semester 4'].map((tag) => (
                            <button 
                                key={tag} 
                                onClick={() => { setQuery(tag); }}
                                className="px-3 md:px-4 py-1.5 md:py-2 bg-zinc-100/50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-800/50 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4 md:gap-6 pt-8 md:pt-12">
                     <p className="text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] md:tracking-[0.4em]">
                        Empowering Vocational Excellence
                    </p>
                    <div className="flex items-center gap-6 md:gap-8 opacity-40">
                        <BookOpen className="h-5 w-5 md:h-6 md:w-6" />
                        <Layers className="h-5 w-5 md:h-6 md:w-6" />
                        <Terminal className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                </div>
            </div>
        </section>
    );
}
