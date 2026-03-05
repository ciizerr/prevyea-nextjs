"use client";

import { Search, Bell, LogOut, Settings, User, Loader2, CheckCheck, LogIn } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getNotificationsAction, markAsReadAction, markAllAsReadAction } from "@/actions/notifications";

interface HeaderProps {
    isMobile?: boolean;
}

interface NotificationItem {
    id: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: Date;
    link: string | null;
}

export function Header({ isMobile = false }: HeaderProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const isLoggedIn = status === "authenticated";
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loadingNotifications, setLoadingNotifications] = useState(true);

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
    }, []);

    const fetchNotifications = async () => {
        setLoadingNotifications(true);
        const res = await getNotificationsAction();
        if (res.success && res.data) {
            // @ts-expect-error - Date vs string typing difference
            setNotifications(res.data);
        }
        setLoadingNotifications(false);
    };

    useEffect(() => {
        let isMounted = true;
        if (isLoggedIn) {
            getNotificationsAction().then(res => {
                if (isMounted && res.success && res.data) {
                    // @ts-expect-error - Date vs string typing difference
                    setNotifications(res.data);
                }
                if (isMounted) setLoadingNotifications(false);
            });
        }
        return () => { isMounted = false; };
    }, [isLoggedIn]);

    const handleMarkAsRead = async (id: string, currentReadState: boolean) => {
        if (currentReadState) return;
        const res = await markAsReadAction(id);
        if (res.success) {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        }
    };

    const handleMarkAllAsRead = async () => {
        const res = await markAllAsReadAction();
        if (res.success) {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

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
                    {/* Search - same logic as Hero component */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const sq = searchQuery.trim();
                            if (sq) {
                                if (sq.toLowerCase().includes("syllabus")) {
                                    router.push(`/syllabus?search=${encodeURIComponent(sq)}`);
                                } else {
                                    router.push(`/vault?search=${encodeURIComponent(sq)}`);
                                }
                            }
                        }}
                        className="hidden md:flex items-center bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-full px-4 py-2 focus-within:border-zinc-400 dark:focus-within:border-zinc-600 transition-colors shadow-sm"
                    >
                        <Search className="h-4 w-4 text-zinc-400 mr-2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for PYQs, syllabus..."
                            className="bg-transparent border-none outline-none text-sm w-64 lg:w-80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500"
                            autoComplete="off"
                            spellCheck={false}
                        />
                        <div className="flex items-center gap-1 opacity-60 ml-2">
                            <kbd className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 rounded text-zinc-500 dark:text-zinc-400">Enter ↵</kbd>
                        </div>
                    </form>
                </div>
            )}

            <div className={`flex items-center relative ${isMobile ? "gap-2" : "gap-3 md:gap-4"}`}>

                {isLoggedIn ? (
                    <>
                        {/* Notifications Dropdown */}
                        <div ref={notificationsRef} className="relative">
                            <button
                                onClick={() => {
                                    const newState = !isNotificationsOpen;
                                    setIsNotificationsOpen(newState);
                                    if (newState && isLoggedIn) fetchNotifications();
                                }}
                                className={`p-2 rounded-full transition-colors relative mr-2 ${isNotificationsOpen ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100' : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 '}`}
                            >
                                <Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-black"></span>
                                )}
                            </button>

                            {isNotificationsOpen && (
                                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                                    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
                                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                            Notifications
                                            {unreadCount > 0 && (
                                                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </h3>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={handleMarkAllAsRead}
                                                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline py-1 px-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                    </div>

                                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                                        {loadingNotifications ? (
                                            <div className="p-8 flex flex-col items-center justify-center">
                                                <Loader2 className="h-6 w-6 animate-spin text-zinc-400 mb-2" />
                                                <p className="text-sm text-zinc-500">Loading notifications...</p>
                                            </div>
                                        ) : notifications.length === 0 ? (
                                            <div className="p-8 text-center flex flex-col items-center justify-center">
                                                <div className="bg-zinc-100 dark:bg-zinc-900 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                                                    <Bell className="h-5 w-5 text-zinc-400" />
                                                </div>
                                                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">All caught up!</p>
                                                <p className="text-xs text-zinc-500 mt-1">Check back later for new updates.</p>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                                                {notifications.map(notification => (
                                                    <div
                                                        key={notification.id}
                                                        onClick={() => handleMarkAsRead(notification.id, notification.read)}
                                                        className={`p-4 transition-colors cursor-pointer relative group ${notification.read ? "bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/30" : "bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-900/30"}`}
                                                    >
                                                        {!notification.read && (
                                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                                                        )}
                                                        <div className="flex justify-between items-start mb-1">
                                                            <h4 className={`text-sm ${notification.read ? "font-semibold text-zinc-800 dark:text-zinc-200" : "font-bold text-zinc-900 dark:text-zinc-100"}`}>
                                                                {notification.title}
                                                            </h4>
                                                        </div>
                                                        <p className={`text-xs ${notification.read ? "text-zinc-500" : "text-zinc-600 dark:text-zinc-300"} line-clamp-2 leading-relaxed`}>
                                                            {notification.message}
                                                        </p>
                                                        <div className="mt-2 flex items-center justify-between">
                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                                                {new Date(notification.createdAt).toLocaleDateString()}
                                                            </span>
                                                            {!notification.read && (
                                                                <CheckCheck className="h-3.5 w-3.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
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
                    </>
                ) : (
                    /* Sign In button for unauthenticated users */
                    <Link
                        href="/login"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors shadow-sm"
                    >
                        <LogIn className="h-4 w-4" />
                        Sign In
                    </Link>
                )}

            </div>
        </HeaderWrapper>
    );
}
