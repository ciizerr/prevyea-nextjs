import { Flame, BellRing, Star, Rocket, ShieldCheck, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function CourseGrid() {
    return (
        <section className="w-full py-24 md:py-32 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16 md:mb-20 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Everything you need.<br />Nothing you don&apos;t.
                    </h2>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                        A purposefully built hub designed specifically for the unique needs of PU Vocational students.
                    </p>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto auto-rows-[250px] md:auto-rows-[300px]">

                    {/* Box 1 (Large): The PYQ Vault */}
                    <Link href="#" className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 md:row-span-2 group relative bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-10 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/20 blur-[80px] rounded-full pointer-events-none transition-transform group-hover:scale-110" />
                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl mb-6">
                                <ShieldCheck className="h-8 w-8" />
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4 tracking-tight">The PYQ Vault</h3>
                            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-sm">
                                Years of verified past papers, unlocked and organized by semester. No more dead links.
                            </p>
                        </div>
                        <div className="relative z-10 mt-8 flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-2 transition-all">
                            Enter the Vault <ArrowUpRight className="h-5 w-5 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </div>

                        {/* Decorative Graphic */}
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 dark:from-blue-600/20 dark:to-indigo-600/20 rounded-full border border-blue-200/50 dark:border-blue-800/50 shadow-inner flex items-center justify-center backdrop-blur-md">
                            <div className="w-48 h-48 bg-white/50 dark:bg-zinc-950/50 rounded-full border border-white/40 dark:border-zinc-800/50 shadow-lg flex items-center justify-center">
                                <Flame className="h-20 w-20 text-blue-500/50 dark:text-blue-400/50" />
                            </div>
                        </div>
                    </Link>

                    {/* Box 2 (Tall): Updates & News */}
                    <div className="col-span-1 md:col-span-1 lg:col-span-1 row-span-1 md:row-span-2 relative bg-zinc-900 dark:bg-zinc-950 rounded-3xl p-6 md:p-8 border border-zinc-800 hover:border-emerald-500/50 transition-all overflow-hidden flex flex-col group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[50px] rounded-full pointer-events-none" />

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="p-2.5 bg-zinc-800 rounded-xl text-emerald-400">
                                <BellRing className="h-5 w-5" />
                            </div>
                            <span className="flex h-2.5 w-2.5 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 relative z-10">PU Updates</h3>
                        <p className="text-sm text-zinc-400 mb-6 relative z-10">Official syllabus changes and notices.</p>

                        {/* Mini feed */}
                        <div className="space-y-3 mt-auto relative z-10">
                            <div className="bg-zinc-800/50 border border-zinc-700/50 p-3 rounded-xl backdrop-blur-sm">
                                <p className="text-xs text-emerald-400 font-medium mb-1">New Upload</p>
                                <p className="text-sm text-zinc-300">BCA Sem 4 Syllabus updated</p>
                            </div>
                            <div className="bg-zinc-800/50 border border-zinc-700/50 p-3 rounded-xl backdrop-blur-sm">
                                <p className="text-xs text-blue-400 font-medium mb-1">Notice</p>
                                <p className="text-sm text-zinc-300 line-clamp-2">Mid-sem exam dates announced for vocational batches.</p>
                            </div>
                        </div>
                    </div>

                    {/* Box 3 (Small Top Right): Verified Notes */}
                    <div className="col-span-1 md:col-span-1 lg:col-span-1 row-span-1 bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 shadow-sm transition-all overflow-hidden relative group">
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 dark:bg-amber-500/20 blur-[40px] rounded-full pointer-events-none" />
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="flex bg-amber-50 dark:bg-amber-900/20 w-fit p-3 rounded-2xl text-amber-500 dark:text-amber-400 mb-4">
                                <Star className="h-6 w-6 fill-amber-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Verified Notes</h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">Crowdsourced from toppers. Peer-reviewed for accuracy.</p>
                            </div>
                        </div>
                    </div>

                    {/* Box 4 (Small Bottom Right): Vocational First */}
                    <div className="col-span-1 md:col-span-3 lg:col-span-1 row-span-1 bg-blue-600 text-white rounded-3xl p-6 md:p-8 border border-blue-500 shadow-xl shadow-blue-600/20 transition-all overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-[40px] rounded-full pointer-events-none" />
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="flex bg-white/20 backdrop-blur-sm w-fit p-3 rounded-2xl text-white mb-4">
                                <Rocket className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Vocational First</h3>
                                <p className="text-sm text-blue-100">BCA. B.Sc IT. BBA. Built for the modern degrees.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
