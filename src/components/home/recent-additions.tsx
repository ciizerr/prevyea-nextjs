"use client";

import { FileText, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import ClickSpark from "@/components/reactbits/ClickSpark";

export default function RecentAdditions({ pyqs }: { pyqs?: { id?: string; title: string; type: string; createdAt?: Date | null; subjectId?: string; }[] }) {
    const defaultData: { id?: string; title: string; type: string; createdAt?: Date | null; subjectId?: string; }[] = [
        { title: "BCA Semester 3 - Object Oriented Programming (2024)", type: "PYQ", createdAt: null },
        { title: "BCA Semester 1 - Math Syllabus Update", type: "Syllabus", createdAt: null },
        { title: "B.Sc. IT Semester 4 - Database Management Systems", type: "PYQ", createdAt: null },
        { title: "BBA Semester 2 - Business Economics Notes", type: "Notes", createdAt: null },
    ];

    const itemsToRender = pyqs && pyqs.length > 0 ? pyqs : defaultData;

    return (
        <section className="w-full py-16 md:py-24 lg:py-40 bg-transparent border-t border-zinc-100 dark:border-zinc-900">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-10 md:mb-16 px-2 md:px-4">
                    <div className="space-y-1.5 md:space-y-2">
                        <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                            <Sparkles className="h-3 w-3" />
                            Live Archive
                        </div>
                        <h2 className="text-2xl md:text-3xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">Fresh Additions.</h2>
                    </div>
                    <ClickSpark className="relative inline-flex">
                        <Link href="/vault" className="hidden md:flex items-center text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-indigo-600 transition-colors">
                            Browse Collection <ChevronRight className="h-3 w-3 ml-2" />
                        </Link>
                    </ClickSpark>
                </div>

                <div 
                    className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-[0_15px_40px_-10px_rgba(0,0,0,0.04)] md:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-none animate-in fade-in slide-in-from-bottom-4 duration-700"
                >
                    {itemsToRender.map((item, i) => (
                        <div key={item.id || i} className={`flex items-center justify-between p-4 md:p-6 lg:p-8 ${i !== itemsToRender.length - 1 ? 'border-b border-zinc-50 dark:border-zinc-800/40' : ''} hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-all duration-500 group`}>
                            <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0 pr-3 md:pr-6">
                                <div className="p-2.5 md:p-4 bg-zinc-100 dark:bg-zinc-900 rounded-xl md:rounded-2xl text-zinc-400 group-hover:text-indigo-500 group-hover:scale-110 transition-all duration-500 shrink-0">
                                    <FileText className="h-4 w-4 md:h-6 md:w-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-black text-zinc-900 dark:text-zinc-100 text-xs md:text-sm lg:text-base truncate group-hover:translate-x-1 transition-transform">{item.title}</h4>
                                    <div className="flex gap-2 md:gap-3 items-center mt-1 md:mt-2">
                                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest px-1.5 md:px-2 py-0.5 md:py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md">
                                            {item.type}
                                        </span>
                                        <span className="text-[8px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest hidden sm:block">
                                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Active Now'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <ClickSpark className="relative ml-auto shrink-0">
                                <Link
                                    href={
                                        item.id 
                                            ? (item.type === "Syllabus" && item.subjectId ? `/s/${item.subjectId}` : `/v/${item.id}`)
                                            : "/vault"
                                    }
                                    className="p-2.5 md:p-4 lg:px-6 lg:py-3 text-[9px] md:text-[10px] font-black uppercase tracking-wider md:tracking-widest rounded-lg md:rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 md:gap-2"
                                >
                                    <span className="hidden sm:inline">Explore</span>
                                    <ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                </Link>
                            </ClickSpark>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
