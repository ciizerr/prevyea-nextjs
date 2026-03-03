"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, FolderOpen, BookOpen, Settings, Library, LogOut, LogIn, PanelLeftClose, PanelLeftOpen, X, Megaphone } from "lucide-react";

interface SidebarProps {
    isOpen: boolean;
    isMobileOpen: boolean;
    onToggle: () => void;
    onMobileClose: () => void;
}

export function Sidebar({ isOpen, isMobileOpen, onToggle, onMobileClose }: SidebarProps) {
    const pathname = usePathname();
    const { status } = useSession();
    const isLoggedIn = status === "authenticated";

    const allLinks = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard, public: false },
        { name: "The Vault (PYQs)", href: "/vault", icon: FolderOpen, public: true },
        { name: "Syllabus", href: "/syllabus", icon: BookOpen, public: true },
        { name: "Notice Board", href: "/notice", icon: Megaphone, public: true },
        { name: "Settings", href: "/settings", icon: Settings, public: false },
    ];

    const links = allLinks.filter((link) => isLoggedIn || link.public);

    return (
        <aside
            className={`fixed inset-y-0 left-0 bg-white/70 dark:bg-black/60 backdrop-blur-xl border-r border-zinc-200/50 dark:border-zinc-800/50 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/40 flex flex-col z-50 transition-all duration-300 ${isMobileOpen
                ? "w-72 translate-x-0" // Mobile open state (wider)
                : isOpen
                    ? "w-64 -translate-x-full md:translate-x-0"  // Desktop open state 
                    : "w-20 -translate-x-full md:translate-x-0"  // Desktop collapsed state
                }`}
        >
            <div className={`h-16 md:h-20 flex items-center border-b border-zinc-200/50 dark:border-zinc-800/50 shrink-0 transition-all duration-300 px-4 md:px-6 justify-between md:justify-start ${!isOpen && !isMobileOpen ? "md:px-0 md:justify-center" : ""}`}>
                <Link href="/" className="flex items-center justify-center gap-2.5 group hover:opacity-80 transition-opacity">
                    <div className="bg-blue-600 p-2 rounded-xl group-hover:bg-blue-500 transition-colors shrink-0">
                        <Library className="h-5 w-5 text-white" />
                    </div>
                    {(isOpen || isMobileOpen) && <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50 whitespace-nowrap overflow-hidden">PU Library</span>}
                </Link>

                {isMobileOpen && (
                    <button
                        onClick={onMobileClose}
                        className="md:hidden p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 rounded-xl"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            <div className={`flex-1 py-6 space-y-2 overflow-y-auto overflow-x-hidden ${isOpen || isMobileOpen ? "px-4" : "px-3"}`}>
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => {
                                if (isMobileOpen) onMobileClose();
                            }}
                            title={!isOpen && !isMobileOpen ? link.name : undefined}
                            className={`w-full flex items-center py-2.5 rounded-xl text-sm font-semibold transition-all group ${isOpen || isMobileOpen ? "px-3 gap-3" : "justify-center"
                                } ${isActive
                                    ? "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 shadow-sm"
                                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100"
                                }`}
                        >
                            <Icon className={`h-5 w-5 shrink-0 transition-colors ${isActive ? "text-blue-600 dark:text-blue-400" : "group-hover:text-blue-600 dark:group-hover:text-blue-400"}`} />
                            {(isOpen || isMobileOpen) && <span className="whitespace-nowrap overflow-hidden block">{link.name}</span>}
                        </Link>
                    )
                })}
            </div>

            <div className={`p-4 mt-auto border-t border-zinc-200/50 dark:border-zinc-800/50 shrink-0 flex flex-col gap-2 ${(!isOpen && !isMobileOpen) ? "items-center" : ""}`}>
                <button
                    onClick={onToggle}
                    title={!isOpen && !isMobileOpen ? "Expand Sidebar" : undefined}
                    className={`hidden md:flex items-center gap-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all ${isOpen ? "w-full px-3" : "justify-center w-12"
                        }`}
                >
                    {isOpen ? <PanelLeftClose className="h-5 w-5 shrink-0" /> : <PanelLeftOpen className="h-5 w-5 shrink-0" />}
                    {isOpen && <span>Collapse</span>}
                </button>

                {isLoggedIn ? (
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        title={!isOpen && !isMobileOpen ? "Logout" : undefined}
                        className={`flex items-center py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all ${isOpen || isMobileOpen ? "w-full px-3 gap-3" : "justify-center w-12"
                            }`}
                    >
                        <LogOut className="h-5 w-5 shrink-0" />
                        {(isOpen || isMobileOpen) && <span className="block">Logout</span>}
                    </button>
                ) : (
                    <Link
                        href="/login"
                        title={!isOpen && !isMobileOpen ? "Login" : undefined}
                        className={`flex items-center py-2.5 rounded-xl text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all ${isOpen || isMobileOpen ? "w-full px-3 gap-3" : "justify-center w-12"
                            }`}
                    >
                        <LogIn className="h-5 w-5 shrink-0" />
                        {(isOpen || isMobileOpen) && <span className="block">Login</span>}
                    </Link>
                )}
            </div>
        </aside>
    );
}

