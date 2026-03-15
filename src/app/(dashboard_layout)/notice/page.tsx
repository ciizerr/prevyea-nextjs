"use client";

import { useState, useEffect } from "react";
import { Search, Calendar, BellRing, Trophy, GraduationCap, ChevronRight, Plus, Loader2, Pencil, Archive, ChevronDown, Trash2, Megaphone, User, Info } from "lucide-react";
import ClickSpark from "@/components/reactbits/ClickSpark";
import { useSession } from "next-auth/react";
import { getNoticesAction, getArchivedNoticesAction, deleteNoticeAction } from "@/actions/notice";
import { NoticeFormModal } from "@/components/notice/notice-form-modal";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

dayjs.extend(relativeTime);

interface NoticeDoc {
    id: string;
    title: string;
    type: string;
    content: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    expiresAt: Date | null;
    authorId: string | null;
    authorName: string | null;
    authorRole: string | null;
}

export default function NoticeBoardPage() {
    const { data: session } = useSession();
    // @ts-expect-error - role string
    const userRole = session?.user?.role;
    const userId = session?.user?.id;
    const canCreate = userRole === "ADMIN" || userRole === "MODERATOR";

    const [notices, setNotices] = useState<NoticeDoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNotice, setEditingNotice] = useState<NoticeDoc | null>(null);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Archive state
    const [showArchive, setShowArchive] = useState(false);
    const [archivedNotices, setArchivedNotices] = useState<NoticeDoc[]>([]);
    const [loadingArchive, setLoadingArchive] = useState(false);
    const [archiveLoaded, setArchiveLoaded] = useState(false);

    const filters = ["All", "Exam", "Event", "General"];

    async function loadNotices() {
        setLoading(true);
        const res = await getNoticesAction();
        if (res.success && res.data) {
            setNotices(res.data as NoticeDoc[]);
        }
        setLoading(false);
    }

    async function loadArchive() {
        if (archiveLoaded) return;
        setLoadingArchive(true);
        const res = await getArchivedNoticesAction();
        if (res.success && res.data) {
            setArchivedNotices(res.data as NoticeDoc[]);
        }
        setLoadingArchive(false);
        setArchiveLoaded(true);
    }

    function toggleArchive() {
        const next = !showArchive;
        setShowArchive(next);
        if (next) loadArchive();
    }

    function toggleExpand(id: string) {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    async function handleDelete(id: string, isArchive: boolean) {
        if (!confirm("Are you sure you want to delete this notice forever?")) return;
        setDeletingId(id);
        const res = await deleteNoticeAction(id);
        if (res.success) {
            if (isArchive) {
                setArchivedNotices(prev => prev.filter(n => n.id !== id));
            } else {
                setNotices(prev => prev.filter(n => n.id !== id));
            }
        } else {
            alert(res.error || "Failed to delete notice");
        }
        setDeletingId(null);
    }

    useEffect(() => {
        loadNotices();
    }, []);

    const filteredNotices = notices.filter((notice) => {
        const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            notice.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === "All" || notice.type === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const getNoticeStyles = (type: string) => {
        switch (type) {
            case "Exam":
                return { icon: GraduationCap, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-500/10", border: "border-rose-100 dark:border-rose-500/20" };
            case "Event":
                return { icon: Trophy, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-100 dark:border-amber-500/20" };
            default:
                return { icon: Megaphone, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-100 dark:border-blue-500/20" };
        }
    };

    return (
        <div className="relative min-h-screen pb-20 selection:bg-indigo-100 dark:selection:bg-indigo-900/40">
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-500/5 blur-[100px] rounded-full" />
            </div>

            <main className="max-w-6xl mx-auto px-6 pt-12 space-y-12">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest">
                            <BellRing className="w-3.5 h-3.5" />
                            Live Announcements
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">
                            Notice Board
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed mx-auto md:mx-0">
                            Stay synchronized with Patna University schedules, community events, and critical alerts.
                        </p>
                    </div>
                    {canCreate && (
                        <ClickSpark className="w-full md:w-auto">
                            <button
                                onClick={() => { setEditingNotice(null); setIsModalOpen(true); }}
                                className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 rounded-[1.5rem] font-black hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-zinc-200 dark:shadow-none shrink-0"
                            >
                                <Plus className="w-5 h-5" />
                                Create Alert
                            </button>
                        </ClickSpark>
                    )}
                </div>

                {/* Search & Filter Hub */}
                <div className="sticky top-6 z-40 flex flex-col sm:flex-row items-center gap-4 p-3 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-800/60 rounded-[2rem] shadow-2xl shadow-indigo-500/10">
                    <div className="relative w-full sm:w-80">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-zinc-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search notices..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 rounded-3xl bg-zinc-100/50 dark:bg-zinc-900/50 border-none text-zinc-900 dark:text-zinc-100 font-bold focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-400 text-sm"
                        />
                    </div>
                    
                    <div className="flex items-center justify-center sm:justify-start gap-2 overflow-x-auto w-full sm:w-auto px-2 sm:px-0 scrollbar-hide">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-5 py-2.5 sm:px-6 sm:py-3 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-2xl transition-all whitespace-nowrap ${
                                    activeFilter === filter 
                                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/30" 
                                    : "bg-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Display Grid */}
                <div className="grid grid-cols-1 gap-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-4">
                            <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
                            <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Loading notices...</p>
                        </div>
                    ) : filteredNotices.length > 0 ? (
                        filteredNotices.map((notice) => {
                            const style = getNoticeStyles(notice.type);
                            const Icon = style.icon;
                            const isExpanded = expandedIds.has(notice.id);
                            const isOwner = canCreate && (notice.authorId === userId || userRole === "ADMIN");
                            const expiryDate = notice.expiresAt ? dayjs(notice.expiresAt) : null;
                            const isExpiredSoon = expiryDate && expiryDate.diff(dayjs(), 'hours') < 48 && expiryDate.isAfter(dayjs());

                            return (
                                <article 
                                    key={notice.id} 
                                    className="group relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-zinc-200/20 dark:shadow-none hover:border-indigo-500/30 transition-all duration-500 overflow-hidden"
                                >
                                    {/* Accent Decoration */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -mr-20 -mt-20 pointer-events-none" />
                                    
                                    <div className="relative z-10 flex flex-col gap-8">
                                        <div className="flex flex-wrap items-start justify-between gap-6">
                                            <div className="flex items-center gap-6">
                                                <div className={`w-16 h-16 rounded-[1.5rem] ${style.bg} ${style.color} border ${style.border} flex items-center justify-center shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                                                    <Icon className="h-7 w-7" />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${style.bg} ${style.color} border ${style.border}`}>
                                                            {notice.type}
                                                        </span>
                                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                                                            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                                                            {dayjs(notice.createdAt).format("MMM D, YYYY")}
                                                        </span>
                                                    </div>
                                                    <h2 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white leading-tight">
                                                        {notice.title}
                                                    </h2>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {isOwner && (
                                                    <div className="flex items-center gap-1 px-2 py-1 bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                                                        <button
                                                            onClick={() => { setEditingNotice(notice); setIsModalOpen(true); }}
                                                            className="p-2.5 rounded-xl text-zinc-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-zinc-800 transition-all"
                                                            title="Modify Notice"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(notice.id, false)}
                                                            disabled={deletingId === notice.id}
                                                            className="p-2.5 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-white dark:hover:bg-zinc-800 transition-all disabled:opacity-50"
                                                            title="Delete Notice"
                                                        >
                                                            {deletingId === notice.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                )}
                                                {expiryDate && (
                                                    <div className={`hidden md:flex flex-col items-end px-4 py-2 rounded-2xl border ${isExpiredSoon ? "bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-400" : "bg-zinc-50 border-zinc-100 text-zinc-500 dark:bg-zinc-900/40 dark:border-zinc-800 dark:text-zinc-500"}`}>
                                                        <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Expires</span>
                                                        <span className="text-xs font-black">{expiryDate.format("MMM D, HH:mm")}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className={`prose prose-lg dark:prose-invert prose-zinc max-w-none transition-all duration-300 relative ${isExpanded ? "" : "line-clamp-4 mask-fade-bottom"}`}>
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{notice.content}</ReactMarkdown>
                                                {!isExpanded && <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white dark:from-zinc-950 to-transparent pointer-events-none" />}
                                            </div>

                                            <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-zinc-100 dark:border-zinc-800/60">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 text-zinc-400">
                                                        <User className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-zinc-900 dark:text-zinc-100">{notice.authorName}</p>
                                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{notice.authorRole || "Member"}</p>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => toggleExpand(notice.id)}
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 rounded-2xl text-xs font-black text-zinc-600 dark:text-zinc-400 transition-all uppercase tracking-widest"
                                                >
                                                    {isExpanded ? "Collapse notice" : "Read more"}
                                                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 bg-white dark:bg-zinc-950 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem]">
                            <div className="w-24 h-24 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] flex items-center justify-center text-zinc-300 border border-zinc-100 dark:border-zinc-800 shadow-sm">
                                <Info className="h-10 w-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">No notices found</h3>
                                <p className="text-zinc-500 dark:text-zinc-400 max-sm mx-auto font-medium">No results match your search parameters. Try adjusting the filters.</p>
                            </div>
                            <button
                                onClick={() => { setSearchQuery(""); setActiveFilter("All"); }}
                                className="px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Archive Section */}
                {canCreate && (
                    <div className="pt-12">
                        <button
                            onClick={toggleArchive}
                            className="w-full flex items-center justify-between p-8 bg-zinc-100/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 shadow-sm">
                                    <Archive className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100">Notice Archive</h3>
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Past Announcements</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {archiveLoaded && (
                                    <span className="px-3 py-1 bg-white dark:bg-zinc-800 rounded-xl text-xs font-black text-zinc-500 shadow-sm">
                                        {archivedNotices.length} Records
                                    </span>
                                )}
                                <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-500 ${showArchive ? "rotate-180" : ""}`} />
                            </div>
                        </button>

                        {showArchive && (
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-6 duration-500">
                                {loadingArchive ? (
                                    <div className="col-span-full flex items-center justify-center py-20">
                                        <Loader2 className="h-10 w-10 text-zinc-300 animate-spin" />
                                    </div>
                                ) : archivedNotices.length === 0 ? (
                                    <div className="col-span-full p-12 text-center bg-zinc-50 dark:bg-zinc-900/20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2rem]">
                                        <p className="text-zinc-400 font-bold tracking-widest uppercase text-xs">Archive is empty</p>
                                    </div>
                                ) : (
                                    archivedNotices.map((notice) => {
                                        const style = getNoticeStyles(notice.type);
                                        return (
                                            <div key={notice.id} className="bg-white/50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 p-6 rounded-[2rem] flex items-center justify-between gap-6 opacity-60 hover:opacity-100 transition-all">
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <div className={`w-12 h-12 rounded-xl border ${style.border} flex items-center justify-center grayscale opacity-50`}>
                                                        <style.icon className="w-6 h-6" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="font-black text-zinc-900 dark:text-zinc-100 text-sm truncate">{notice.title}</h4>
                                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{dayjs(notice.createdAt).format("MMM D, YYYY")}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => { setEditingNotice(notice); setIsModalOpen(true); }}
                                                        className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl text-zinc-400 hover:text-indigo-500 shadow-sm border border-zinc-200 dark:border-zinc-800 transition-all"
                                                        title="Republish"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(notice.id, true)}
                                                        disabled={deletingId === notice.id}
                                                        className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl text-zinc-400 hover:text-red-500 shadow-sm border border-zinc-200 dark:border-zinc-800 transition-all"
                                                        title="Erase Record"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Minimal Footer Spacer */}
                <div className="pt-20" />

            </main>

            {isModalOpen && (
                <NoticeFormModal
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); setEditingNotice(null); }}
                    onSuccess={loadNotices}
                    editData={editingNotice ? {
                        id: editingNotice.id,
                        title: editingNotice.title,
                        content: editingNotice.content,
                        type: editingNotice.type,
                        expiresAt: editingNotice.expiresAt,
                    } : undefined}
                />
            )}
        </div>
    );
}
