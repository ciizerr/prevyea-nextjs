import { Library, ChevronRight } from "lucide-react";
import Link from "next/link";
import ClickSpark from "@/components/reactbits/ClickSpark";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-black/60 border-b border-zinc-200/50 dark:border-zinc-800/50 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/40">
            <nav className="w-full relative z-10 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 md:h-20">
                        {/* Left: Brand */}
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="bg-blue-600 p-2 rounded-xl group-hover:bg-blue-500 transition-colors">
                                <Library className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50">PU Digital Library</span>
                        </Link>

                        {/* Center: Navigation Links */}
                        <div className="hidden md:flex items-center gap-1">
                            <Link href="/vault" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 px-4 py-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all">
                                Browse
                            </Link>
                            <Link href="/syllabus" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 px-4 py-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all">
                                Syllabus
                            </Link>
                            <Link href="/vault" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 px-4 py-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all">
                                Contribute
                            </Link>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-3 md:gap-4">

                            <div className="flex items-center gap-2">
                                <ClickSpark className="relative inline-flex">
                                    <Link href="/login" className="group text-sm font-bold bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 px-5 py-2.5 rounded-full shadow-lg transition-all flex items-center gap-1.5">
                                        Sign In
                                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                </ClickSpark>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}
