import { ChevronRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import ClickSpark from "@/components/reactbits/ClickSpark";
import { auth } from "@/auth";
import Image from "next/image";

export default async function Navbar() {
    const session = await auth();

    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-black/60 border-b border-zinc-200/50 dark:border-zinc-800/50 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/40">
            <nav className="w-full relative z-10 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 md:h-20">
                        {/* Left: Brand */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-500 blur-md opacity-20 dark:opacity-40 group-hover:opacity-60 transition-opacity" />
                                <div className="relative transition-transform group-hover:scale-110 duration-500">
                                    <Image 
                                        src="/img-512x512.png" 
                                        alt="PU Library Logo" 
                                        width={36} 
                                        height={36} 
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="font-black text-lg tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">PU Library</span>
                                <span className="text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mt-1">Digital Archive</span>
                            </div>
                        </Link>

                        {/* Center: Navigation Links */}
                        <div className="hidden md:flex items-center gap-2">
                            <Link href="/vault" className="text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 px-5 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-all">
                                Archive
                            </Link>
                            <Link href="/syllabus" className="text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 px-5 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-all">
                                Syllabus
                            </Link>
                            <Link href="/notices" className="text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 px-5 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-all">
                                Notice
                            </Link>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-3">
                            <ClickSpark>
                                {session?.user ? (
                                    <Link href="/dashboard" className="group text-[11px] font-black uppercase tracking-widest bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 px-6 py-3 rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                                        <LayoutDashboard className="h-4 w-4" />
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link href="/login" className="group text-[11px] font-black uppercase tracking-widest bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 px-6 py-3 rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                                        Sign In
                                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                )}
                            </ClickSpark>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}
