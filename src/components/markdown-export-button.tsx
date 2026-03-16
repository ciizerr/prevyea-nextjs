"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface MarkdownExportButtonProps {
    elementId: string;
    fileName: string;
    headerData?: {
        title: string;
        course?: string;
        semester?: string;
    };
    className?: string;
}

export default function MarkdownExportButton({
    elementId,
    fileName,
    headerData,
    className = "px-10 py-5 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95 disabled:opacity-30 text-[11px] uppercase tracking-widest"
}: MarkdownExportButtonProps) {
    const [exporting, setExporting] = useState(false);

    const handleExport = () => {
        const element = document.getElementById(elementId);
        if (!element) {
            toast.error("Content not found for export");
            return;
        }

        setExporting(true);
        try {
            const iframe = document.createElement('iframe');
            iframe.style.position = 'fixed';
            iframe.style.right = '0';
            iframe.style.bottom = '0';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = '0';
            document.body.appendChild(iframe);

            const iframeDoc = iframe.contentWindow?.document;
            if (!iframeDoc) throw new Error("Could not create iframe");

            iframeDoc.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${fileName}</title>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #000; padding: 2cm; line-height: 1.6; }
                        h1, h2, h3, h4 { color: #000; margin-top: 24px; margin-bottom: 16px; font-weight: 600; }
                        h1 { font-size: 2em; border-bottom: 1px solid #ccc; padding-bottom: 0.3em; margin-top: 0; }
                        h2 { font-size: 1.5em; border-bottom: 1px solid #ccc; padding-bottom: 0.3em; margin-top: 32px; }
                        p { margin-bottom: 16px; font-size: 12pt; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 11pt; }
                        th, td { border: 1px solid #000; padding: 8px 12px; text-align: left; }
                        th { font-weight: 600; }
                        ul, ol { margin-bottom: 16px; padding-left: 32px; font-size: 12pt; }
                        li { margin-bottom: 8px; }
                        a { color: #000; text-decoration: underline; }
                        blockquote { border-left: 4px solid #ccc; padding-left: 16px; color: #333; font-style: italic; margin: 0 0 16px 0; }
                        code { font-family: monospace; font-size: 0.9em; }
                        pre { padding: 16px; border: 1px solid #ccc; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word; }
                        .print-header { text-align: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid #000; }
                        .metadata { font-size: 11pt; color: #555; }
                        @media print {
                            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                            @page { margin: 1cm; }
                        }
                    </style>
                </head>
                <body>
                    <div class="print-header">
                        <h1>${headerData?.title || fileName}</h1>
                        ${headerData?.course || headerData?.semester ? `
                        <div class="metadata">
                            ${headerData.course ? `<strong>Course:</strong> ${headerData.course}` : ''} 
                            ${headerData.course && headerData.semester ? '|' : ''}
                            ${headerData.semester ? `<strong>Semester:</strong> ${headerData.semester}` : ''}
                        </div>
                        ` : ''}
                    </div>
                    <div class="markdown-body">
                        ${element.innerHTML}
                    </div>
                </body>
                </html>
            `);
            iframeDoc.close();

            iframe.onload = () => {
                try {
                    iframe.contentWindow?.focus();
                    iframe.contentWindow?.print();
                } catch (e) {
                    console.error("Print failed:", e);
                } finally {
                    setTimeout(() => {
                        document.body.removeChild(iframe);
                        setExporting(false);
                    }, 1000);
                }
            };
        } catch (error) {
            console.error("Failed to generate PDF", error);
            toast.error("Failed to initialize print window.");
            setExporting(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={exporting}
            className={className}
        >
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {exporting ? "Generating..." : "Export as PDF"}
        </button>
    );
}
