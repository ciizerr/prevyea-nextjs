import { Library } from "lucide-react";
import Link from "next/link";
import ClickSpark from "@/components/reactbits/ClickSpark";

export default function Footer() {
    return (
        <footer className="w-full border-t border-zinc-200/50 dark:border-zinc-800/50 py-12 bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-6">
                <div className="flex items-center gap-2 text-zinc-400">
                    <Library className="h-5 w-5" />
                    <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-100">PU Digital Library</span>
                </div>

                <div className="flex gap-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    <ClickSpark className="relative inline-flex"><Link href="#" className="hover:text-zinc-900 dark:text-zinc-100 transition-colors">About</Link></ClickSpark>
                    <ClickSpark className="relative inline-flex"><Link href="#" className="hover:text-zinc-900 dark:text-zinc-100 transition-colors">Contact</Link></ClickSpark>
                    <ClickSpark className="relative inline-flex"><Link href="#" className="hover:text-zinc-900 dark:text-zinc-100 transition-colors">Report an Issue</Link></ClickSpark>
                </div>

                <p className="text-xs text-zinc-400 dark:text-zinc-600 max-w-sm">
                    Disclaimer: This platform is a student-led initiative and is not officially affiliated with Patna University.
                </p>

                <div className="text-sm text-zinc-400 dark:text-zinc-600">
                    © {new Date().getFullYear()} PU Digital Library. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
