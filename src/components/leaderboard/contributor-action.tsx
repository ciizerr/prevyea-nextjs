"use client";

import { useState } from "react";
import { UploadModal } from "@/components/dashboard/upload-modal";

export function ContributorAction() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl text-sm font-black transition-transform active:scale-95 shadow-xl cursor-pointer"
            >
                Become a Contributor
            </button>

            <UploadModal 
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}
