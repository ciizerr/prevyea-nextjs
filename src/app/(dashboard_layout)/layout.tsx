"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Menu, Bell } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu when screen size increases
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 relative">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <Sidebar
                isOpen={isSidebarOpen}
                isMobileOpen={isMobileMenuOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                onMobileClose={() => setIsMobileMenuOpen(false)}
            />

            <div className={`transition-all duration-300 flex flex-col min-h-screen ${isSidebarOpen ? "md:pl-64" : "md:pl-20"}`}>
                {/* Mobile Header with Hamburger */}
                <div className="md:hidden sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white/70 dark:bg-black/60 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 -ml-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-50">PU Library</span>
                    </div>

                    {/* Mobile Header Actions */}
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 rounded-full transition-colors relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-black"></span>
                        </button>

                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
                            PU
                        </div>
                    </div>
                </div>

                <div className="hidden md:block">
                    <Header />
                </div>

                <main className="flex-1 p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
