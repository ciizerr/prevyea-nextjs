"use client";

import { useState, useEffect } from "react";
import { Search, FolderOpen, ChevronRight, CheckCircle2, FileText, Download, Clock, User, BookOpen, X, LayoutGrid, List, Loader2 } from "lucide-react";
import ClickSpark from "@/components/reactbits/ClickSpark";
import { getCoursesAction, getSubjectsAction, getFilesAction } from "@/actions/curriculum";

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

    const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Dynamic Data States
    const [dbCourses, setDbCourses] = useState<CourseType[]>([]);
    const [dbSubjects, setDbSubjects] = useState<SubjectType[]>([]);
    const [papers, setPapers] = useState<Paper[]>([]);

    // Loading States
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const [loadingPapers, setLoadingPapers] = useState(false);

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
                    id: string; title: string; type: string; year: number; uploaderId: string | null; downloads: number | null; views: number | null; createdAt: Date | null; viewLink: string; downloadLink: string;
                }) => ({
                    id: p.id,
                    title: p.title,
                    type: p.type,
                    year: p.year,
                    author: p.uploaderId ? "Student" : "Admin", // Fallback for now unless we join users
                    downloads: p.downloads,
                    views: p.views,
                    date: p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }) : "Unknown Date",
                    viewLink: p.viewLink,
                    downloadLink: p.downloadLink
                }));
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
        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

            {/* Left Sidebar (Sticky Menu) */}
            <div className="w-full lg:w-80 shrink-0 space-y-6">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm sticky top-24">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-6">
                        <FolderOpen className="h-5 w-5 text-blue-500" />
                        PYQ Navigator
                    </h2>

                    {/* Course Selection */}
                    <div className="space-y-3 mb-8">
                        <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest pl-2">Degree</p>
                        <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl flex-wrap">
                            {loadingCourses ? (
                                <div className="p-4 flex items-center justify-center w-full"><Loader2 className="h-4 w-4 animate-spin text-zinc-400" /></div>
                            ) : dbCourses.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => { setActiveCourseId(c.id); setActiveSem("Sem 1"); }}
                                    className={`flex-1 py-1.5 px-3 whitespace-nowrap rounded-lg text-sm font-semibold transition-all ${activeCourseId === c.id
                                        ? "bg-white text-blue-600 dark:bg-zinc-800 dark:text-blue-400 shadow-sm"
                                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                                        }`}
                                >
                                    {c.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Semester Selection */}
                    <div className="space-y-3 mb-8">
                        <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest pl-2">Semester</p>
                        <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-2">
                            {computedSemesters.map(sem => (
                                <button
                                    key={sem}
                                    onClick={() => setActiveSem(sem)}
                                    className={`py-2 px-3 rounded-xl text-sm font-medium transition-all text-left flex items-center justify-between group ${activeSem === sem
                                        ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-800/50 border shadow-sm"
                                        : "bg-zinc-50 text-zinc-600 border-transparent dark:bg-zinc-950 dark:text-zinc-400 border hover:border-zinc-200 dark:hover:border-zinc-800"
                                        }`}
                                >
                                    {sem}
                                    {activeSem === sem && <CheckCircle2 className="h-4 w-4 shrink-0 transition-transform scale-in-100" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Subject Search (Replaces massive global search) */}
                    <div className="space-y-3 mb-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-zinc-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Find a subject..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                            />
                        </div>
                    </div>

                    {/* Subjects in active semester */}
                    <div className="space-y-3">
                        <div className="space-y-1 h-[250px] overflow-y-auto pr-2 custom-scrollbar relative">
                            {loadingSubjects ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                                </div>
                            ) : availableSubjects.map(subject => (
                                <button
                                    key={subject.id}
                                    onClick={() => setActiveSubjectId(subject.id)}
                                    className={`w-full py-2.5 px-3 rounded-xl text-sm transition-all text-left flex items-center gap-2 ${activeSubjectId === subject.id
                                        ? "bg-zinc-900 text-white font-bold dark:bg-white dark:text-zinc-900 shadow-md"
                                        : "bg-transparent text-zinc-600 font-medium hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                        }`}
                                >
                                    <BookOpen className={`h-4 w-4 shrink-0 ${activeSubjectId === subject.id ? "text-blue-400 dark:text-blue-600" : "text-zinc-400"}`} />
                                    <span className="truncate" title={subject.name}>{subject.name}</span>
                                </button>
                            ))}
                            {!loadingSubjects && availableSubjects.length === 0 && (
                                <div className="text-center py-6 text-sm text-zinc-500">
                                    No subjects found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Pane (Years Grid) */}
            <div className="flex-1 space-y-6 max-w-5xl">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden h-full flex flex-col">
                    {/* Decorative Blob */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative z-10 flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-8">
                            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider rounded-lg border border-zinc-200 dark:border-zinc-700">
                                {activeCourse?.name || "Select Course"}
                            </span>
                            <ChevronRight className="h-4 w-4 text-zinc-400" />
                            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider rounded-lg border border-zinc-200 dark:border-zinc-700">
                                {activeSem}
                            </span>
                        </div>

                        <div className="flex items-start justify-between mb-8 sm:mb-10">
                            <div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-2 tracking-tight">
                                    {dbSubjects.find(s => s.id === activeSubjectId)?.name || "Vault"}
                                </h1>
                                <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 font-medium max-w-xl">
                                    {loadingPapers ? "Locating verified resources..." : `${papers.length} verified past papers available for download.`}
                                </p>
                            </div>

                            {/* View Toggle */}
                            <div className="hidden sm:flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl shrink-0">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white dark:bg-zinc-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"}`}
                                    title="Grid View"
                                >
                                    <LayoutGrid className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white dark:bg-zinc-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"}`}
                                    title="List View"
                                >
                                    <List className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Papers Layout (Grid or List) */}
                        <div className={`relative min-h-[300px] ${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5" : "flex flex-col space-y-4"}`}>
                            {loadingPapers ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-zinc-400">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                    <span className="font-semibold">Loading documents...</span>
                                </div>
                            ) : papers.length > 0 ? (
                                papers.map((paper) => (
                                    <div
                                        key={paper.id}
                                        className={`group bg-zinc-50 border-2 border-zinc-200 dark:bg-zinc-950/50 dark:border-zinc-800 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all ${viewMode === "grid" ? "p-5 flex flex-col justify-between" : "p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6"}`}
                                    >
                                        <div className={viewMode === "list" ? "flex items-center gap-5 flex-1" : ""}>
                                            {/* File Icon */}
                                            <div className={`p-3 bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm border border-zinc-200 dark:border-zinc-800 group-hover:scale-110 transition-transform flex items-center justify-center ${viewMode === "grid" ? "rounded-xl mb-4 w-12 h-12" : "rounded-2xl shrink-0 h-14 w-14"}`}>
                                                <FileText className={`${viewMode === "grid" ? "h-6 w-6" : "h-7 w-7"}`} />
                                            </div>

                                            {/* Info block */}
                                            <div className="flex-1 w-full overflow-hidden">
                                                <div className={`flex ${viewMode === "grid" ? "justify-between" : "items-center gap-3"} mb-1`}>
                                                    <div className="flex items-baseline gap-2">
                                                        <h3 className={`${viewMode === "grid" ? "text-3xl" : "text-2xl"} font-black text-zinc-900 dark:text-white tracking-tight leading-none`}>
                                                            {paper.year}
                                                        </h3>
                                                        <span className="text-sm font-semibold text-zinc-500 hidden sm:inline truncate">{paper.title}</span>
                                                    </div>

                                                    {viewMode === "grid" && (
                                                        <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-md h-min shrink-0">
                                                            {paper.type}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Meta data */}
                                                <div className={`flex items-center text-xs text-zinc-500 dark:text-zinc-400 ${viewMode === "grid" ? "justify-between border-t border-zinc-200 dark:border-zinc-800/60 pt-4 mt-6" : "gap-4 sm:gap-6"}`}>
                                                    {viewMode === "list" && (
                                                        <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 text-xs font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                                                            {paper.type}
                                                        </span>
                                                    )}
                                                    <div className="flex items-center gap-1.5 font-medium">
                                                        <User className="h-3.5 w-3.5" /> <span className="hidden sm:inline truncate max-w-[80px]">{paper.author}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 font-medium">
                                                        <Clock className="h-3.5 w-3.5" /> <span className="hidden sm:inline">{paper.date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`${viewMode === "grid" ? "mt-4" : "shrink-0 w-full sm:w-auto mt-4 sm:mt-0"}`}>
                                            <ClickSpark className="w-full sm:w-auto">
                                                <button
                                                    onClick={() => setSelectedPaper(paper)}
                                                    className={`w-full ${viewMode === "list" ? "sm:w-auto px-6" : ""} py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors active:scale-95 shadow-md shadow-blue-600/20`}
                                                >
                                                    <FileText className="h-4 w-4" />
                                                    View Form
                                                </button>
                                            </ClickSpark>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50/50 dark:bg-zinc-950/50">
                                    <div className="p-4 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-full mb-4">
                                        <FileText className="h-8 w-8 text-zinc-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">No documents available</h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mb-6">
                                        We are actively sourcing resources for {dbSubjects.find(s => s.id === activeSubjectId)?.name || "this subject"}.
                                    </p>
                                    <button className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-2 rounded-xl font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm">
                                        Upload a Paper
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* PDF Viewer Modal Overlay */}
            {selectedPaper && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-zinc-900/80 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-5xl h-full max-h-[90vh] bg-zinc-200 dark:bg-zinc-950 rounded-2xl md:rounded-3xl border border-zinc-300 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                        {/* Toolbar */}
                        <div className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-300 dark:border-zinc-800 flex items-center justify-between px-4 sm:px-6 shrink-0 z-20">
                            <div className="flex items-center gap-4">
                                <div className="p-2 sm:p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 line-clamp-1 max-w-[150px] sm:max-w-md">
                                        {selectedPaper.title}
                                    </h3>
                                    <p className="text-xs text-zinc-500 font-medium">Verified Source • {selectedPaper.downloads || 0} Downloads</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 sm:gap-6">
                                <div className="flex items-center gap-3">
                                    <a href={selectedPaper.downloadLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all active:scale-95">
                                        <Download className="h-4 w-4" /> Download
                                    </a>
                                    <button
                                        onClick={() => setSelectedPaper(null)}
                                        className="p-2 ml-1 rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Viewer Body */}
                        <div className="flex-1 w-full bg-black/5 relative overflow-hidden">
                            <iframe
                                src={selectedPaper.viewLink}
                                className="w-full h-full border-none"
                                allow="autoplay"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
