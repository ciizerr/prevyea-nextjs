"use client";

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Loader2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerInnerProps {
    url: string;
    downloadUrl?: string;
    onDownload?: () => void;
    // File navigation (optional — only shown when more than one file exists)
    fileLabel?: string;
    onPrevFile?: () => void;
    onNextFile?: () => void;
    hasPrev?: boolean;
    hasNext?: boolean;
}

export default function PDFViewerInner({
    url,
    downloadUrl,
    onDownload,
    fileLabel,
    onPrevFile,
    onNextFile,
    hasPrev = false,
    hasNext = false,
}: PDFViewerInnerProps) {
    const [numPages, setNumPages] = useState<number>();
    const [scale, setScale] = useState<number>(1.0);

    useEffect(() => {
        const updateWidth = () => {
            const container = document.getElementById('pdf-scroll-container');
            if (container) {
                const w = container.clientWidth - 32; // subtract padding
                if (w < 600) setScale(w / 600);
                else setScale(1.0);
            }
        };
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    const showFileNav = !!(onPrevFile || onNextFile);

    return (
        <div className="flex flex-col w-full h-full bg-zinc-100 dark:bg-zinc-950/50">
            {/* Top toolbar — zoom + optional download */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 z-10 sticky top-0 shrink-0">
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setScale(s => Math.max(0.4, s - 0.15))}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400"
                        title="Zoom Out"
                    >
                        <ZoomOut className="h-4 w-4" />
                    </button>
                    <span className="text-xs font-bold text-zinc-500 w-10 text-center tabular-nums">
                        {Math.round(scale * 100)}%
                    </span>
                    <button
                        onClick={() => setScale(s => Math.min(3, s + 0.15))}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400"
                        title="Zoom In"
                    >
                        <ZoomIn className="h-4 w-4" />
                    </button>
                    {numPages && (
                        <span className="ml-2 text-xs text-zinc-400 font-medium hidden sm:inline">
                            {numPages} {numPages === 1 ? 'page' : 'pages'}
                        </span>
                    )}
                </div>

                {downloadUrl && (
                    <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onDownload}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                        <Download className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Download</span>
                    </a>
                )}
            </div>

            {/* Scrollable all-pages view */}
            <div
                id="pdf-scroll-container"
                className="flex-1 w-full overflow-y-auto overflow-x-auto custom-scrollbar flex flex-col items-center gap-4 py-6 px-4 bg-zinc-200/60 dark:bg-black/20"
            >
                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                        <div className="flex flex-col items-center justify-center text-zinc-500 gap-3 py-24">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <p className="font-semibold text-sm">Rendering PDF...</p>
                        </div>
                    }
                    error={
                        <div className="text-red-500 bg-red-50 dark:bg-red-900/10 p-4 rounded-xl text-center py-10 border border-red-200 dark:border-red-900 max-w-sm">
                            <p className="font-bold">Failed to load PDF.</p>
                            <p className="text-xs mt-1 opacity-70">The file may not be accessible.</p>
                        </div>
                    }
                    className="flex flex-col items-center gap-4 w-full"
                >
                    {numPages
                        ? Array.from({ length: numPages }, (_, i) => (
                            <Page
                                key={`page_${i + 1}`}
                                pageNumber={i + 1}
                                scale={scale}
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                                className="shadow-lg border border-zinc-300 dark:border-zinc-700 bg-white"
                                loading={
                                    <div
                                        style={{ width: `${Math.round(600 * scale)}px`, height: `${Math.round(850 * scale)}px` }}
                                        className="bg-white dark:bg-zinc-900 animate-pulse rounded"
                                    />
                                }
                            />
                        ))
                        : (
                            // Show placeholder until numPages is known
                            <div
                                style={{ width: `${Math.round(600 * scale)}px`, height: `${Math.round(850 * scale)}px` }}
                                className="bg-white dark:bg-zinc-900 animate-pulse rounded shadow-lg"
                            />
                        )
                    }
                </Document>
            </div>

            {/* Bottom file navigation bar — only rendered when callbacks provided */}
            {showFileNav && (
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
                    <button
                        onClick={onPrevFile}
                        disabled={!hasPrev}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Previous</span>
                    </button>

                    {fileLabel && (
                        <span className="text-xs sm:text-sm font-semibold text-zinc-500 dark:text-zinc-400 text-center truncate max-w-[160px] sm:max-w-xs">
                            {fileLabel}
                        </span>
                    )}

                    <button
                        onClick={onNextFile}
                        disabled={!hasNext}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
