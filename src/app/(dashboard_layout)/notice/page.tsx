"use client";

import { useState } from "react";
import { Search, Calendar, BellRing, Trophy, GraduationCap, ChevronRight, Filter } from "lucide-react";
import ClickSpark from "@/components/reactbits/ClickSpark";

const mockNotices = [
    {
        id: 1,
        title: "Mid-Semester Examinations 2026 Schedule Released",
        type: "Exam",
        date: "March 15, 2026",
        content: "The official schedule for the upcoming Mid-Semester examinations has been published. Exams will commence from April 5th. Please download the detailed date sheet from the university portal. All students must ensure their admit cards are printed before the first exam.",
        author: "Examination Branch",
        icon: GraduationCap,
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-100 dark:bg-red-950/30",
        border: "border-red-200 dark:border-red-900/50"
    },
    {
        id: 2,
        title: "Annual Tech Symposium: HackPU 2026 Registration Open",
        type: "Event",
        date: "March 10, 2026",
        content: "Registrations are now open for HackPU 2026! Join us for a 48-hour hackathon featuring workshops, mentorship sessions, and exciting prizes. Form a team of up to 4 members. Early bird registration ends next week.",
        author: "Computer Science Dept",
        icon: Trophy,
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-100 dark:bg-amber-950/30",
        border: "border-amber-200 dark:border-amber-900/50"
    },
    {
        id: 3,
        title: "Library Maintenance Notice - Server Downtime",
        type: "General",
        date: "March 08, 2026",
        content: "The PU Digital Library will undergo scheduled maintenance this Sunday from 2:00 AM to 6:00 AM IST. During this window, downloading PYQs and viewing syllabus materials may be temporarily unavailable. We apologize for the inconvenience.",
        author: "IT Support Services",
        icon: BellRing,
        color: "text-indigo-600 dark:text-indigo-400",
        bg: "bg-indigo-100 dark:bg-indigo-950/30",
        border: "border-indigo-200 dark:border-indigo-900/50"
    },
    {
        id: 4,
        title: "Guest Lecture on Artificial Intelligence in Modern Web",
        type: "Event",
        date: "March 05, 2026",
        content: "We are hosting a guest lecture featuring Dr. Alan Turing (figuratively speaking) on the impact of AI in modern web development frameworks. Attendance is mandatory for 3rd-year BCA and B.Sc IT students.",
        author: "Faculty Coordinator",
        icon: Calendar,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-100 dark:bg-emerald-950/30",
        border: "border-emerald-200 dark:border-emerald-900/50"
    },
];

export default function NoticeBoardPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

    const filters = ["All", "Exam", "Event", "General"];

    const filteredNotices = mockNotices.filter((notice) => {
        const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            notice.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === "All" || notice.type === activeFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="w-full max-w-5xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="mb-8 sm:mb-12">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-3 tracking-tight">
                    Notice Board
                </h1>
                <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl">
                    Stay updated with essential university announcements, exam schedules, and upcoming community events.
                </p>
            </div>

            {/* Smart Toolbar (Search & Filters) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 bg-white dark:bg-zinc-900 p-2 sm:p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                {/* Search Input */}
                <div className="relative w-full sm:w-80 shrink-0">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-zinc-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search notices..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border-none bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-medium"
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 px-2 sm:px-0 hide-scrollbar shrink-0 sm:pr-2">
                    <div className="hidden sm:flex items-center justify-center p-2 text-zinc-400">
                        <Filter className="h-4 w-4" />
                    </div>
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 text-sm font-bold rounded-xl whitespace-nowrap transition-all ${activeFilter === filter
                                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notice Timeline / List */}
            <div className="relative space-y-6">
                {filteredNotices.length > 0 ? (
                    filteredNotices.map((notice) => {
                        const Icon = notice.icon;
                        return (
                            <div key={notice.id} className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all duration-300">
                                {/* Decorative Gradient Blur on Hover */}
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-[2rem] opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500 pointer-events-none" />

                                <div className="relative z-10">
                                    {/* Top Row: Icon + Badges */}
                                    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-4 rounded-2xl ${notice.bg} ${notice.color} border ${notice.border} shadow-sm shrink-0`}>
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white leading-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {notice.title}
                                                </h2>
                                                <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-zinc-500">
                                                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {notice.date}</span>
                                                    <span className="hidden sm:inline">•</span>
                                                    <span className="flex items-center gap-1.5">{notice.author}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="shrink-0 ml-16 sm:ml-0">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wider ${notice.bg} ${notice.color} border ${notice.border}`}>
                                                {notice.type}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="ml-0 sm:ml-20">
                                        <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6 font-medium text-sm sm:text-base">
                                            {notice.content}
                                        </p>

                                        <div className="flex items-center justify-between pt-5 border-t border-zinc-100 dark:border-zinc-800/60">
                                            <button className="text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center gap-1">
                                                Read full notice <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-20 bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 border-dashed rounded-3xl">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 mb-6 transition-transform group-hover:scale-110">
                            <Search className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">No notices found</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-md mx-auto">
                            We couldn&apos;t find any announcements matching &quot;{searchQuery}&quot; in the {activeFilter} category.
                        </p>
                        <ClickSpark className="mt-6 flex justify-center">
                            <button
                                onClick={() => { setSearchQuery(""); setActiveFilter("All"); }}
                                className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
                            >
                                Clear Filters
                            </button>
                        </ClickSpark>
                    </div>
                )}
            </div>
        </div>
    );
}
