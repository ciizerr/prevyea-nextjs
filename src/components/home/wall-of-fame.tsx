"use client";

import { Trophy, Medal, Upload, Award, Sparkles } from "lucide-react";
import ClickSpark from "@/components/reactbits/ClickSpark";
import Link from "next/link";

const LEADERBOARD_DATA = [
    { rank: 1, name: "Rahul S.", course: "BCA Sem 5", uploads: 42, points: 1250, recent: "2023 OS Paper" },
    { rank: 2, name: "Aman K.", course: "B.Sc IT Sem 3", uploads: 38, points: 980, recent: "C++ Notes" },
    { rank: 3, name: "Priya M.", course: "BBA Sem 4", uploads: 25, points: 720, recent: "Official Syllabus" },
    { rank: 4, name: "Vikash D.", course: "BCA Sem 2", uploads: 18, points: 450, recent: "Math PYQs" },
    { rank: 5, name: "Neha Y.", course: "B.Sc Biotech", uploads: 12, points: 310, recent: "Zoology Notes" }
];

export interface LeaderboardUser {
    rank: number;
    name: string;
    course: string;
    uploads: number;
    points: number;
    recent: string;
}

export default function WallOfFame({ leaderboard }: { leaderboard?: LeaderboardUser[] }) {
    const dataToUse = leaderboard && leaderboard.length > 0 ? leaderboard : LEADERBOARD_DATA;

    return (
        <section className="w-full py-16 md:py-24 lg:py-40 px-4 relative bg-zinc-50 dark:bg-[#050505] overflow-hidden">
            {/* Ambient Background — hidden on mobile for performance */}
            <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[600px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12 md:mb-32 space-y-3 md:space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black text-[9px] md:text-[10px] uppercase tracking-widest mb-2 md:mb-4 border border-amber-100 dark:border-amber-500/20">
                        <Trophy className="h-3 w-3" />
                        Library Contributors
                    </div>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
                        Legends of the Library.
                    </h2>
                    <p className="text-sm md:text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium">
                        The ultimate flex? Empowering your juniors. Join the leaderboard by contributing verified study material.
                    </p>
                </div>

                {/* Highly Polished Leaderboard */}
                <div 
                    className="bg-white dark:bg-zinc-950 rounded-2xl md:rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] md:shadow-[0_40px_100px_-30px_rgba(0,0,0,0.1)] dark:shadow-none overflow-hidden mb-12 md:mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                    <th className="py-4 md:py-6 px-4 md:px-10">Status</th>
                                    <th className="py-4 md:py-6 px-3 md:px-4">Contributor</th>
                                    <th className="py-4 md:py-6 px-4 hidden md:table-cell">Recent Impact</th>
                                    <th className="py-4 md:py-6 px-4 md:px-10 text-right">Uploads</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/40">
                                {dataToUse.map((user) => (
                                    <tr key={user.rank} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-all duration-500">
                                        <td className="py-4 md:py-6 px-4 md:px-10">
                                            <div className="flex items-center justify-center">
                                                {user.rank === 1 ? (
                                                    <div className="relative">
                                                        <div className="absolute inset-0 bg-amber-500 blur-lg opacity-40 animate-pulse" />
                                                        <Trophy className="h-5 w-5 md:h-6 md:w-6 text-amber-500 relative z-10" />
                                                    </div>
                                                ) : user.rank === 2 ? (
                                                    <Medal className="h-5 w-5 md:h-6 md:w-6 text-zinc-400" />
                                                ) : user.rank === 3 ? (
                                                    <Award className="h-5 w-5 md:h-6 md:w-6 text-orange-400" />
                                                ) : (
                                                    <span className="font-black text-xs md:text-sm text-zinc-300 dark:text-zinc-700">{user.rank.toString().padStart(2, '0')}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 md:py-6 px-3 md:px-4">
                                            <div className="flex flex-col">
                                                <span className="font-black text-zinc-900 dark:text-zinc-100 text-xs md:text-sm group-hover:text-indigo-600 dark:group-hover:text-amber-400 transition-colors">{user.name}</span>
                                                <span className="text-[8px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{user.course}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 md:py-6 px-4 hidden md:table-cell">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 text-xs font-bold text-zinc-600 dark:text-zinc-400">
                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_5px_rgba(99,102,241,0.5)]" />
                                                {user.recent}
                                            </div>
                                        </td>
                                        <td className="py-4 md:py-6 px-4 md:px-10 text-right">
                                            <span className="font-black text-zinc-900 dark:text-zinc-100 text-sm md:text-base tabular-nums">
                                                {user.uploads.toLocaleString()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8">
                    <p className="text-zinc-400 font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-center">
                        Your legacy begins with one contribution.
                    </p>
                    <ClickSpark className="w-full sm:w-auto">
                        <Link href="/vault" className="w-full sm:w-auto bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 font-black text-[10px] md:text-xs uppercase tracking-wider md:tracking-[0.2em] py-4 md:py-5 px-8 md:px-10 rounded-xl md:rounded-[1.5rem] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 md:gap-3">
                            <Upload className="h-4 w-4" />
                            Contribute Material
                            <Sparkles className="h-4 w-4" />
                        </Link>
                    </ClickSpark>
                </div>
            </div>
        </section>
    );
}
