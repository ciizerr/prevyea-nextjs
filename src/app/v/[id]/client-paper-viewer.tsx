"use client";

import { useState } from "react";
import PDFViewer from "@/components/pdf-viewer";
import { Eye, Download, Share2 } from "lucide-react";
import dayjs from "dayjs";
import Link from "next/link";
import { incrementDownloadAction } from "@/actions/curriculum";

export function ClientPaperViewer({ paper }: { paper: any }) {
    const [downloads, setDownloads] = useState(paper.downloads || 0);

    const handleDownload = async () => {
        setDownloads((prev: number) => prev + 1);
        await incrementDownloadAction(paper.id);
    };

    return (
        <>
            {/* PDF Viewer Container */}
            <div className="relative bg-white dark:bg-zinc-950/40 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden h-[850px] group transition-all duration-500 hover:border-indigo-500/30">
                <PDFViewer 
                    url={paper.viewLink} 
                    downloadUrl={paper.downloadLink}
                    fileLabel={`${paper.year} - ${paper.title}`}
                    onDownload={handleDownload}
                    extraInfo={
                        <div className="flex sm:hidden items-center gap-3 text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400">
                            <div className="flex items-center gap-1.5 shrink-0">
                                <span className="opacity-70">by</span>
                                {paper.uploaderUsername ? (
                                    <Link 
                                        href={`/u/${paper.uploaderUsername}`}
                                        className="text-zinc-700 dark:text-zinc-200 hover:text-indigo-500 transition-colors underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-4"
                                    >
                                        @{paper.uploaderUsername}
                                    </Link>
                                ) : (
                                    <span className="text-zinc-500 italic">Deleted User</span>
                                )}
                            </div>
                            <div className="w-px h-3 bg-zinc-300 dark:bg-zinc-700" />
                            <span className="flex items-center gap-1.5 shrink-0 text-zinc-600 dark:text-zinc-300">
                                <Eye className="w-3 h-3 text-zinc-400" />
                                {(paper.views || 0) + 1}
                            </span>
                        </div>
                    }
                />
            </div>

            {/* Info Footer */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
                <div className="bg-white dark:bg-zinc-900/40 p-8 md:p-10 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800/60 shadow-xl space-y-4">
                    <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                        <Eye className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight italic uppercase">Reach</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium">{(paper.views || 0) + 1} Views</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900/40 p-8 md:p-10 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800/60 shadow-xl space-y-4">
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                        <Download className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight italic uppercase">Activity</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium">{downloads} Downloads</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900/40 p-8 md:p-10 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800/60 shadow-xl space-y-4">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                        <Share2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight italic uppercase">Shared On</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium">{dayjs(paper.createdAt).format('MMMM DD, YYYY')}</p>
                    </div>
                </div>
            </div>
        </>
    );
}
