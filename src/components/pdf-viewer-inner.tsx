"use client";

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Loader2, ZoomIn, ZoomOut, Download } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerInnerProps {
    url: string;
    downloadUrl?: string;
    onDownload?: () => void;
    filename?: string;
}

export default function PDFViewerInner({
    url,
    downloadUrl,
    onDownload,
    filename,
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

    return (
        <div className="flex flex-col w-full h-full bg-zinc-100 dark:bg-zinc-950/50 min-h-0">
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
                    <button
                        onClick={async (e) => {
                            if (onDownload) onDownload();
                            const btn = e.currentTarget;
                            const originalContent = btn.innerHTML;
                            
                            try {
                                btn.disabled = true;
                                btn.innerHTML = `<svg class="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> <span>Preparing...</span>`;
                                
                                const response = await fetch(downloadUrl);
                                const blob = await response.blob();
                                const blobUrl = window.URL.createObjectURL(blob);
                                
                                const a = document.createElement('a');
                                a.href = blobUrl;
                                // Use provided filename or fallback to URL part
                                const cleanFilename = filename 
                                    ? `${filename.replace(/[/\\?%*:|"<>]/g, '-')}.pdf` 
                                    : (downloadUrl.split('/').pop()?.split('?')[0] || 'paper.pdf');
                                a.download = cleanFilename;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                window.URL.revokeObjectURL(blobUrl);
                            } catch (err) {
                                console.error("Download error:", err);
                                // Fallback
                                window.open(downloadUrl, '_blank');
                            } finally {
                                btn.disabled = false;
                                btn.innerHTML = originalContent;
                            }
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-70"
                    >
                        <Download className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Download</span>
                    </button>
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

        </div>
    );
}
