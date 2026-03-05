"use client";

/**
 * SSR-safe wrapper — react-pdf uses browser globals (DOMMatrix etc.)
 * that crash in Node.js. next/dynamic with ssr:false prevents that.
 */
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const PDFViewerInner = dynamic(() => import('./pdf-viewer-inner'), {
    ssr: false,
    loading: () => (
        <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] text-zinc-500 gap-3">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="font-semibold text-sm">Initializing Viewer...</p>
        </div>
    ),
});

interface PDFViewerProps {
    url: string;
    downloadUrl?: string;
    onDownload?: () => void;
    fileLabel?: string;
    onPrevFile?: () => void;
    onNextFile?: () => void;
    hasPrev?: boolean;
    hasNext?: boolean;
}

export default function PDFViewer(props: PDFViewerProps) {
    return <PDFViewerInner {...props} />;
}
