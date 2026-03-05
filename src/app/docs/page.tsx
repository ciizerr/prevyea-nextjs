"use client";

import { FileText, Shield, AlertTriangle, ChevronLeft, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

/* ──────────────────────────────────────────────
   Docs data – easy to extend with new sections
   ────────────────────────────────────────────── */
const sections = [
    {
        id: "terms",
        title: "Terms of Service",
        icon: FileText,
        color: {
            bg: "bg-blue-100 dark:bg-blue-900/30",
            text: "text-blue-600 dark:text-blue-400",
            indicator: "bg-blue-600 dark:bg-blue-400",
        },
        content: (
            <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400">
                <p>
                    Welcome to PU Digital Library. By accessing or using our platform,
                    you agree to comply with and be bound by these terms.
                </p>
                <h3>1. Educational Purpose</h3>
                <p>
                    This platform is exclusively built for the students of Patna
                    University to share knowledge and educational resources.
                    Commercial use of materials found here is strictly
                    prohibited.
                </p>
                <h3>2. User Contributions</h3>
                <p>
                    When you upload a Document (PYQ, Notes, or Syllabus), you
                    affirm that you have the right to share it. Do not upload
                    copyrighted books or premium content that violate
                    intellectual property rights.
                </p>
                <h3>3. Moderation</h3>
                <p>
                    All uploads are subject to review. We reserve the right to
                    remove any content at our sole discretion if it violates our
                    guidelines or contains inappropriate material.
                </p>
            </div>
        ),
    },
    {
        id: "privacy",
        title: "Privacy Policy",
        icon: Shield,
        color: {
            bg: "bg-emerald-100 dark:bg-emerald-900/30",
            text: "text-emerald-600 dark:text-emerald-400",
            indicator: "bg-emerald-600 dark:bg-emerald-400",
        },
        content: (
            <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400">
                <p>
                    We believe in maintaining your privacy while you study.
                </p>
                <h3>Data We Collect</h3>
                <p>
                    When you sign in using Google or GitHub, we only store basic
                    profile information such as your name, email, and a link to
                    your avatar. If you define your college or course, we link it
                    to your profile to offer a customized local feed.
                </p>
                <h3>How We Use Your Data</h3>
                <p>
                    We utilize your data strictly to manage your sessions, track
                    upload metrics for the leaderboard, and personalize your
                    curriculum feeds. We <strong>never</strong> sell or
                    distribute your data to third parties.
                </p>
                <h3>Cookies</h3>
                <p>
                    We use essential cookies to maintain your login session. No
                    aggressive third-party marketing trackers are employed.
                </p>
            </div>
        ),
    },
    {
        id: "disclaimer",
        title: "Disclaimer",
        icon: AlertTriangle,
        color: {
            bg: "bg-amber-100 dark:bg-amber-900/30",
            text: "text-amber-600 dark:text-amber-400",
            indicator: "bg-amber-600 dark:bg-amber-400",
        },
        content: (
            <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400">
                <p>
                    PU Digital Library is an independent, student-led initiative.{" "}
                    <strong>
                        We are not officially affiliated with, endorsed by, or
                        representing Patna University or any of its constituent
                        colleges.
                    </strong>
                </p>
                <p>
                    The materials provided here are crowdsourced. While our
                    moderators review uploads for relevance, we do not guarantee
                    the 100% accuracy of notes or syllabi. Please cross-verify
                    critical information (like exam dates and official syllabi)
                    with official university channels.
                </p>
            </div>
        ),
    },
];

/* ──────────────────────────────────────────────
   Component
   ────────────────────────────────────────────── */
export default function DocsPage() {
    const [activeId, setActiveId] = useState(sections[0].id);
    const [mobileOpen, setMobileOpen] = useState(false);

    /* Sync active topic with URL hash on mount & hash-change */
    const syncHash = useCallback(() => {
        const hash = window.location.hash.replace("#", "");
        if (hash && sections.some((s) => s.id === hash)) {
            setActiveId(hash);
        }
    }, []);

    useEffect(() => {
        syncHash();
        window.addEventListener("hashchange", syncHash);
        return () => window.removeEventListener("hashchange", syncHash);
    }, [syncHash]);

    /* Update URL hash when active topic changes */
    const navigate = (id: string) => {
        setActiveId(id);
        window.history.replaceState(null, "", `#${id}`);
        setMobileOpen(false);
    };

    const activeSection = sections.find((s) => s.id === activeId)!;
    const Icon = activeSection.icon;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 selection:bg-zinc-800 selection:text-white">
            <div className="flex min-h-screen">
                {/* ─── SIDEBAR (desktop) ─── */}
                <aside className="hidden md:flex w-72 shrink-0 flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-sm sticky top-0 h-screen">
                    {/* Sidebar header */}
                    <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                        <Link
                            href="/"
                            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mb-4"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Back to Home
                        </Link>
                        <h1 className="text-xl font-extrabold tracking-tight">
                            Legal &amp; Info
                        </h1>
                        <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                            Rules, privacy &amp; procedures
                        </p>
                    </div>

                    {/* Sidebar nav */}
                    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                        {sections.map((section) => {
                            const SectionIcon = section.icon;
                            const isActive = section.id === activeId;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => navigate(section.id)}
                                    className={`
                                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                                        transition-all duration-200 cursor-pointer
                                        ${isActive
                                            ? `${section.color.bg} ${section.color.text} shadow-sm`
                                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-200"
                                        }
                                    `}
                                >
                                    <SectionIcon className="h-4 w-4 shrink-0" />
                                    {section.title}
                                    {isActive && (
                                        <span
                                            className={`ml-auto h-1.5 w-1.5 rounded-full ${section.color.indicator}`}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Sidebar footer */}
                    <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-400 dark:text-zinc-600">
                        © {new Date().getFullYear()} PU Digital Library
                    </div>
                </aside>

                {/* ─── MOBILE SIDEBAR OVERLAY ─── */}
                {mobileOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                        onClick={() => setMobileOpen(false)}
                    >
                        <aside
                            className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col animate-in slide-in-from-left duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Mobile sidebar header */}
                            <div className="p-5 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
                                <h2 className="text-lg font-extrabold tracking-tight">
                                    Docs
                                </h2>
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Mobile sidebar nav */}
                            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                                {sections.map((section) => {
                                    const SectionIcon = section.icon;
                                    const isActive = section.id === activeId;
                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => navigate(section.id)}
                                            className={`
                                                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                                                transition-all duration-200 cursor-pointer
                                                ${isActive
                                                    ? `${section.color.bg} ${section.color.text} shadow-sm`
                                                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                                                }
                                            `}
                                        >
                                            <SectionIcon className="h-4 w-4 shrink-0" />
                                            {section.title}
                                        </button>
                                    );
                                })}
                            </nav>
                        </aside>
                    </div>
                )}

                {/* ─── MAIN CONTENT ─── */}
                <main className="flex-1 min-w-0">
                    {/* Mobile top bar */}
                    <div className="md:hidden sticky top-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center gap-3">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <Link
                            href="/"
                            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                        >
                            <ChevronLeft className="h-3 w-3" /> Home
                        </Link>
                        <span className="ml-auto text-xs text-zinc-500 truncate">
                            {activeSection.title}
                        </span>
                    </div>

                    {/* Content area */}
                    <div className="max-w-3xl mx-auto px-6 sm:px-10 py-12 md:py-20">
                        {/* Section header */}
                        <div className="flex items-center gap-4 mb-8">
                            <div
                                className={`p-2.5 rounded-xl ${activeSection.color.bg} ${activeSection.color.text}`}
                            >
                                <Icon className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                                    {activeSection.title}
                                </h1>
                                <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-0.5">
                                    Last updated · March 2026
                                </p>
                            </div>
                        </div>

                        {/* Divider */}
                        <hr className="border-zinc-200 dark:border-zinc-800 mb-8" />

                        {/* Section content */}
                        <article className="animate-in fade-in duration-300">
                            {activeSection.content}
                        </article>

                        {/* Bottom nav */}
                        <div className="mt-16 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-6">
                            {(() => {
                                const idx = sections.findIndex(
                                    (s) => s.id === activeId
                                );
                                const prev = idx > 0 ? sections[idx - 1] : null;
                                const next =
                                    idx < sections.length - 1
                                        ? sections[idx + 1]
                                        : null;
                                return (
                                    <>
                                        {prev ? (
                                            <button
                                                onClick={() => navigate(prev.id)}
                                                className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                                            >
                                                ← {prev.title}
                                            </button>
                                        ) : (
                                            <span />
                                        )}
                                        {next ? (
                                            <button
                                                onClick={() => navigate(next.id)}
                                                className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                                            >
                                                {next.title} →
                                            </button>
                                        ) : (
                                            <span />
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
