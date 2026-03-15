"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, FolderOpen, ChevronRight, CheckCircle2, FileText, Clock, User, BookOpen, X, LayoutGrid, List, Loader2, Upload } from "lucide-react";
import ClickSpark from "@/components/reactbits/ClickSpark";
import { getCoursesAction, getSubjectsAction, getFilesAction, incrementDownloadAction } from "@/actions/curriculum";
import PDFViewer from "@/components/pdf-viewer";
import { UploadModal } from "@/components/dashboard/upload-modal";

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
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCourseId, setActiveCourseId] = useState<string>("");
    const [activeSem, setActiveSem] = useState<string>("");
    const [activeSubjectId, setActiveSubjectId] = useState<string>("");

    const [selectedPaperIndex, setSelectedPaperIndex] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

    const availableSubjects = dbSubjects.filter(subject =>
        subject.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative min-h-screen pb-20 selection:bg-indigo-100 dark:selection:bg-indigo-900/40">
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-500/5 blur-[100px] rounded-full" />
            </div>

            <div className="flex flex-col lg:flex-row gap-8 max-w-screen-2xl mx-auto px-4 sm:px-6">
                {/* Left Sidebar (Sticky Menu) */}
                <aside className="w-full lg:w-80 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] flex flex-col gap-6">
                    <div className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-800/60 rounded-[2.5rem] p-8 shadow-2xl shadow-zinc-200/20 dark:shadow-none flex flex-col h-full">
                        <div className="space-y-6 flex-1 overflow-y-auto scrollbar-hide">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                                    <FolderOpen className="h-5 w-5" />
                                </div>
                                <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Resources</h2>
                            </div>

                            {/* Course Selection */}
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] pl-1">Select Degree</p>
                                <div className="grid grid-cols-1 gap-2">
                                    {loadingCourses ? (
                                        <div className="p-10 flex flex-col items-center justify-center w-full gap-3">
                                            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                                        </div>
                                    ) : dbCourses.map(c => (
                                        <button
                                            key={c.id}
                                            onClick={() => { setActiveCourseId(c.id); setActiveSem("Sem 1"); }}
                                            className={`w-full py-3 px-4 rounded-2xl text-xs font-black transition-all text-left flex items-center justify-between group uppercase tracking-widest ${activeCourseId === c.id
                                                ? "bg-zinc-900 text-white shadow-xl shadow-zinc-500/20 dark:bg-white dark:text-zinc-950"
                                                : "bg-zinc-50 dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                                                }`}
                                        >
                                            <span className="truncate">{c.name}</span>
                                            {activeCourseId === c.id && <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Semester Selection */}
                            <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] pl-1">Semester</p>
                                <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto scrollbar-hide">
                                    {computedSemesters.map(sem => (
                                        <button
                                            key={sem}
                                            onClick={() => setActiveSem(sem)}
                                            className={`py-3 px-4 rounded-2xl text-[10px] font-black transition-all text-center uppercase tracking-widest ${activeSem === sem
                                                ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/20"
                                                : "bg-zinc-50 dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-transparent"
                                                }`}
                                        >
                                            {sem}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Subject Search & List */}
                            <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex-1 flex flex-col min-h-0">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none group-focus-within:text-indigo-500 transition-colors">
                                        <Search className="h-4 w-4 text-zinc-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search subjects..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-zinc-400"
                                    />
                                </div>

                                <div className="space-y-1 overflow-y-auto scrollbar-hide relative min-h-[150px]">
                                    {loadingSubjects ? (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                                        </div>
                                    ) : availableSubjects.length > 0 ? (
                                        availableSubjects.map(subject => (
                                            <button
                                                key={subject.id}
                                                onClick={() => setActiveSubjectId(subject.id)}
                                                className={`w-full py-3 px-4 rounded-2xl text-[11px] transition-all text-left flex items-center gap-3 group ${activeSubjectId === subject.id
                                                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-black border border-indigo-100 dark:border-indigo-500/20 shadow-sm"
                                                    : "bg-transparent text-zinc-500 font-bold hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900 border border-transparent"
                                                    }`}
                                            >
                                                <div className={`p-1.5 rounded-lg border transition-colors ${activeSubjectId === subject.id ? "bg-white dark:bg-zinc-900 border-indigo-200" : "bg-zinc-100 dark:bg-zinc-800 border-transparent group-hover:bg-white"}`}>
                                                    <BookOpen className="h-3 w-3" />
                                                </div>
                                                <span className="truncate" title={subject.name}>{subject.name}</span>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 opacity-50">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">No subjects found</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Pane */}
                <main className="flex-1 min-w-0">
                    <div className="bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-800/60 rounded-[3rem] p-6 lg:p-12 shadow-2xl shadow-zinc-200/10 dark:shadow-none min-h-[calc(100vh-120px)] flex flex-col">
                        
                        {/* Header Area */}
                        <div className="relative mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="space-y-6">
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-full border border-indigo-100 dark:border-indigo-500/20 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                                        {activeCourse?.name || "Library"}
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-zinc-300" />
                                    <div className="px-4 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 text-[10px] font-black text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">
                                        {activeSem}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">
                                        {dbSubjects.find(s => s.id === activeSubjectId)?.name || "Subject Resources"}
                                    </h1>
                                    <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
                                        {loadingPapers ? (
                                            <span className="flex items-center gap-3">
                                                <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                                                Loading details...
                                            </span>
                                        ) : (
                                            `Access ${papers.length} high-quality academic documents for your curriculum.`
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* View Controls */}
                            <div className="flex items-center gap-3 self-end md:self-auto">
                                <div className="bg-zinc-100/50 dark:bg-zinc-900/50 backdrop-blur-sm p-1.5 rounded-2xl flex items-center border border-zinc-200/50 dark:border-zinc-800/50 shadow-inner">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`p-3 rounded-xl transition-all ${viewMode === "grid" ? "bg-white dark:bg-zinc-800 shadow-xl text-indigo-600 dark:text-indigo-400" : "text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"}`}
                                        title="Grid Layout"
                                    >
                                        <LayoutGrid className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`p-3 rounded-xl transition-all ${viewMode === "list" ? "bg-white dark:bg-zinc-800 shadow-xl text-indigo-600 dark:text-indigo-400" : "text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"}`}
                                        title="List Detail"
                                    >
                                        <List className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Documents Grid / List */}
                        <div className="flex-1 relative">
                            {loadingPapers ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 py-32">
                                    <div className="relative">
                                        <div className="w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full absolute -inset-4 animate-pulse" />
                                        <Loader2 className="h-12 w-12 animate-spin text-indigo-500 relative z-10" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 animate-pulse">Loading Resources</p>
                                </div>
                            ) : papers.length > 0 ? (
                                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                                    {papers.map((paper, idx) => (
                                        <div
                                            key={paper.id}
                                            className={`group relative bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/60 rounded-[2.5rem] shadow-xl shadow-zinc-200/10 dark:shadow-none hover:border-indigo-500/40 transition-all duration-500 overflow-hidden ${viewMode === "list" ? "p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-8" : "p-8 flex flex-col"}`}
                                        >
                                            {/* Accent Background */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] -mr-16 -mt-16 pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />

                                            <div className={viewMode === "list" ? "flex items-center gap-8 flex-1 min-w-0" : "flex-1"}>
                                                <div className={`shrink-0 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 ${viewMode === "list" ? "w-20 h-20 rounded-[1.75rem]" : "w-16 h-16 rounded-2xl mb-8"}`}>
                                                    <FileText className={`text-indigo-500 ${viewMode === "list" ? "w-10 h-10" : "w-8 h-8"}`} />
                                                </div>

                                                <div className="space-y-4 flex-1 min-w-0">
                                                    <div className="flex items-center gap-3">
                                                        <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-100 dark:border-emerald-500/20 leading-none">
                                                            {paper.type}
                                                        </span>
                                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none flex items-center gap-1.5">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            {paper.date}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight leading-none group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                            {paper.year}
                                                        </h3>
                                                        <p className="text-sm font-bold text-zinc-500 mt-2 truncate max-w-full">
                                                            {paper.title}
                                                        </p>
                                                    </div>
                                                    
                                                    {/* Author Info */}
                                                    <div className="flex items-center gap-3 pt-4 border-t border-zinc-50 dark:border-zinc-900">
                                                        <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400">
                                                            <User className="w-4 h-4" />
                                                        </div>
                                                        <div className="text-[10px] font-black uppercase tracking-widest">
                                                            <p className="text-zinc-400 opacity-60">Uploader</p>
                                                            {paper.authorUsername ? (
                                                                <Link
                                                                    href={`/u/${paper.authorUsername}`}
                                                                    className="text-zinc-900 dark:text-zinc-100 hover:text-indigo-500 transition-colors"
                                                                    onClick={e => e.stopPropagation()}
                                                                >
                                                                    {paper.author}
                                                                </Link>
                                                            ) : (
                                                                <span className="text-zinc-900 dark:text-zinc-100">{paper.author}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={viewMode === "list" ? "shrink-0" : "mt-10"}>
                                                <ClickSpark className="w-full">
                                                    <button
                                                        onClick={() => setSelectedPaperIndex(idx)}
                                                        className="w-full px-8 py-4 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                        View Paper
                                                    </button>
                                                </ClickSpark>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-32 text-center space-y-8 bg-zinc-50/50 dark:bg-zinc-900/20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem]">
                                    <div className="w-24 h-24 bg-white dark:bg-zinc-900 rounded-[2rem] flex items-center justify-center shadow-xl border border-zinc-100 dark:border-zinc-800 text-zinc-300">
                                        <FolderOpen className="h-10 w-10" />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">No resources found</h3>
                                        <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto font-medium leading-relaxed">
                                            We are currently processing resources for this subject. Be the first to contribute to the library.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsUploadModalOpen(true)}
                                        className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all"
                                    >
                                        <Upload className="w-4 h-4" />
                                        Upload Paper
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
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
                                            Verified Resource
                                        </span>
                                        <span className="whitespace-nowrap flex items-center gap-1.5">
                                            <Upload className="w-3 h-3" />
                                            {selectedPaper.downloads || 0} Downloads
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedPaperIndex(null)}
                                className="p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all active:scale-90"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </header>

                        {/* High-Fidelity Viewer Body */}
                        <div className="flex-1 bg-zinc-200 dark:bg-black/40 relative">
                            <PDFViewer
                                url={selectedPaper.viewLink}
                                downloadUrl={selectedPaper.downloadLink}
                                onDownload={() => {
                                    setPapers(prev => prev.map((p) =>
                                        p.id === selectedPaper.id
                                            ? { ...p, downloads: (p.downloads ?? 0) + 1 }
                                            : p
                                    ));
                                    incrementDownloadAction(selectedPaper.id);
                                }}
                                fileLabel={`${selectedPaper.year} Academic Record`}
                                onPrevFile={() => setSelectedPaperIndex(i => i !== null ? Math.max(0, i - 1) : 0)}
                                onNextFile={() => setSelectedPaperIndex(i => i !== null ? Math.min(papers.length - 1, i + 1) : 0)}
                                hasPrev={(selectedPaperIndex ?? 0) > 0}
                                hasNext={(selectedPaperIndex ?? 0) < papers.length - 1}
                            />
                        </div>
                    </div>
                </div>
            )}

            <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
        </div>
    );
}
