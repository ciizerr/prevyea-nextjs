"use client";

import { useState } from "react";
import { X, Loader2, Send, Eye, PenLine, Clock } from "lucide-react";
import { createNoticeAction, updateNoticeAction } from "@/actions/notice";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface NoticeData {
    id: string;
    title: string;
    content: string;
    type: string;
    expiresAt: Date | null;
}

interface NoticeFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editData?: NoticeData; // if provided, switches to edit mode
}

export function NoticeFormModal({ isOpen, onClose, onSuccess, editData }: NoticeFormModalProps) {
    const isEditing = !!editData;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tab, setTab] = useState<"write" | "preview">("write");
    const [content, setContent] = useState(editData?.content ?? "");

    if (!isOpen) return null;

    // Format Date for the datetime-local input
    const formatDateForInput = (d: Date | null | undefined) => {
        if (!d) return "";
        const dt = new Date(d);
        if (isNaN(dt.getTime())) return "";
        // datetime-local expects "YYYY-MM-DDTHH:MM"
        return dt.toISOString().slice(0, 16);
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        // Override content with controlled state (for markdown editor)
        formData.set("content", content);

        const action = isEditing ? updateNoticeAction : createNoticeAction;
        const res = await action(formData);

        if (res.success) {
            onSuccess();
            onClose();
        } else {
            setError(res.error || "An error occurred.");
        }
        setLoading(false);
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
            <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white dark:bg-zinc-950 w-full max-w-2xl rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800/60 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                            {isEditing ? "Edit Notice" : "Post New Notice"}
                        </h2>
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">
                            {isEditing ? "Update this announcement." : "Broadcast an announcement to all students."}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                        disabled={loading}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form id="notice-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
                    {isEditing && <input type="hidden" name="id" value={editData.id} />}

                    {error && (
                        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2 sm:col-span-2">
                            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="title"
                                defaultValue={editData?.title ?? ""}
                                placeholder="e.g. Mid-Semester Examinations Schedule"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Category <span className="text-red-500">*</span></label>
                            <select
                                name="type"
                                defaultValue={editData?.type ?? ""}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium appearance-none"
                            >
                                <option value="">Select Category...</option>
                                <option value="General">General Announcement</option>
                                <option value="Exam">Examination</option>
                                <option value="Event">Event</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" /> Expires On <span className="text-zinc-400 font-medium">(optional)</span>
                            </label>
                            <input
                                type="datetime-local"
                                name="expiresAt"
                                defaultValue={formatDateForInput(editData?.expiresAt ?? null)}
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Markdown Editor with Preview */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Content <span className="text-red-500">*</span></label>
                            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg text-xs font-bold">
                                <button
                                    type="button"
                                    onClick={() => setTab("write")}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${tab === "write" ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
                                >
                                    <PenLine className="w-3.5 h-3.5" /> Write
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTab("preview")}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${tab === "preview" ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
                                >
                                    <Eye className="w-3.5 h-3.5" /> Preview
                                </button>
                            </div>
                        </div>

                        {tab === "write" ? (
                            <textarea
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder="Write your notice content here. **Markdown** is _supported_."
                                required={content.trim().length === 0}
                                rows={10}
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-mono text-sm resize-none"
                            />
                        ) : (
                            <div className="min-h-[200px] px-5 py-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto prose prose-zinc dark:prose-invert prose-sm max-w-none">
                                {content.trim() ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                                ) : (
                                    <p className="text-zinc-400 italic text-sm">Nothing to preview yet...</p>
                                )}
                            </div>
                        )}
                        <p className="text-xs text-zinc-400 font-medium">Supports GitHub-Flavored Markdown: **bold**, *italic*, `code`, headers, tables, and more.</p>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-6 border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/20 flex gap-3 justify-end shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-5 py-2.5 rounded-xl font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="notice-form"
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                        {loading ? (isEditing ? "Saving..." : "Publishing...") : (isEditing ? "Save Changes" : "Publish Notice")}
                    </button>
                </div>
            </div>
        </div>
    );
}
