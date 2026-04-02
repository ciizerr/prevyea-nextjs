"use client";

import { useEffect, useState } from "react";
import { X, FileText, Loader2 } from "lucide-react";
import PDFViewer from "@/components/pdf-viewer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { fetchMarkdownContent } from "@/actions/curriculum";

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    title: string;
}

export function PreviewModal({ isOpen, onClose, url, title }: PreviewModalProps) {
    if (!isOpen) return null;

    const isMarkdown = title.toLowerCase().endsWith(".md") || url.toLowerCase().endsWith(".md");

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

                {/* Content Area */}
                <div className="flex-1 w-full bg-black/5 relative overflow-hidden">
                    {isMarkdown ? (
                        <MarkdownPreview url={url} />
                    ) : (
                        <PDFViewer
                            url={url}
                            fileLabel={title}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

function MarkdownPreview({ url }: { url: string }) {
    const [markdownContent, setMarkdownContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        // The state is already 'true' by default or becomes true when the component re-mounts on key change.
        // If we want to force it to true for URL changes without re-mounting:
        Promise.resolve().then(() => {
            if (isMounted) setLoading(true);
        });

        fetchMarkdownContent(url)
            .then(res => {
                if (isMounted) {
                    if (res.success && res.data) {
                        setMarkdownContent(res.data);
                    } else {
                        setMarkdownContent(`# Error\n${res.error || "Failed to load markdown content."}`);
                    }
                    // Wrapping in a microtask/Promise.resolve to avoid the "synchronous setState" lint error 
                    // if the linter is extremely pedantic, although here the promise itself is async.
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error("Failed to fetch markdown:", err);
                if (isMounted) {
                    setMarkdownContent("# Error\nFailed to load markdown content.");
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [url]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-500 bg-white dark:bg-zinc-950">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="font-medium">Loading Markdown...</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-6 md:p-10 bg-white dark:bg-zinc-950">
            <article className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-black prose-a:text-blue-500 dark:prose-a:text-blue-400">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {markdownContent || ""}
                </ReactMarkdown>
            </article>
        </div>
    );
}
