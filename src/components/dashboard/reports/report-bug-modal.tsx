"use client";

import { useState } from "react";
import { X, Bug, Loader2 } from "lucide-react";
import { createReportAction } from "@/actions/reports";

interface ReportBugModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ReportBugModal({ isOpen, onClose }: ReportBugModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await createReportAction(title, description);
            if (res.success) {
                alert("Bug report submitted successfully! Thank you for your help.");
                setTitle("");
                setDescription("");
                onClose();
            } else {
                alert(res.error || "Failed to submit report");
            }
        } catch {
            alert("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                        <Bug className="h-5 w-5 text-indigo-500" />
                        Report an Issue
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                Issue Title
                            </label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Short summary of the issue..."
                                className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-zinc-900 dark:text-zinc-100"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                Details & Steps to Reproduce
                            </label>
                            <textarea
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe what happened, what you expected, and how we can reproduce it."
                                className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-zinc-900 dark:text-zinc-100 min-h-[120px] resize-y"
                            />
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="px-5 py-2.5 rounded-xl font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-5 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all flex items-center justify-center gap-2 min-w-[120px] disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Report"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
