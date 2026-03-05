"use client";

import { useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmDeleteButtonProps {
    label: string;           // what is being deleted e.g. "Panjab University"
    entityType: string;      // e.g. "College", "Course"
    warning?: string;        // optional extra warning text
    action: () => Promise<unknown>;
    iconSize?: "sm" | "md";
}

export function ConfirmDeleteButton({ label, entityType, warning, action, iconSize = "sm" }: ConfirmDeleteButtonProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleConfirm = () => {
        startTransition(async () => {
            await action();
            setOpen(false);
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                title={`Delete ${entityType}`}
                className={`text-zinc-400 hover:text-red-500 transition-colors ${iconSize === "md" ? "absolute top-2 right-2" : ""}`}
            >
                <Trash2 className={iconSize === "sm" ? "h-3 w-3" : "h-4 w-4"} />
            </button>

            {open && createPortal(
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-in zoom-in-95 duration-150">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-red-100 dark:bg-red-500/10 rounded-xl text-red-600 dark:text-red-400 shrink-0">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Delete {entityType}?</h3>
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">You are about to delete:</p>
                        <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-4 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-lg">
                            {label}
                        </p>
                        {warning && (
                            <p className="text-xs text-red-600 dark:text-red-400 mb-4">{warning}</p>
                        )}
                        <p className="text-xs text-zinc-400 mb-5">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setOpen(false)}
                                disabled={isPending}
                                className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isPending}
                                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-sm font-bold text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
