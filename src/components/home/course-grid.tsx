import { BellRing, Star, Rocket, ShieldCheck, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function CourseGrid() {
    return (
        <section className="w-full py-16 md:py-24 lg:py-40 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12 md:mb-32 space-y-3 md:space-y-4">
                    <div className="inline-flex px-3 md:px-4 py-1.5 bg-blue-50 dark:bg-blue-500/10 rounded-full border border-blue-100 dark:border-blue-500/20 text-[9px] md:text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 md:mb-4">
                        Core Ecosystem
                    </div>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
                        Everything you need.<br />
                        <span className="text-zinc-400">Zero Distractions.</span>
                    </h2>
                </div>

                {/* Highly Polished Bento Grid — auto height on mobile, fixed on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto md:auto-rows-[320px]">

                    {/* Feature 1: The Vault (Hero Card) */}
                    <Link href="/vault" className="col-span-1 md:col-span-2 group relative bg-white dark:bg-zinc-900/50 rounded-2xl md:rounded-[3rem] p-6 md:p-10 border border-zinc-200 dark:border-zinc-800/80 hover:border-indigo-500/40 transition-all duration-500 overflow-hidden flex flex-col justify-between shadow-lg md:shadow-xl shadow-zinc-200/20 dark:shadow-none min-h-[240px] md:min-h-0">
                        <div className="hidden md:block absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 blur-[100px] -mr-32 -mt-32 pointer-events-none group-hover:bg-indigo-500/15 transition-colors duration-700" />
                        
                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center p-3 md:p-4 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl md:rounded-2xl mb-5 md:mb-8 border border-indigo-100/50 dark:border-indigo-500/20">
                                <ShieldCheck className="h-6 w-6 md:h-8 md:w-8" />
                            </div>
                            <h3 className="text-2xl md:text-4xl font-black text-zinc-900 dark:text-white mb-2 md:mb-4 tracking-tight">The Digital Library</h3>
                            <p className="text-sm md:text-lg text-zinc-500 dark:text-zinc-400 max-w-md font-medium leading-relaxed">
                                Access a decade of verified past papers and curated study material, organized by semester.
                            </p>
                        </div>

                        <div className="relative z-10 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60 pt-4 md:pt-6 mt-4 md:mt-0">
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-wider md:tracking-[0.2em] text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                                Enter the Library <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </span>
                            <div className="flex -space-x-2">
                                {[1,2,3].map(i => (
                                    <div key={i} className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[9px] md:text-[10px] font-black text-zinc-400 capitalize">
                                        {['B','C','S'][i-1]}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Link>

                    {/* Feature 2: Real-time Streams */}
                    <div className="col-span-1 md:row-span-2 relative bg-zinc-900 dark:bg-zinc-950 rounded-2xl md:rounded-[3rem] p-5 md:p-8 border border-zinc-800 shadow-xl md:shadow-2xl overflow-hidden flex flex-col group min-h-[300px] md:min-h-0">
                        <div className="hidden md:block absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
                        
                        <div className="flex items-center justify-between mb-6 md:mb-10 relative z-10">
                            <div className="p-3 md:p-4 bg-zinc-800/80 rounded-xl md:rounded-2xl text-indigo-400 border border-zinc-700 shadow-xl">
                                <BellRing className="h-5 w-5 md:h-6 md:w-6" />
                            </div>
                            <div className="px-2.5 md:px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-[8px] md:text-[9px] font-black text-indigo-400 uppercase tracking-widest animate-pulse">
                                Live Feed
                            </div>
                        </div>

                        <h3 className="text-xl md:text-2xl font-black text-white mb-2 md:mb-3 relative z-10 tracking-tight">PU Live Updates</h3>
                        <p className="text-xs md:text-sm text-zinc-400 mb-5 md:mb-8 relative z-10 font-medium">Syllabus shifts, exam dates, and official notices as they happen.</p>

                        <div className="space-y-3 md:space-y-4 mt-auto relative z-10">
                            {[
                                { label: "Syllabus", msg: "BCA Sem 4 2024 updated", color: "text-emerald-400", bg: "bg-emerald-400/10" },
                                { label: "Notice", msg: "Mid-sem schedule live", color: "text-indigo-400", bg: "bg-indigo-400/10" },
                                { label: "Resources", msg: "New OS papers added", color: "text-amber-400", bg: "bg-amber-400/10" }
                            ].map((feed, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 p-3.5 md:p-5 rounded-xl md:rounded-3xl hover:bg-white/10 transition-all duration-300">
                                    <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-widest px-2 py-0.5 md:py-1 ${feed.bg} ${feed.color} rounded-md border border-current opacity-70 mb-1.5 md:mb-2 inline-block`}>
                                        {feed.label}
                                    </span>
                                    <p className="text-xs md:text-sm text-zinc-100 font-bold leading-tight">{feed.msg}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Feature 3: Quality First */}
                    <div className="col-span-1 bg-white dark:bg-zinc-900 rounded-2xl md:rounded-[3rem] p-6 md:p-10 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/40 transition-all duration-500 overflow-hidden relative group flex flex-col justify-between shadow-lg md:shadow-xl shadow-zinc-200/10 dark:shadow-none min-h-[220px] md:min-h-0">
                        <div>
                            <div className="flex bg-amber-50 dark:bg-amber-500/10 w-fit p-3 md:p-4 rounded-xl md:rounded-2xl text-amber-500 border border-amber-100 dark:border-amber-500/20 mb-5 md:mb-8">
                                <Star className="h-5 w-5 md:h-6 md:w-6 fill-amber-500" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white mb-2 md:mb-3 tracking-tight">Verified Content</h3>
                            <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                                Crowdsourced from top performers and peer-reviewed for absolute precision.
                            </p>
                        </div>
                    </div>

                    {/* Feature 4: Vocational Focus */}
                    <div className="col-span-1 bg-indigo-600 text-white rounded-2xl md:rounded-[3rem] p-6 md:p-10 overflow-hidden relative group flex flex-col justify-between shadow-xl md:shadow-2xl shadow-indigo-500/30 min-h-[220px] md:min-h-0">
                        <div className="hidden md:block absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[60px] rounded-full pointer-events-none -mr-20 -mt-20" />
                        
                        <div className="relative z-10 flex justify-end">
                            <div className="bg-white/20 p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/20">
                                <Rocket className="h-5 w-5 md:h-6 md:w-6" />
                            </div>
                        </div>
                        
                        <div className="relative z-10">
                            <h3 className="text-xl md:text-2xl font-black mb-2 md:mb-3 tracking-tight">Vocational CORE</h3>
                            <p className="text-xs md:text-sm text-indigo-100 font-medium leading-relaxed">
                                Purpose-built specifically for BCA, B.Sc IT, and professional degrees.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
