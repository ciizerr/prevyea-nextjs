"use client";

import { FileText, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import ClickSpark from "@/components/reactbits/ClickSpark";
import { motion } from "framer-motion";

export default function RecentAdditions({ pyqs }: { pyqs?: { id?: string; title: string; type: string; createdAt?: Date | null; }[] }) {
    const defaultData: { id?: string; title: string; type: string; createdAt?: Date | null; }[] = [
        { title: "BCA Semester 3 - Object Oriented Programming (2024)", type: "PYQ", createdAt: null },
        { title: "BCA Semester 1 - Math Syllabus Update", type: "Syllabus", createdAt: null },
        { title: "B.Sc. IT Semester 4 - Database Management Systems", type: "PYQ", createdAt: null },
        { title: "BBA Semester 2 - Business Economics Notes", type: "Notes", createdAt: null },
    ];

    const itemsToRender = pyqs && pyqs.length > 0 ? pyqs : defaultData;

    return (
        <section className="w-full py-24 md:py-40 bg-transparent border-t border-zinc-100 dark:border-zinc-900">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-16 px-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                            <Sparkles className="h-3 w-3" />
                            Live Archive
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">Fresh Additions.</h2>
                    </div>
                    <ClickSpark className="relative inline-flex">
                        <Link href="/vault" className="hidden md:flex items-center text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-indigo-600 transition-colors">
                            Browse Collection <ChevronRight className="h-3 w-3 ml-2" />
                        </Link>
                    </ClickSpark>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-none"
                >
                    {itemsToRender.map((item, i) => (
                        <div key={item.id || i} className={`flex items-center justify-between p-6 md:p-8 ${i !== itemsToRender.length - 1 ? 'border-b border-zinc-50 dark:border-zinc-800/40' : ''} hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-all duration-500 group`}>
                            <div className="flex items-center gap-6 flex-1 min-w-0 pr-6">
                                <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-2xl text-zinc-400 group-hover:text-indigo-500 group-hover:scale-110 transition-all duration-500">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-black text-zinc-900 dark:text-zinc-100 text-sm md:text-base truncate group-hover:translate-x-1 transition-transform">{item.title}</h4>
                                    <div className="flex gap-3 items-center mt-2">
                                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md">
                                            {item.type}
                                        </span>
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Active Now'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <ClickSpark className="relative ml-auto shrink-0">
                                <Link
                                    href={item.id ? `/vault?search=${encodeURIComponent(item.title)}` : "/vault"}
                                    className="p-4 md:px-6 md:py-3 text-[10px] font-black uppercase tracking-widest rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                                >
                                    <span className="hidden sm:inline">Explore</span>
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </ClickSpark>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
