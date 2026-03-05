"use client";

import { useState, useEffect } from "react";
import { Search, Calendar, BellRing, Trophy, GraduationCap, ChevronRight, Filter, Plus, Loader2, Pencil, Clock, Archive, ChevronDown, Trash2 } from "lucide-react";
import ClickSpark from "@/components/reactbits/ClickSpark";
import { useSession } from "next-auth/react";
import { getNoticesAction, getArchivedNoticesAction, deleteNoticeAction } from "@/actions/notice";
import { NoticeFormModal } from "@/components/notice/notice-form-modal";
import dayjs from "dayjs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
    const [expandedId, setExpandedId] = useState<string | null>(null);
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
        // eslint-disable-next-line
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
                return { icon: GraduationCap, color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-950/30", border: "border-red-200 dark:border-red-900/50" };
            case "Event":
                return { icon: Trophy, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-900/50" };
            default:
                return { icon: BellRing, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-950/30", border: "border-indigo-200 dark:border-indigo-900/50" };
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-3 tracking-tight">Notice Board</h1>
                    <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl">
                        Stay updated with essential university announcements, exam schedules, and upcoming community events.
                    </p>
                </div>
                {canCreate && (
                    <button
                        onClick={() => { setEditingNotice(null); setIsModalOpen(true); }}
                        className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-zinc-200 dark:shadow-none hover:shadow-indigo-500/20 shrink-0"
                    >
                        <Plus className="w-5 h-5" /> Let them know
                    </button>
                )}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="relative w-full sm:w-80 shrink-0">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-zinc-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search notices..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border-none bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-medium"
                    />
                </div>
                <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 px-2 sm:px-0 hide-scrollbar shrink-0 sm:pr-2">
                    <div className="hidden sm:flex items-center justify-center p-2 text-zinc-400">
                        <Filter className="h-4 w-4" />
                    </div>
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 text-sm font-bold rounded-xl whitespace-nowrap transition-all ${activeFilter === filter ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notice List */}
            <div className="relative space-y-6">
                {loading ? (
                    <div className="flex items-center justify-center py-20 text-indigo-600 dark:text-indigo-400">
                        <Loader2 className="h-10 w-10 animate-spin" />
                    </div>
                ) : filteredNotices.length > 0 ? (
                    filteredNotices.map((notice) => {
                        const style = getNoticeStyles(notice.type);
                        const Icon = style.icon;
                        const dateString = notice.createdAt ? dayjs(new Date(notice.createdAt)).format("MMMM D, YYYY") : "Unknown Date";
                        const isExpanded = expandedId === notice.id;
                        const isOwner = canCreate && (notice.authorId === userId || userRole === "ADMIN");
                        const expiryString = notice.expiresAt ? dayjs(new Date(notice.expiresAt)).format("MMM D, YYYY HH:mm") : null;
                        const wasEdited = !!notice.updatedAt;

                        return (
                            <div key={notice.id} className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all duration-300">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-[2rem] opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500 pointer-events-none" />

                                <div className="relative z-10">
                                    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-4 rounded-2xl ${style.bg} ${style.color} border ${style.border} shadow-sm shrink-0`}>
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white leading-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {notice.title}
                                                </h2>
                                                <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-zinc-500">
                                                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {dateString}</span>
                                                    {wasEdited && <span className="text-xs opacity-70 italic">· edited</span>}
                                                    <span className="hidden sm:inline">•</span>
                                                    <span>{notice.authorName}</span>
                                                    {notice.authorRole && notice.authorRole !== "USER" && (
                                                        <span className="px-2 py-0.5 text-[10px] bg-zinc-100 dark:bg-zinc-800 rounded-md uppercase font-bold tracking-wider opacity-80">{notice.authorRole}</span>
                                                    )}
                                                </div>
                                                {expiryString && (
                                                    <div className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                                                        <Clock className="w-3.5 h-3.5" /> Expires {expiryString}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0 ml-16 sm:ml-0">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wider ${style.bg} ${style.color} border ${style.border}`}>
                                                {notice.type}
                                            </span>
                                            {isOwner && (
                                                <>
                                                    <button
                                                        onClick={() => { setEditingNotice(notice); setIsModalOpen(true); }}
                                                        title="Edit notice"
                                                        className="p-2 rounded-xl text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(notice.id, false)}
                                                        disabled={deletingId === notice.id}
                                                        title="Delete notice"
                                                        className="p-2 rounded-xl text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                                    >
                                                        {deletingId === notice.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Markdown Content */}
                                    <div className="ml-0 sm:ml-20">
                                        <div className={`prose prose-zinc dark:prose-invert prose-sm max-w-none mb-6 transition-all duration-300 ${isExpanded ? "" : "line-clamp-3"}`}>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{notice.content}</ReactMarkdown>
                                        </div>

                                        <div className="flex items-center justify-between pt-5 border-t border-zinc-100 dark:border-zinc-800/60">
                                            <button
                                                onClick={() => setExpandedId(isExpanded ? null : notice.id)}
                                                className="text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center gap-1"
                                            >
                                                {isExpanded ? "Collapse" : "Read full notice"}
                                                <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-20 bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 border-dashed rounded-3xl">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 mb-6">
                            <Search className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">No notices found</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-md mx-auto">
                            We couldn&apos;t find any announcements matching &quot;{searchQuery}&quot; in the {activeFilter} category.
                        </p>
                        <ClickSpark className="mt-6 flex justify-center">
                            <button
                                onClick={() => { setSearchQuery(""); setActiveFilter("All"); }}
                                className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
                            >
                                Clear Filters
                            </button>
                        </ClickSpark>
                    </div>
                )}
            </div>

            {/* Archived Notices — admin/mod only */}
            {canCreate && (
                <div className="mt-12">
                    <button
                        onClick={toggleArchive}
                        className="w-full flex items-center justify-between px-5 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group shadow-sm"
                    >
                        <div className="flex items-center gap-3 font-bold">
                            <Archive className="w-4 h-4 text-zinc-400 group-hover:text-zinc-500 transition-colors" />
                            <span>Archived Notices</span>
                            {archiveLoaded && (
                                <span className="text-xs font-bold px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-md text-zinc-500">
                                    {archivedNotices.length}
                                </span>
                            )}
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showArchive ? "rotate-180" : ""}`} />
                    </button>

                    {showArchive && (
                        <div className="mt-4 space-y-4">
                            {loadingArchive ? (
                                <div className="flex items-center justify-center py-16 text-zinc-400">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                </div>
                            ) : archivedNotices.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                                    <Archive className="h-8 w-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
                                    <p className="text-zinc-500 dark:text-zinc-400 font-semibold">No expired notices yet.</p>
                                </div>
                            ) : (
                                archivedNotices.map((notice) => {
                                    const style = getNoticeStyles(notice.type);
                                    const Icon = style.icon;
                                    const expiredString = notice.expiresAt ? dayjs(new Date(notice.expiresAt)).format("MMMM D, YYYY HH:mm") : "";

                                    return (
                                        <div key={notice.id} className="relative bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-2xl p-5 sm:p-6 opacity-70 hover:opacity-100 transition-opacity">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-3 rounded-xl grayscale bg-zinc-200 dark:bg-zinc-800 text-zinc-400 shrink-0">
                                                        <Icon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-zinc-700 dark:text-zinc-300 text-base line-clamp-1">{notice.title}</h3>
                                                        <div className="flex items-center gap-2 mt-1 text-xs font-medium text-zinc-400">
                                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {notice.createdAt ? dayjs(new Date(notice.createdAt)).format("MMM D, YYYY") : ""}</span>
                                                            <span>·</span>
                                                            <span>{notice.authorName}</span>
                                                            <span>·</span>
                                                            <span className="flex items-center gap-1 text-red-400"><Clock className="w-3 h-3" /> Expired {expiredString}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingNotice(notice);
                                                            setIsModalOpen(true);
                                                        }}
                                                        title="Republish (edit expiry to extend)"
                                                        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" /> Republish
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(notice.id, true)}
                                                        disabled={deletingId === notice.id}
                                                        title="Delete permanently"
                                                        className="shrink-0 p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        {deletingId === notice.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            )}

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
