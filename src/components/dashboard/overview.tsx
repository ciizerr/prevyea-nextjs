"use client";

import { FileDown, FolderOpen, Heart, TrendingUp, Clock, FileText, ChevronRight } from "lucide-react";
import ClickSpark from "@/components/reactbits/ClickSpark";

export function DashboardOverview() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            {/* Welcome Banner */}
            <div className="relative w-full rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 md:p-12 overflow-hidden shadow-xl shadow-blue-900/20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full mt-[-100px] mr-[-100px] pointer-events-none"></div>
                <div className="relative z-10 text-white">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Welcome back, Student! 👋</h1>
                    <p className="text-blue-100 text-lg md:text-xl max-w-2xl opacity-90">
                        You have 3 new updates in BCA Sem 3 syllabus, and 2 new PYQs were just uploaded for Operating Systems.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                        <ClickSpark>
                            <button className="bg-white text-blue-600 hover:bg-zinc-50 px-6 py-3 rounded-xl font-bold transition-transform hover:scale-105 active:scale-95 shadow-md flex items-center gap-2">
                                <FolderOpen className="h-5 w-5" />
                                Browse Vault
                            </button>
                        </ClickSpark>
                        <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-6 py-3 rounded-xl font-bold transition-transform hover:scale-105 active:scale-95 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            View Leaderboard
                        </button>
                    </div>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Downloads", value: "142", icon: FileDown, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                    { label: "Community Points", value: "850", icon: Heart, color: "text-red-500", bg: "bg-red-500/10" },
                    { label: "Study Hours Saved", value: "24h", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <Icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                                <span className="text-xs font-bold text-emerald-500 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-1 rounded-full">+12%</span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">{stat.value}</h3>
                                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Recent Activity Bento */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-indigo-500" />
                            Recently Uploaded Notes
                        </h2>
                        <button className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">View All</button>
                    </div>

                    <div className="space-y-4">
                        {[
                            { title: "Operating Systems (2022 PYQ)", course: "BCA Sem 3", date: "2 hours ago", author: "Aman K." },
                            { title: "DBMS Unit 1-4 Complete Notes", course: "B.Sc IT Sem 2", date: "5 hours ago", author: "Rahul S." },
                            { title: "Software Engineering End Sem", course: "BCA Sem 4", date: "1 day ago", author: "Priya M." },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group cursor-pointer gap-4">
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm md:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.title}</h4>
                                    <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-500">
                                        <span className="bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-700 dark:text-zinc-300 font-medium">{item.course}</span>
                                        <span>•</span>
                                        <span>Uploaded by {item.author}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0 justify-between sm:justify-end shrink-0">
                                    <span className="text-xs text-zinc-400">{item.date}</span>
                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all">
                                        <FileDown className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col items-center text-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                        <FolderOpen className="h-8 w-8 text-blue-600 dark:text-blue-500" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">Have old notes?</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 max-w-[200px]">
                        Upload your previous year papers and notes to help juniors and climb the Wall of Fame.
                    </p>
                    <ClickSpark className="w-full">
                        <button className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95">
                            Upload Document
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </ClickSpark>
                </div>
            </div>
        </div>
    );
}
