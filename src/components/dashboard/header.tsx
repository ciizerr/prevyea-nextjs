import { Search, Bell } from "lucide-react";

export function Header() {
    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-4 md:px-8 bg-white/70 dark:bg-black/60 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/40">
            <div className="flex items-center gap-4">
                {/* Search - inspired by Hero component */}
                <div className="hidden md:flex items-center bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-full px-4 py-2 focus-within:border-zinc-400 dark:focus-within:border-zinc-600 transition-colors shadow-sm">
                    <Search className="h-4 w-4 text-zinc-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search for PYQs, syllabus..."
                        className="bg-transparent border-none outline-none text-sm w-64 lg:w-80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500"
                    />
                    <div className="flex items-center gap-1 opacity-60 ml-2">
                        <kbd className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 rounded text-zinc-500 dark:text-zinc-400">⌘K</kbd>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
                <button className="p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 rounded-full transition-colors relative mr-2">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-black"></span>
                </button>

                {/* User Avatar Skeleton */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
                    PU
                </div>
            </div>
        </header>
    );
}
