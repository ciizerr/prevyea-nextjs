"use client";

import { X, FileText } from "lucide-react";
import PDFViewer from "@/components/pdf-viewer";

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    title: string;
}

export function PreviewModal({ isOpen, onClose, url, title }: PreviewModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-zinc-900/80 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-5xl h-full max-h-[90vh] bg-zinc-200 dark:bg-zinc-950 rounded-2xl md:rounded-3xl border border-zinc-300 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                {/* Fixed Toolbar */}
                <div className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-300 dark:border-zinc-800 flex items-center justify-between px-4 sm:px-6 shrink-0 z-20">
                    <div className="flex items-center gap-4">
                        <div className="p-2 sm:p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 line-clamp-1 max-w-[150px] sm:max-w-md">
                                {title}
                            </h3>
                            <p className="text-xs text-zinc-500 font-medium whitespace-nowrap">Verification Preview</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* PDF Viewer Container */}
                <div className="flex-1 w-full bg-black/5 relative overflow-hidden">
                    <PDFViewer
                        url={url}
                        fileLabel={title}
                    />
                </div>
            </div>
        </div>
    );
}
