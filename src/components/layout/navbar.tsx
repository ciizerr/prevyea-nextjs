import { Library } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import ClickSpark from "@/components/reactbits/ClickSpark";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-[#0a0a0a]/80 border-b border-zinc-200/50 dark:border-zinc-800/50">
            <nav className="w-full relative z-10 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Left */}
                        <div className="flex items-center gap-2">
                            <Library className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                            <span className="font-bold text-xl tracking-tight">PU Digital Library</span>
                        </div>

                        {/* Center */}
                        <div className="hidden md:flex items-center gap-8">
                            <ClickSpark className="relative inline-flex"><Link href="#" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">Browse</Link></ClickSpark>
                            <ClickSpark className="relative inline-flex"><Link href="#" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">Syllabus</Link></ClickSpark>
                            <ClickSpark className="relative inline-flex"><Link href="#" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">Contribute</Link></ClickSpark>
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-4">
                            <ClickSpark className="relative inline-flex"><ThemeToggle /></ClickSpark>
                            <div className="hidden sm:flex items-center gap-3">
                                <ClickSpark className="relative inline-flex"><Link href="#" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">Log In</Link></ClickSpark>
                                <ClickSpark className="relative inline-flex"><Link href="#" className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors">Sign Up</Link></ClickSpark>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}
