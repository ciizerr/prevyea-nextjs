"use client";

import { useState } from "react";
import { FileDown, FolderOpen, TrendingUp, FileText, ChevronRight, Clock, Sparkles, Trophy, Plus, ArrowUpRight } from "lucide-react";
import ClickSpark from "@/components/reactbits/ClickSpark";
import { UploadModal } from "./upload-modal";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { DashboardUpload } from "@/actions/dashboard";

dayjs.extend(relativeTime);

interface DashboardOverviewProps {
    userName: string;
    totalDownloads: number;
    totalUploads: number;
    pendingUploads: number;
    userRank: number | string;
    recentUploads: DashboardUpload[];
}

export function DashboardOverview({
    userName,
    totalDownloads,
    totalUploads,
    pendingUploads,
    userRank,
    recentUploads
}: DashboardOverviewProps) {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    return (
        <div className="relative space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20 selection:bg-blue-100 dark:selection:bg-blue-900/40">

            {/* Background Ambient Glows */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-0 right-0 w-[30%] h-[30%] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[100px] rounded-full" />
            </div>

            {/* Premium Welcome Header */}
            <div className="relative group overflow-hidden rounded-[2.5rem] bg-zinc-900 dark:bg-zinc-950 border border-white/10 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20 pointer-events-none" />

                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-full h-full">
                    <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-20%] left-[20%] w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full" />
                </div>

                <div className="relative z-10 p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex-1 space-y-6 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest">
                            <Sparkles className="w-3.5 h-3.5" />
                            Personal Portal
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
                                Welcome back,<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                    {userName}
                                </span>
                            </h1>
                            <p className="text-zinc-400 text-lg md:text-xl max-w-xl font-medium leading-relaxed">
                                Join our thriving community of Patna University students. Share resources, help your peers, and build your legacy.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">

                            <Link href="/vault" className="bg-white text-zinc-950 hover:bg-zinc-100 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-3">
                                <FolderOpen className="h-5 w-5" />
                                Explore Library
                            </Link>

                            <Link href="/leaderboard" className="bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
                                <Trophy className="h-5 w-5 text-yellow-400" />
                                Hall of Fame
                            </Link>
                        </div>
                    </div>

                    <div className="hidden lg:flex relative shrink-0">
                        {/* Decorative Bento Illustration Placeholder */}
                        <div className="relative w-72 h-72 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[3rem] p-8 rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-2xl flex flex-col items-center justify-center text-white overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full translate-x-1/2 translate-y-1/2" />
                            <Sparkles className="w-20 h-20 mb-4 opacity-50 animate-bounce" />
                            <div className="text-center">
                                <p className="font-black text-2xl">PU Library</p>
                                <p className="text-xs font-bold opacity-70 uppercase tracking-widest pt-1">Patna University</p>
                            </div>
                        </div>
                        <div className="absolute -inset-4 bg-blue-500/20 blur-3xl -z-10 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Bento-Style Metric Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        label: "Digital Reach",
                        subLabel: "Total Downloads",
                        value: totalDownloads,
                        icon: FileDown,
                        color: "text-blue-500",
                        bg: "bg-blue-500/10",
                        accent: "bg-blue-500/20",
                        description: "People benefited from your notes"
                    },
                    {
                        label: "Peer Contribution",
                        subLabel: "Total Uploads",
                        value: totalUploads,
                        icon: FileText,
                        color: "text-indigo-500",
                        bg: "bg-indigo-500/10",
                        accent: "bg-indigo-500/20",
                        rank: typeof userRank === "number" ? `Rank #${userRank}` : userRank,
                        description: "Verified items in global library"
                    },
                    {
                        label: "Moderation Queue",
                        subLabel: "Pending Review",
                        value: pendingUploads,
                        icon: Clock,
                        color: "text-amber-500",
                        bg: "bg-amber-500/10",
                        accent: "bg-amber-500/20",
                        description: "Awaiting approval from community"
                    },
                ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="group relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/60 rounded-[2.5rem] p-8 shadow-xl shadow-zinc-200/20 dark:shadow-none hover:-translate-y-2 transition-all duration-500">
                            <div className="flex items-center justify-between mb-8">
                                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-zinc-950 transition-colors duration-500`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                {stat.rank && (
                                    <span className="text-[10px] font-black text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-lg">
                                        {stat.rank}
                                    </span>
                                )}
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">{stat.subLabel}</p>
                                    <h3 className="text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{stat.value}</h3>
                                </div>
                                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">{stat.description}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Activity Hub Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Recent Activity Card */}
                <div className="lg:col-span-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl shadow-zinc-200/20 dark:shadow-none relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none" />

                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">Live Community Stream</h2>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Recently Uploaded Notes</p>
                            </div>
                        </div>
                        <Link href="/vault" className="group text-sm font-black text-blue-600 dark:text-blue-400 flex items-center gap-2 hover:translate-x-1 transition-all">
                            Explore Archive <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-4 relative z-10">
                        {recentUploads.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-zinc-50 dark:bg-zinc-900/40 rounded-[2rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                                <div className="p-4 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm">
                                    <Plus className="h-8 w-8 text-zinc-300" />
                                </div>
                                <p className="text-zinc-500 dark:text-zinc-400 font-bold max-w-[200px]">No activity found today. Start the stream by uploading!</p>
                            </div>
                        ) : (
                            recentUploads.map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.type === "Syllabus" ? `/s/${item.subjectId}` : `/v/${item.id}`}
                                    className="group flex items-center bg-zinc-50 dark:bg-zinc-900/40 hover:bg-white dark:hover:bg-zinc-900 border border-transparent hover:border-blue-500/30 p-5 rounded-[2rem] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1"
                                >
                                    <div className="flex-1 flex items-center gap-6 min-w-0">
                                        <div className="hidden sm:flex shrink-0 w-14 h-14 bg-white dark:bg-zinc-800 rounded-2xl items-center justify-center text-zinc-400 group-hover:text-blue-500 shadow-sm transition-colors duration-300">
                                            <FileText className="h-7 w-7" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-md">
                                                    {item.semester}
                                                </span>
                                                <span className="text-[10px] font-bold text-zinc-400 tracking-tight flex items-center gap-1.5">
                                                    <Clock className="w-3 h-3" />
                                                    {dayjs(item.createdAt).fromNow()}
                                                </span>
                                            </div>
                                            <h4 className="font-black text-zinc-900 dark:text-zinc-100 text-base truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {item.title}
                                            </h4>
                                            <p className="text-[11px] font-bold text-zinc-500 truncate mt-0.5">
                                                {item.courseName || "General Course"} • Uploaded by <span className="text-zinc-700 dark:text-zinc-300">@{item.uploaderName || "Unknown"}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="shrink-0 p-3 bg-white dark:bg-zinc-800 rounded-xl text-zinc-400 group-hover:text-blue-600 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/20 transition-all ml-4">
                                        <ArrowUpRight className="h-5 w-5" />
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                {/* Call to Action Sticky/Bento Side */}
                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-10 flex flex-col items-center text-center justify-between relative overflow-hidden group shadow-2xl shadow-blue-500/20 order-last lg:order-none">
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-3xl rounded-full" />

                    <div className="space-y-6 relative z-10 w-full">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-500">
                            <Plus className="h-10 w-10 text-white" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-2xl font-black text-white leading-tight">Help the Community</h3>
                            <p className="text-blue-100/70 text-sm font-medium leading-relaxed">
                                Upload your old PYQs or notes to earn contribution points and help juniors.
                            </p>
                        </div>
                    </div>

                    <ClickSpark className="w-full relative z-10 pt-10">
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="w-full bg-white hover:bg-zinc-50 text-indigo-700 font-black py-4 rounded-[1.5rem] shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-sm"
                        >
                            Quick Upload
                            <ArrowUpRight className="h-4 w-4" />
                        </button>
                    </ClickSpark>
                </div>
            </div>

            {/* Hidden Modals */}
            <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
        </div>
    );
}
