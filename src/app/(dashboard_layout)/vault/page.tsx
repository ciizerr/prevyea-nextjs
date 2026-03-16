"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    FileText,
    FolderOpen,
    Loader2,
    LayoutGrid,
    List,
    BookOpen,
    ChevronRight,
    ChevronLeft,
    Upload,
    CheckCircle2,
    Share2,
    X
} from "lucide-react";
import { motion } from "framer-motion";
import ClickSpark from "@/components/reactbits/ClickSpark";
import { getCoursesAction, getSubjectsAction, getFilesAction, incrementDownloadAction } from "@/actions/curriculum";
import PDFViewer from "@/components/pdf-viewer";
import { UploadModal } from "@/components/dashboard/upload-modal";
import { toast } from "sonner";

type CourseType = {
    id: string;
    name: string;
    totalSemesters: number;
    collegeId: string | null;
};

type SubjectType = {
    id: string;
    name: string;
    semester: string;
};

type Paper = {
    id: string;
    year: number;
    title: string;
    type: string;
    author: string;
    authorUsername: string | null;
    downloads: number | null;
    views: number | null;
    date: string;
    viewLink: string;
    downloadLink: string;
};

export default function VaultPage() {
    const [activeCourseId, setActiveCourseId] = useState<string>("");
    const [activeSem, setActiveSem] = useState<string>("");
    const [activeSubjectId, setActiveSubjectId] = useState<string>("");

    const [selectedPaperIndex, setSelectedPaperIndex] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");

    // Dynamic Data States
    const [dbCourses, setDbCourses] = useState<CourseType[]>([]);
    const [dbSubjects, setDbSubjects] = useState<SubjectType[]>([]);
    const [papers, setPapers] = useState<Paper[]>([]);
    const selectedPaper = selectedPaperIndex !== null ? papers[selectedPaperIndex] : null;

    // Loading States
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const [loadingPapers, setLoadingPapers] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // Initial Fetch for Courses
    useEffect(() => {
        async function fetchInitialData() {
            const res = await getCoursesAction();
            if (res.success && res.data) {
                // Remove duplicates that might arise from Many-to-Many joins fetching identically named courses across colleges
                const allCourses = res.data as CourseType[];
                const uniqueCourses = Array.from(new Map(allCourses.map(c => [c.id, c])).values());
                setDbCourses(uniqueCourses);
                if (uniqueCourses.length > 0) {
                    setActiveCourseId(uniqueCourses[0].id);
                    setActiveSem("Sem 1");
                }
            }
            setLoadingCourses(false);
        }
        fetchInitialData();
    }, []);

    // Fetch Subjects when Course or Sem changes
    useEffect(() => {
        async function fetchSubjects() {
            if (!activeCourseId || !activeSem) return;
            setLoadingSubjects(true);
            setDbSubjects([]);
            setActiveSubjectId("");
            setPapers([]);

            const res = await getSubjectsAction(activeCourseId, activeSem);
            if (res.success && res.data) {
                const fetchedSubjects = res.data as SubjectType[];
                setDbSubjects(fetchedSubjects);
                if (fetchedSubjects.length > 0) {
                    setActiveSubjectId(fetchedSubjects[0].id);
                }
            }
            setLoadingSubjects(false);
        }
        fetchSubjects();
    }, [activeCourseId, activeSem]);

    // Fetch Files when Subject changes
    useEffect(() => {
        async function fetchFiles() {
            if (!activeSubjectId) {
                setPapers([]);
                return;
            }
            setLoadingPapers(true);
            const res = await getFilesAction(activeSubjectId, ["PYQ", "Notes"]);
            if (res.success && res.data) {
                const formattedPapers: Paper[] = res.data.map((p: {
                    id: string; title: string; type: string; year: number; uploaderId: string | null; uploaderName: string | null; uploaderUsername: string | null; downloads: number | null; views: number | null; createdAt: Date | null; viewLink: string; downloadLink: string;
                }) => {
                    // createdAt may arrive as a JS Date, a Unix-seconds integer, or a SQLite
                    // text timestamp string ("YYYY-MM-DD HH:MM:SS") depending on the driver.
                    const parseDate = (raw: unknown): string => {
                        if (!raw) return "Unknown Date";
                        let d: Date;
                        if (raw instanceof Date) {
                            d = raw;
                        } else if (typeof raw === "string") {
                            // SQLite CURRENT_TIMESTAMP → "2024-03-04 07:39:57" — add T+Z for ISO parsing
                            d = new Date(raw.replace(" ", "T") + (raw.includes("Z") ? "" : "Z"));
                        } else {
                            // Assume Unix seconds integer
                            d = new Date(Number(raw) * 1000);
                        }
                        if (isNaN(d.getTime())) return "Unknown Date";
                        return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });
                    };
                    const dateStr = parseDate(p.createdAt);
                    return {
                        id: p.id,
                        title: p.title,
                        type: p.type,
                        year: p.year,
                        author: p.uploaderName || (p.uploaderId ? "Anonymous Student" : "Admin"),
                        authorUsername: p.uploaderUsername ?? null,
                        downloads: p.downloads,
                        views: p.views,
                        date: dateStr,
                        viewLink: p.viewLink,
                        downloadLink: p.downloadLink,
                    };
                });
                setPapers(formattedPapers);
            }
            setLoadingPapers(false);
        }
        fetchFiles();
    }, [activeSubjectId]);

    const activeCourse = dbCourses.find(c => c.id === activeCourseId);

    // Compute semesters range
    const maxSems = activeCourse?.totalSemesters || 6;
    const computedSemesters = Array.from({ length: maxSems }, (_, i) => `Sem ${i + 1}`);

    const availableSubjects = dbSubjects;

    return (
        <div className="relative min-h-screen bg-white dark:bg-[#050505] selection:bg-indigo-100 dark:selection:bg-indigo-900/40 pb-20 overflow-x-hidden">
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-12">
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Left Sidebar: Discovery Hub */}
                    <aside className="w-full lg:w-80 shrink-0">
                        <div className="lg:sticky lg:top-28 space-y-8">

                            {/* Branding / Title */}
                            <div className="space-y-1 pl-2">
                                <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter uppercase italic leading-none">Vault</h1>
                                <p className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 tracking-[0.3em] uppercase opacity-70">View Papers</p>
                            </div>

                            {/* Resource Card */}
                            <div className="bg-zinc-50 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800/60 rounded-[2.5rem] p-6 shadow-2xl space-y-8">

                                {/* Program Selection */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 px-2">
                                        <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                                        <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Select Course</span>
                                    </div>
                                    <div className="flex flex-col gap-2 p-1.5 bg-white dark:bg-zinc-950/50 rounded-3xl border border-zinc-100 dark:border-zinc-800/50">
                                        {loadingCourses ? (
                                            <div className="p-10 flex flex-col items-center justify-center w-full gap-3">
                                                <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                                            </div>
                                        ) : dbCourses.map(c => (
                                            <button
                                                key={c.id}
                                                onClick={() => { setActiveCourseId(c.id); setActiveSem("Sem 1"); }}
                                                className={`w-full py-3 px-5 rounded-2xl text-[11px] font-black transition-all text-left flex items-center justify-between group uppercase tracking-widest ${activeCourseId === c.id
                                                    ? "bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-xl scale-[1.02]"
                                                    : "text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/80"
                                                    }`}
                                            >
                                                <span className="truncate">{c.name}</span>
                                                {activeCourseId === c.id && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Semester Grid */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 px-2">
                                        <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                                        <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Semester</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto scrollbar-hide pr-1">
                                        {computedSemesters.map(sem => (
                                            <button
                                                key={sem}
                                                onClick={() => setActiveSem(sem)}
                                                className={`py-3 rounded-2xl text-[10px] font-black transition-all text-center uppercase tracking-widest border ${activeSem === sem
                                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                                                    : "bg-white dark:bg-zinc-950/30 border-zinc-100 dark:border-zinc-800/60 text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600"
                                                    }`}
                                            >
                                                {sem}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Subjects Selection */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 px-2">
                                        <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                                        <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Subjects</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[300px] scrollbar-hide pr-1 min-h-[100px] relative">
                                        {loadingSubjects ? (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Loader2 className="h-6 w-6 animate-spin text-indigo-500 opacity-20" />
                                            </div>
                                        ) : availableSubjects.length > 0 ? (
                                            availableSubjects.map(subject => (
                                                <button
                                                    key={subject.id}
                                                    onClick={() => setActiveSubjectId(subject.id)}
                                                    className={`w-full py-4 px-4 rounded-xl text-[10px] transition-all text-left flex items-center gap-3 group border ${activeSubjectId === subject.id
                                                        ? "bg-indigo-500 text-white font-black border-transparent shadow-lg shadow-indigo-500/20"
                                                        : "bg-white dark:bg-zinc-950/20 text-zinc-400 border-zinc-100 dark:border-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-600"
                                                        }`}
                                                >
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${activeSubjectId === subject.id ? "bg-white/20" : "bg-zinc-100 dark:bg-zinc-800"}`}>
                                                        <BookOpen className="h-4 w-4" />
                                                    </div>
                                                    <span className="line-clamp-3 uppercase tracking-tight font-black leading-tight flex-1" title={subject.name}>{subject.name}</span>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="col-span-2 text-center py-10 opacity-40">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">No subjects found</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <ClickSpark>
                                <button
                                    onClick={() => setIsUploadModalOpen(true)}
                                    className="w-full group py-5 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    <Upload className="h-4 w-4" />
                                    Upload Paper
                                </button>
                            </ClickSpark>
                        </div>
                    </aside>

                    {/* Right Main Content */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-white dark:bg-zinc-900/20 backdrop-blur-md border border-zinc-100 dark:border-zinc-800/40 rounded-[3rem] p-6 lg:p-12 shadow-2xl min-h-[calc(100vh-160px)] flex flex-col relative overflow-hidden">

                            {/* Decorative Background Element */}
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/[0.02] dark:bg-indigo-600/[0.03] blur-[100px] -mr-48 -mt-48 pointer-events-none" />

                            {/* Header Area */}
                            <div className="relative z-10 space-y-10 mb-16">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                                    <div className="space-y-6">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className="px-4 py-1.5 bg-zinc-100 dark:bg-zinc-900/50 rounded-full border border-zinc-200 dark:border-zinc-800 text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                                                {activeCourse?.name || "Library"}
                                            </div>
                                            <ChevronRight className="h-3 w-3 text-zinc-300" />
                                            <div className="px-4 py-1.5 bg-indigo-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20">
                                                {activeSem}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <h2 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none uppercase italic">
                                                {dbSubjects.find(s => s.id === activeSubjectId)?.name || "Papers"}
                                            </h2>
                                            <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400 max-w-2xl">
                                                {loadingPapers ? (
                                                    <span className="flex items-center gap-3 opacity-50 italic">
                                                        <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                                                        Loading...
                                                    </span>
                                                ) : (
                                                    `Viewing ${papers.length} papers for this subject.`
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* View Toggle */}
                                    <div className="flex bg-zinc-50 dark:bg-zinc-950 p-1.5 rounded-[1.5rem] border border-zinc-100 dark:border-zinc-800/50 shadow-inner">
                                        <button
                                            onClick={() => setViewMode("grid")}
                                            className={`p-3.5 rounded-2xl transition-all ${viewMode === "grid" ? "bg-white dark:bg-zinc-800 text-indigo-500 shadow-xl" : "text-zinc-300 hover:text-zinc-900 italic"}`}
                                        >
                                            <LayoutGrid className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode("list")}
                                            className={`p-3.5 rounded-2xl transition-all ${viewMode === "list" ? "bg-white dark:bg-zinc-800 text-indigo-500 shadow-xl" : "text-zinc-300 hover:text-zinc-900 italic"}`}
                                        >
                                            <List className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Content Display */}
                            <div className="relative z-10 flex-1">
                                {loadingPapers ? (
                                    <div className="h-full flex flex-col items-center justify-center gap-6 py-40">
                                        <div className="relative">
                                            <div className="w-24 h-24 bg-indigo-500/10 blur-[60px] rounded-full absolute -inset-6 animate-pulse" />
                                            <Loader2 className="h-12 w-12 animate-spin text-indigo-500 relative z-10 opacity-30" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 animate-pulse">Loading...</p>
                                    </div>
                                ) : papers.length > 0 ? (
                                    <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-3"}>
                                        {papers.map((paper, idx) => (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: idx * 0.02 }}
                                                key={paper.id}
                                                onClick={() => setSelectedPaperIndex(idx)}
                                                className="group cursor-pointer bg-white dark:bg-zinc-950/20 border border-zinc-100 dark:border-zinc-800/40 rounded-xl p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:border-indigo-500/20 transition-all flex items-center justify-between shadow-sm hover:shadow-md"
                                            >
                                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                                    <div className="shrink-0 w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 dark:text-zinc-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div className={`min-w-0 flex-1 ${viewMode === "list" ? "flex items-center justify-between gap-6" : ""}`}>
                                                        <h3 className={`text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight leading-tight ${viewMode === "list" ? "truncate" : "line-clamp-2"}`}>
                                                            {paper.title} <span className="text-zinc-400 dark:text-zinc-600 px-0.5 font-normal">●</span> {paper.year}
                                                        </h3>
                                                        <div className={`flex items-center gap-2 shrink-0 opacity-75 ${viewMode === "list" ? "mt-0" : "mt-1.5"}`}>
                                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-colors ${
                                                                paper.type.toLowerCase().includes('pyq') 
                                                                    ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 group-hover:bg-indigo-500/25" 
                                                                    : paper.type.toLowerCase().includes('note')
                                                                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 group-hover:bg-emerald-500/25"
                                                                        : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 group-hover:bg-amber-500/25"
                                                            }`}>
                                                                {paper.type}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-zinc-400 truncate max-w-[80px]">by {paper.author}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-700 group-hover:text-indigo-500 transition-colors shrink-0" />
                                            </motion.div>
                                        ))}
                                    </div>





                                ) : (
                                    <div className="flex flex-col items-center justify-center py-40 text-center space-y-10 bg-zinc-50 dark:bg-zinc-950/20 border-2 border-dashed border-zinc-100 dark:border-zinc-800/40 rounded-[4rem]">
                                        <div className="w-28 h-28 bg-white dark:bg-zinc-900/50 rounded-[2.5rem] flex items-center justify-center shadow-xl border border-zinc-100 dark:border-zinc-800 text-zinc-200 dark:text-zinc-800">
                                            <FolderOpen className="h-12 w-12" />
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter uppercase italic">No Papers Found</h3>
                                            <p className="text-zinc-400 dark:text-zinc-500 max-w-sm mx-auto font-medium leading-relaxed">
                                                No papers have been uploaded for this selection yet.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setIsUploadModalOpen(true)}
                                            className="px-10 py-5 bg-indigo-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/20 hover:scale-[1.05] active:scale-95 transition-all"
                                        >
                                            Upload Now
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Premium PDF Viewer Modal */}
            {selectedPaper && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 pointer-events-none">
                    <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md pointer-events-auto transition-all animate-in fade-in duration-500" onClick={() => setSelectedPaperIndex(null)} />

                    <div className="relative w-full max-w-7xl h-full bg-zinc-100 dark:bg-zinc-950 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col pointer-events-auto animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
                        {/* Interactive Toolbar */}
                        <header className="h-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800/60 flex items-center justify-between px-8 shrink-0 z-20">
                            <div className="flex items-center gap-6 min-w-0">
                                <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 items-center justify-center text-indigo-600 dark:text-indigo-400">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-black text-lg text-zinc-900 dark:text-zinc-100 tracking-tight truncate leading-none mb-1.5">
                                        {selectedPaper.year} · {selectedPaper.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400">
                                        <span className="flex items-center gap-1.5 text-emerald-500">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Verified
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            <span>by</span>
                                            {selectedPaper.authorUsername ? (
                                                <Link 
                                                    href={`/u/${selectedPaper.authorUsername}`}
                                                    className="text-zinc-900 dark:text-zinc-100 hover:text-indigo-500 transition-colors underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-4"
                                                >
                                                    @{selectedPaper.authorUsername}
                                                </Link>
                                            ) : (
                                                <span className="text-zinc-500 italic">Deleted User</span>
                                            )}
                                        </div>
                                        <span className="whitespace-nowrap flex items-center gap-1.5">
                                            <Upload className="w-3 h-3" />
                                            {selectedPaper.downloads || 0} Downloads
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-1 mr-2">
                                    <button
                                        onClick={() => setSelectedPaperIndex(i => i !== null ? i - 1 : 0)}
                                        disabled={(selectedPaperIndex ?? 0) === 0}
                                        className="p-2 rounded-xl hover:bg-white dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-zinc-600 dark:text-zinc-400"
                                        title="Previous Paper"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-1" />
                                    <button
                                        onClick={() => setSelectedPaperIndex(i => i !== null ? i + 1 : 0)}
                                        disabled={(selectedPaperIndex ?? 0) >= papers.length - 1}
                                        className="p-2 rounded-xl hover:bg-white dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-zinc-600 dark:text-zinc-400"
                                        title="Next Paper"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => {
                                        const url = `${window.location.origin}/v/${selectedPaper.id}`;
                                        navigator.clipboard.writeText(url);
                                        toast.success("Link copied to clipboard!");
                                    }}
                                    className="p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-5 group"
                                >
                                    <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span className="hidden sm:inline">Share Link</span>
                                </button>
                                <button
                                    onClick={() => setSelectedPaperIndex(null)}
                                    className="p-3 rounded-2xl bg-red-50 hover:bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 transition-all active:scale-90"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                        </header>

                        {/* High-Fidelity Viewer Body */}
                        <div className="flex-1 bg-zinc-200 dark:bg-black/40 relative min-h-0">
                            <PDFViewer
                                url={selectedPaper.viewLink}
                                downloadUrl={selectedPaper.downloadLink}
                                fileLabel={`${selectedPaper.year} - ${selectedPaper.title}`}
                                onDownload={() => {
                                    setPapers(prev => prev.map((p) =>
                                        p.id === selectedPaper.id
                                            ? { ...p, downloads: (p.downloads ?? 0) + 1 }
                                            : p
                                    ));
                                    incrementDownloadAction(selectedPaper.id);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
        </div>
    );
}
