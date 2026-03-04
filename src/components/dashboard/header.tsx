"use client";

import { Search, Bell, LogOut, Settings, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface HeaderProps {
    isMobile?: boolean;
}

export function Header({ isMobile = false }: HeaderProps) {
    const { data: session } = useSession();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const profileRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Get user initials for fallback avatar
    const getInitials = (name?: string | null) => {
        if (!name) return "U";
        return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    };

    const HeaderWrapper = isMobile ? 'div' : 'header';
    const headerClasses = isMobile
        ? "flex items-center gap-3 md:gap-4 relative"
        : "sticky top-0 z-30 flex items-center justify-between h-20 px-4 md:px-8 bg-white/70 dark:bg-black/60 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/40";

    return (
        <HeaderWrapper className={headerClasses}>
            {!isMobile && (
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
            )}

            <div className={`flex items-center relative ${isMobile ? "gap-2" : "gap-3 md:gap-4"}`}>

                {/* Notifications Dropdown */}
                <div ref={notificationsRef} className="relative">
                    <button
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className={`p-2 rounded-full transition-colors relative mr-2 ${isNotificationsOpen ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100' : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 '}`}
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-black"></span>
                    </button>

                    {isNotificationsOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                                <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Notifications</h3>
                                <button className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline">Mark all as read</button>
                            </div>
                            <div className="p-8 text-center flex flex-col items-center justify-center">
                                <div className="bg-zinc-100 dark:bg-zinc-900 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                                    <Bell className="h-5 w-5 text-zinc-400" />
                                </div>
                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">All caught up!</p>
                                <p className="text-xs text-zinc-500 mt-1">Check back later for new updates.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Dropdown */}
                <div ref={profileRef} className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2 focus:outline-none"
                    >
                        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 flex items-center justify-center font-bold text-sm shadow-sm transition-all overflow-hidden flex-shrink-0">
                            {session?.user?.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={session.user.image} alt="User Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                                <span className="text-zinc-600 dark:text-zinc-300">
                                    {getInitials(session?.user?.name)}
                                </span>
                            )}
                        </div>
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                                <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{session?.user?.name || "Guest User"}</p>
                                <p className="text-xs text-zinc-500 truncate mt-0.5">{session?.user?.email || "No email available"}</p>
                                <div className="mt-2 text-[10px] uppercase font-black tracking-wider text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30 inline-block px-2 py-0.5 rounded-md">
                                    {/* @ts-expect-error - NextAuth session typings */}
                                    {session?.user?.role || "USER"}
                                </div>
                            </div>

                            <div className="p-2 space-y-1">
                                <Link
                                    // @ts-expect-error - NextAuth session typings
                                    href={`/u/${session?.user?.username || ''}`}
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors"
                                >
                                    <User className="h-4 w-4" /> My Public Profile
                                </Link>
                                <Link
                                    href="/settings"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors"
                                >
                                    <Settings className="h-4 w-4" /> Settings
                                </Link>
                                <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1" />
                                <button
                                    onClick={() => signOut({ callbackUrl: "/login" })}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                                >
                                    <LogOut className="h-4 w-4" /> Sign out
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </HeaderWrapper>
    );
}
