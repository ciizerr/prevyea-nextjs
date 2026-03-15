"use client";

import { useState, useEffect, useTransition } from "react";
import {
    FileText, Trash2, Pencil, Check, X, ExternalLink,
    Search, Loader2, AlertTriangle, ChevronDown,
} from "lucide-react";
import {
    getFilesForManagementAction,
    deleteFileAction,
    bulkDeleteFilesAction,
    deleteAllFilesAction,
    updateFileTitleAction,
} from "@/actions/management";

type FileRow = {
    id: string;
    title: string;
    type: string | null;
    year: number;
    status: string | null;
    viewLink: string;
    uploaderName: string | null;
    subjectName: string | null;
    courseName: string | null;
    semester: string;
    createdAt: unknown;
};

const STATUS_COLORS: Record<string, string> = {
    APPROVED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    REJECTED: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

const TYPE_COLORS: Record<string, string> = {
    PYQ: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    Notes: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
    Syllabus: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
};

// ─── Delete Confirm Dialog ───────────────────────────────────────────────────
function DeleteConfirmDialog({
    title,
    onConfirm,
    onCancel,
    isPending,
}: {
    title: string;
    onConfirm: () => void;
    onCancel: () => void;
    isPending: boolean;
}) {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-in zoom-in-95 duration-150">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-red-100 dark:bg-red-500/10 rounded-xl text-red-600 dark:text-red-400">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Delete File?</h3>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                    This will permanently delete:
                </p>
                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-5 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-lg line-clamp-2">
                    {title}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mb-5">
                    This action cannot be undone. The file record will be removed from the database.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isPending}
                        className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-sm font-bold text-white transition-colors active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ManageFilesSection() {
    const [files, setFiles] = useState<FileRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState("");

    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        getFilesForManagementAction().then((res) => {
            if (res.success && res.data) setFiles(res.data as FileRow[]);
            setLoading(false);
        });
    }, []);

    const filteredFiles = files.filter(f => {
        const matchSearch = f.title.toLowerCase().includes(search.toLowerCase()) ||
            f.subjectName?.toLowerCase().includes(search.toLowerCase()) ||
            f.courseName?.toLowerCase().includes(search.toLowerCase()) ||
            f.uploaderName?.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === "ALL" || f.type === typeFilter;
        const matchStatus = statusFilter === "ALL" || f.status === statusFilter;
        return matchSearch && matchType && matchStatus;
    });

    const handleDelete = (id: string) => {
        startTransition(async () => {
            await deleteFileAction(id);
            setFiles(prev => prev.filter(f => f.id !== id));
            setConfirmDeleteId(null);
            if (selectedIds.has(id)) {
                const next = new Set(selectedIds);
                next.delete(id);
                setSelectedIds(next);
            }
        });
    };

    const handleBulkDelete = () => {
        if (selectedIds.size === 0) return;
        if (!confirm(`Are you sure you want to delete ${selectedIds.size} file(s)? This action cannot be undone.`)) return;

        startTransition(async () => {
            await bulkDeleteFilesAction(Array.from(selectedIds));
            setFiles(prev => prev.filter(f => !selectedIds.has(f.id)));
            setSelectedIds(new Set());
        });
    };

    const toggleSelection = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const toggleAll = () => {
        if (selectedIds.size === filteredFiles.length) setSelectedIds(new Set());
        else setSelectedIds(new Set(filteredFiles.map(f => f.id)));
    };

    const handleDeleteAll = () => {
        if (!confirm("CRITICAL ACTION: Are you sure you want to delete EVERY file in the library? This will wipe the Cloudinary storage and database records for ALL files. This cannot be undone.")) return;
        
        startTransition(async () => {
            const res = await deleteAllFilesAction();
            if (res.success) {
                setFiles([]);
                setSelectedIds(new Set());
            }
        });
    };

    const handleEditSave = (id: string) => {
        if (!editingTitle.trim()) return;
        startTransition(async () => {
            await updateFileTitleAction(id, editingTitle);
            setFiles(prev => prev.map(f => f.id === id ? { ...f, title: editingTitle.trim() } : f));
            setEditingId(null);
        });
    };

    const fileToDelete = files.find(f => f.id === confirmDeleteId);

    const inputClass = "px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none";

    return (
        <>
            {confirmDeleteId && fileToDelete && (
                <DeleteConfirmDialog
                    title={fileToDelete.title}
                    onConfirm={() => handleDelete(confirmDeleteId)}
                    onCancel={() => setConfirmDeleteId(null)}
                    isPending={isPending}
                />
            )}

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
                {/* Section header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        Manage Files
                        <span className="text-sm font-medium text-zinc-400 ml-1">({files.length} total)</span>
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                        {selectedIds.size > 0 && (
                            <button
                                onClick={handleBulkDelete}
                                disabled={isPending}
                                className="text-sm font-bold bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors mr-2"
                            >
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                Delete Selected ({selectedIds.size})
                            </button>
                        )}
                        {files.length > 0 && (
                            <button
                                onClick={handleDeleteAll}
                                disabled={isPending}
                                className="text-sm font-bold bg-zinc-900 hover:bg-black text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                            >
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                                Empty All
                            </button>
                        )}
                        {/* Type filter */}
                        <div className="relative">
                            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className={inputClass}>
                                <option value="ALL">All Types</option>
                                <option value="PYQ">PYQ</option>
                                <option value="Notes">Notes</option>
                                <option value="Syllabus">Syllabus</option>
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                        </div>
                        {/* Status filter */}
                        <div className="relative">
                            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={inputClass}>
                                <option value="ALL">All Status</option>
                                <option value="APPROVED">Approved</option>
                                <option value="PENDING">Pending</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                        </div>
                    </div>
                </div>

                {/* Bulk Select All */}
                {filteredFiles.length > 0 && !loading && (
                    <div className="flex items-center gap-2 mb-3 px-1">
                        <input
                            type="checkbox"
                            checked={selectedIds.size === filteredFiles.length && filteredFiles.length > 0}
                            onChange={toggleAll}
                            className="w-4 h-4 text-blue-600 rounded border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800"
                            id="selectAllFiles"
                        />
                        <label htmlFor="selectAllFiles" className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 cursor-pointer select-none border-b border-transparent hover:border-zinc-300">
                            Select All
                        </label>
                    </div>
                )}

                {/* Search */}
                <div className="relative mb-5">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search by title, subject, course, or uploader…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>

                {/* Table */}
                {loading ? (
                    <div className="flex items-center justify-center py-16 text-zinc-400 gap-3">
                        <Loader2 className="h-6 w-6 animate-spin" /> Loading files…
                    </div>
                ) : filteredFiles.length === 0 ? (
                    <div className="text-center py-16 text-zinc-400">
                        <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
                        <p className="font-semibold">No files found</p>
                    </div>
                ) : (
                    <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                        {filteredFiles.map(file => (
                            <div
                                key={file.id}
                                className={`p-4 rounded-2xl border transition-colors flex gap-3 ${selectedIds.has(file.id) ? 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-500/10' : 'border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:border-zinc-200 dark:hover:border-zinc-700'}`}
                            >
                                <div className="pt-1 select-none">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(file.id)}
                                        onChange={() => toggleSelection(file.id)}
                                        className="w-4 h-4 text-blue-600 rounded border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    {/* Row 1: Title / Edit input */}
                                    <div className="mb-1.5">
                                        {editingId === file.id ? (
                                            <input
                                                value={editingTitle}
                                                onChange={e => setEditingTitle(e.target.value)}
                                                onKeyDown={e => {
                                                    if (e.key === "Enter") handleEditSave(file.id);
                                                    if (e.key === "Escape") setEditingId(null);
                                                }}
                                                autoFocus
                                                className="w-full px-3 py-1.5 rounded-lg border border-blue-400 dark:border-blue-600 bg-white dark:bg-zinc-900 text-sm font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                            />
                                        ) : (
                                            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate leading-snug">
                                                {file.title}
                                            </p>
                                        )}
                                    </div>

                                {/* Row 2: Meta */}
                                <p className="text-xs text-zinc-400 truncate mb-2.5">
                                    {[file.courseName, file.subjectName, file.semester, file.uploaderName ? `by ${file.uploaderName}` : null]
                                        .filter(Boolean).join(" · ")}
                                </p>

                                {/* Row 3: Badges + Year on left, Actions on right */}
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${TYPE_COLORS[file.type ?? ""] || "bg-zinc-200 text-zinc-600"}`}>
                                            {file.type}
                                        </span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${STATUS_COLORS[file.status ?? ""] || "bg-zinc-200 text-zinc-600"}`}>
                                            {file.status}
                                        </span>
                                        <span className="text-[10px] font-bold text-zinc-400 bg-zinc-200/60 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                                            {file.year}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                        {editingId === file.id ? (
                                            <>
                                                <button
                                                    onClick={() => handleEditSave(file.id)}
                                                    disabled={isPending}
                                                    className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/20 transition-colors"
                                                    title="Save"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                                                    title="Cancel"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <a
                                                    href={file.viewLink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                                                    title="Preview"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                                <button
                                                    onClick={() => { setEditingId(file.id); setEditingTitle(file.title); }}
                                                    className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
                                                    title="Edit title"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDeleteId(file.id)}
                                                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </>
                                        )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
