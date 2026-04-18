/* eslint-disable @next/next/no-img-element */
export const dynamic = "force-dynamic";

import { getFileByIdAction } from "@/actions/curriculum";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, ShieldCheck, User } from "lucide-react";
import { ViewTracker } from "@/components/view-tracker";
import { ClientPaperViewer } from "./client-paper-viewer";

interface PaperPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PaperPageProps): Promise<Metadata> {
    const { id } = await params;
    const { success, data: paper } = await getFileByIdAction(id);

    if (!success || !paper) {
        return {
            title: "Paper Not Found | PU Digital Library",
        };
    }

    return {
        title: `${paper.year} ${paper.title} | ${paper.subjectName}`,
        description: `View and download ${paper.type} for ${paper.subjectName} (${paper.courseName}). Uploaded by ${paper.uploaderName || "Community"}.`,
        openGraph: {
            title: `${paper.year} ${paper.title} - ${paper.subjectName}`,
            description: `Academic resource for ${paper.courseName} students.`,
            type: "article",
        },
    };
}

export default async function PaperPage({ params }: PaperPageProps) {
    const { id } = await params;
    const { success, data: paper } = await getFileByIdAction(id);

    if (!success || !paper) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-[#fcfcfd] dark:bg-black selection:bg-indigo-100 dark:selection:bg-indigo-900/40">
            <ViewTracker id={paper.id} />
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-20">
                {/* Navigation Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-12">
                    <div className="space-y-6 flex-1">
                        <Link 
                            href="/vault" 
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-indigo-500 transition-all group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Library
                        </Link>
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter italic uppercase leading-none">
                                {paper.year} · {paper.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="px-4 py-1.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl">
                                    {paper.subjectName}
                                </span>
                                <span className="px-3 py-1.5 bg-indigo-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                                    {paper.type}
                                </span>
                                <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                    {paper.courseName} · {paper.semester}
                                </span>
                                <span className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Verified
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 bg-white dark:bg-zinc-900/50 md:bg-transparent md:dark:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none border border-zinc-100 dark:border-zinc-800/60 md:border-none shadow-sm md:shadow-none w-full md:w-auto mt-2 md:mt-4">
                        <div className="flex flex-col md:items-end">
                            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-0.5">Contributed by</span>
                            {paper.uploaderUsername ? (
                                <Link href={`/u/${paper.uploaderUsername}`} className="font-black text-sm text-zinc-900 dark:text-zinc-100 hover:text-indigo-500 transition-colors">
                                    @{paper.uploaderUsername}
                                </Link>
                            ) : (
                                <span className="font-black text-sm text-zinc-500 italic">
                                    {paper.uploaderName || "Anonymous"}
                                </span>
                            )}
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 overflow-hidden">
                            {paper.uploaderImage ? (
                                <img src={paper.uploaderImage} alt={paper.uploaderUsername || "Uploader"} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-5 h-5 text-indigo-500" />
                            )}
                        </div>
                    </div>
                </div>

                <ClientPaperViewer paper={paper} />
            </main>

            {/* Floating Share Branding */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 rounded-[2rem] shadow-2xl border border-white/10 dark:border-black/5 flex items-center gap-6 z-50">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap">PU Digital Library</span>
                </div>
                <div className="w-px h-6 bg-white/20 dark:bg-black/10" />
                <Link href="/" className="text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
                    Join Library
                </Link>
            </div>
        </div>
    );
}
