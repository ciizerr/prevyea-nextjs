"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareProfileProps {
    username: string;
    variant?: "default" | "minimal";
}

export default function ShareProfile({ username, variant = "default" }: ShareProfileProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = typeof window !== "undefined" ? `${window.location.origin}/u/${username}` : "";
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success("Profile link copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
            toast.error("Failed to copy link");
        }
    };

    if (variant === "minimal") {
        return (
            <button
                onClick={handleShare}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 text-zinc-600 dark:text-zinc-400"
            >
                {copied ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                    <Share2 className="w-3 h-3" />
                )}
                <span>{copied ? "Copied" : "Share"}</span>
            </button>
        );
    }

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-2.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-95 group"
        >
            {copied ? (
                <Check className="w-4 h-4" />
            ) : (
                <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            )}
            <span>{copied ? "Copied!" : "Share Profile"}</span>
        </button>
    );
}
