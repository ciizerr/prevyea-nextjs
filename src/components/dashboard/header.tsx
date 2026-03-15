"use client";

import { Search, Bell, LogOut, Settings, User, Loader2, CheckCheck, LogIn, Command, Sparkles } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SettingsSubNav } from "@/components/settings/sub-nav";
import Link from "next/link";
import { getNotificationsAction, markAsReadAction, markAllAsReadAction, clearNotificationsAction } from "@/actions/notifications";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

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
    const pathname = usePathname();

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
        return () => document.removeEventListener("mousedown", handleClickOutside);
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

    const handleNotificationClick = async (notification: NotificationItem) => {
        if (!notification.read) {
            await handleMarkAsRead(notification.id, false);
        }
        if (notification.link) {
            setIsNotificationsOpen(false);
            router.push(notification.link);
        }
    };

    const handleMarkAllAsRead = async () => {
        const res = await markAllAsReadAction();
        if (res.success) {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }
    };

    const handleClearNotifications = async () => {
        const res = await clearNotificationsAction();
        if (res.success) {
            setNotifications([]);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const getInitials = (name?: string | null) => {
        if (!name) return "U";
        return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    };

    const HeaderWrapper = isMobile ? 'div' : 'header';
    const headerClasses = isMobile
        ? "flex items-center gap-3 relative"
        : "sticky top-0 z-40 flex items-center justify-between h-20 px-6 md:px-10 bg-white/70 dark:bg-zinc-950/60 backdrop-blur-2xl border-b border-zinc-200/50 dark:border-zinc-800/50";

    return (
        <HeaderWrapper className={headerClasses}>
            {!isMobile && (
                <div className="flex items-center gap-6">
                    {pathname === "/settings" ? (
                        <SettingsSubNav />
                    ) : (
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
                            className="relative group hidden lg:flex items-center"
                        >
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for subjects, PYQs..."
                                className="w-80 xl:w-[450px] pl-12 pr-16 py-2.5 rounded-2xl bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-zinc-900 transition-all outline-none"
                                autoComplete="off"
                            />
                            <div className="absolute right-3 flex items-center gap-1 pointer-events-none">
                                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-[10px] font-black text-zinc-400">
                                    <Command className="w-3 h-3" /> K
                                </kbd>
                            </div>
                        </form>
                    )}
                </div>
            )}

            <div className={`flex items-center relative ${isMobile ? "gap-2" : "gap-4 md:gap-6"}`}>
                
                {isLoggedIn ? (
                    <>
                        {/* Notifications Module */}
                        <div ref={notificationsRef} className="relative">
                            <button
                                onClick={() => {
                                    const newState = !isNotificationsOpen;
                                    setIsNotificationsOpen(newState);
                                    if (newState && isLoggedIn) fetchNotifications();
                                }}
                                className={`group p-2.5 rounded-2xl transition-all relative ${
                                    isNotificationsOpen 
                                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 shadow-lg shadow-indigo-500/10' 
                                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent'
                                }`}
                            >
                                <Bell className={`h-5 w-5 ${unreadCount > 0 && !isNotificationsOpen ? 'animate-bounce' : ''}`} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-zinc-950 shadow-sm" />
                                )}
                            </button>

                            {isNotificationsOpen && (
                                <div className="absolute right-0 mt-4 w-80 sm:w-[420px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-none overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                                    <div className="p-6 border-b border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h3 className="font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                                Notifications
                                                {unreadCount > 0 && (
                                                    <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] rounded-full font-black">
                                                        {unreadCount} NEW
                                                    </span>
                                                )}
                                            </h3>
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Your recent updates</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={handleMarkAllAsRead}
                                                    className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 px-3 py-1.5 rounded-xl transition-all"
                                                >
                                                    Mark all read
                                                </button>
                                            )}
                                            {notifications.length > 0 && (
                                                <button
                                                    onClick={handleClearNotifications}
                                                    className="text-[10px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 px-3 py-1.5 rounded-xl transition-all"
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="max-h-[400px] overflow-y-auto scrollbar-hide py-2">
                                        {loadingNotifications ? (
                                            <div className="p-12 flex flex-col items-center justify-center gap-4">
                                                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Loading notifications</p>
                                            </div>
                                        ) : notifications.length === 0 ? (
                                            <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
                                                <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-[1.5rem] flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
                                                    <Bell className="h-7 w-7 text-zinc-300" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-black text-zinc-900 dark:text-zinc-100">All caught up</p>
                                                    <p className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">No new alerts</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="px-3 space-y-1">
                                                {notifications.map(notification => (
                                                    <div
                                                        key={notification.id}
                                                        onClick={() => handleNotificationClick(notification)}
                                                        className={`p-4 rounded-2xl transition-all cursor-pointer relative group flex gap-4 ${
                                                            notification.read 
                                                            ? "bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/40" 
                                                            : "bg-indigo-50/30 dark:bg-indigo-500/5 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 border border-indigo-100/30 dark:border-indigo-500/10"
                                                        }`}
                                                    >
                                                        <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${notification.read ? 'bg-zinc-200 dark:bg-zinc-800' : 'bg-indigo-500 shadow-lg shadow-indigo-500/50'}`} />
                                                        <div className="flex-1 min-w-0 space-y-1">
                                                            <h4 className={`text-sm tracking-tight ${notification.read ? "font-bold text-zinc-600 dark:text-zinc-400" : "font-black text-zinc-900 dark:text-zinc-100"}`}>
                                                                {notification.title}
                                                            </h4>
                                                            <p className={`text-xs ${notification.read ? "text-zinc-400" : "text-zinc-600 dark:text-zinc-400"} line-clamp-2 leading-relaxed font-medium`}>
                                                                {notification.message}
                                                            </p>
                                                            <div className="pt-2 flex items-center justify-between">
                                                                <span className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-400 italic">
                                                                    {dayjs(notification.createdAt).fromNow()}
                                                                </span>
                                                                {!notification.read && (
                                                                    <CheckCheck className="h-3.5 w-3.5 text-indigo-500 opacity-60" />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <Link href="/settings?tab=notifications" onClick={() => setIsNotificationsOpen(false)} className="block p-4 bg-zinc-50 dark:bg-zinc-900/50 text-center text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-indigo-600 transition-colors">
                                        Notification Preferences
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Profile Module */}
                        <div ref={profileRef} className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="group flex items-center gap-3 p-1 rounded-2xl transition-all active:scale-95"
                            >
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-2xl bg-zinc-900 dark:bg-white flex items-center justify-center font-black text-white dark:text-zinc-950 shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
                                        {session?.user?.image ? (
                                            <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                        ) : (
                                            <span className="text-xs">{getInitials(session?.user?.name)}</span>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-zinc-950 rounded-full shadow-sm" />
                                </div>
                                <div className="hidden xl:block text-left">
                                    <p className="text-xs font-black text-zinc-900 dark:text-zinc-100 tracking-tight leading-none mb-0.5">{session?.user?.name?.split(' ')[0]}</p>
                                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest opacity-70">
                                        {/* @ts-expect-error - NextAuth session typings */}
                                        {session?.user?.role || "USER"}
                                    </p>
                                </div>
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-4 w-72 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-none overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                                    <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center text-center gap-3 relative">
                                        <div className="absolute top-4 right-4">
                                            <Sparkles className="w-4 h-4 text-amber-500 opacity-50" />
                                        </div>
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-zinc-800 border-4 border-white dark:border-zinc-800 shadow-2xl flex items-center justify-center overflow-hidden">
                                            {session?.user?.image ? (
                                                <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-lg font-black">{getInitials(session?.user?.name)}</span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-black text-zinc-900 dark:text-zinc-100 truncate text-base">{session?.user?.name}</p>
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest truncate">{session?.user?.email}</p>
                                        </div>
                                    </div>

                                    <div className="p-3 space-y-1">
                                        <Link
                                            // @ts-expect-error - NextAuth session typings
                                            href={`/u/${session?.user?.username || ''}`}
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-4 px-5 py-3 text-xs font-black text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-500/10 rounded-2xl transition-all uppercase tracking-widest group"
                                        >
                                            <div className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                <User className="h-4 w-4" />
                                            </div>
                                            My Profile
                                        </Link>
                                        <Link
                                            href="/settings"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-4 px-5 py-3 text-xs font-black text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-500/10 rounded-2xl transition-all uppercase tracking-widest group"
                                        >
                                            <div className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                <Settings className="h-4 w-4" />
                                            </div>
                                            Settings
                                        </Link>
                                        
                                        <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-2 mx-4" />
                                        
                                        <button
                                            onClick={() => signOut({ callbackUrl: "/login" })}
                                            className="w-full flex items-center gap-4 px-5 py-3 text-xs font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-2xl transition-all uppercase tracking-widest group"
                                        >
                                            <div className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                <LogOut className="h-4 w-4" />
                                            </div>
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <Link
                        href="/login"
                        className="flex items-center gap-3 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all"
                    >
                        <LogIn className="h-4 w-4" />
                        Sign In
                    </Link>
                )}
            </div>
        </HeaderWrapper>
    );
}
