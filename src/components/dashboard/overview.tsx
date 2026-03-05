"use client";

import { useState } from "react";
import { FileDown, FolderOpen, TrendingUp, FileText, ChevronRight, Clock } from "lucide-react";
import ClickSpark from "@/components/reactbits/ClickSpark";
import { UploadModal } from "./upload-modal";
import Link from "next/link";
import type { DashboardUpload } from "@/actions/dashboard";

interface DashboardOverviewProps {
    userName: string;
    totalDownloads: number;
    totalUploads: number;
    pendingUploads: number;
    userRank: number | string;
    recentUploads: DashboardUpload[];
}

// Basic relative time formatter
function timeAgo(dateString: string | Date | null) {
    if (!dateString) return "just now";
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${Math.max(0, seconds)} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} months ago`;
    return `${Math.floor(months / 12)} years ago`;
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            {/* Welcome Banner */}
            <div className="relative w-full rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 md:p-12 overflow-hidden shadow-xl shadow-blue-900/20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full mt-[-100px] mr-[-100px] pointer-events-none"></div>
                <div className="relative z-10 text-white">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Welcome back, {userName}! 👋</h1>
                    <p className="text-blue-100 text-lg md:text-xl max-w-2xl opacity-90">
                        Check out the newly uploaded files from the community and continue tracking your progress!
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                        <ClickSpark className="relative">
                            <Link href="/vault" className="bg-white text-blue-600 hover:bg-zinc-50 px-6 py-3 rounded-xl font-bold transition-transform hover:scale-105 active:scale-95 shadow-md flex items-center gap-2">
                                <FolderOpen className="h-5 w-5" />
                                Browse Vault
                            </Link>
                        </ClickSpark>
                        <Link href="/leaderboard" className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-6 py-3 rounded-xl font-bold transition-transform hover:scale-105 active:scale-95 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            View Leaderboard
                        </Link>
                    </div>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Downloads", value: totalDownloads, icon: FileDown, color: "text-emerald-500", bg: "bg-emerald-500/10", badge: "total" },
                    { label: "Total Uploads", value: totalUploads, icon: FileText, color: "text-indigo-500", bg: "bg-indigo-500/10", badge: typeof userRank === "number" ? `Rank #${userRank}` : userRank },
                    { label: "Pending Review", value: pendingUploads, icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10", badge: "wait" },
                ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <Icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                                <span className="text-xs font-bold text-emerald-500 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-1 rounded-full uppercase tracking-wider">{stat.badge}</span>
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
                        <Link href="/vault" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">View All</Link>
                    </div>

                    <div className="space-y-4">
                        {recentUploads.length === 0 ? (
                            <div className="text-center p-8 text-zinc-500">No recent uploads found. Be the first to upload!</div>
                        ) : recentUploads.map((item) => (
                            <a
                                key={item.id}
                                href={item.downloadLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group cursor-pointer gap-4"
                            >
                                <div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm md:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.title}</h4>
                                    <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-500">
                                        <span className="bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-700 dark:text-zinc-300 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">{item.courseName || "General Course"} • {item.semester}</span>
                                        <span className="shrink-0">•</span>
                                        <span className="whitespace-nowrap overflow-hidden text-ellipsis">Uploaded by {item.uploaderName || "Unknown"}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0 justify-between sm:justify-end shrink-0">
                                    <span className="text-xs text-zinc-400">{timeAgo(item.createdAt)}</span>
                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all">
                                        <FileDown className="h-4 w-4" />
                                    </div>
                                </div>
                            </a>
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
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                        >
                            Upload Document
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </ClickSpark>
                </div>
            </div>

            {/* Hidden Modals */}
            <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
        </div>
    );
}
