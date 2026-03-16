"use client";

import { useState, useEffect } from "react";
import { ChevronRight, FileText, Download, BookOpen, Loader2, Sparkles, ArrowRight, Share2 } from "lucide-react";
import ClickSpark from "@/components/reactbits/ClickSpark";
import Link from "next/link";
import { getCoursesAction, getSubjectsAction, getFilesAction } from "@/actions/curriculum";
import PDFViewer from "@/components/pdf-viewer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import MarkdownExportButton from "@/components/markdown-export-button";

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

type SyllabusFile = {
    id: string;
    title: string;
    viewLink: string;
    downloadLink: string;
};

export default function SyllabusPage() {
    const [activeCourseId, setActiveCourseId] = useState<string>("");
    const [activeSem, setActiveSem] = useState<string>("");
    const [activeSubjectId, setActiveSubjectId] = useState<string>("");

    // Dynamic Data States
    const [dbCourses, setDbCourses] = useState<CourseType[]>([]);
    const [dbSubjects, setDbSubjects] = useState<SubjectType[]>([]);
    const [syllabusFile, setSyllabusFile] = useState<SyllabusFile | null>(null);

    // Loading States
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const [loadingSyllabus, setLoadingSyllabus] = useState(false);

    // Markdown state
    const [markdownContent, setMarkdownContent] = useState<string | null>(null);
    const [loadingMarkdown, setLoadingMarkdown] = useState(false);

    // Initial Fetch for Courses
    useEffect(() => {
        async function fetchInitialData() {
            const res = await getCoursesAction();
            if (res.success && res.data) {
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
            setSyllabusFile(null);

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

    // Fetch Syllabus when Subject changes
    useEffect(() => {
        async function fetchSyllabus() {
            if (!activeSubjectId) {
                setSyllabusFile(null);
                setMarkdownContent(null);
                return;
            }
            setLoadingSyllabus(true);
            setMarkdownContent(null);

            const res = await getFilesAction(activeSubjectId, ["Syllabus"]);
            if (res.success && res.data && res.data.length > 0) {
                // Find .md if available (prefer it), otherwise take the first
                const targetFile = res.data.find(f => f.viewLink.endsWith(".md") || f.downloadLink.endsWith(".md")) || res.data[0];

                setSyllabusFile({
                    id: targetFile.id,
                    title: targetFile.title,
                    viewLink: targetFile.viewLink,
                    downloadLink: targetFile.downloadLink
                });
            } else {
                setSyllabusFile(null);
            }
            setLoadingSyllabus(false);
        }
        fetchSyllabus();
    }, [activeSubjectId]);

    const isMarkdown = syllabusFile?.viewLink.endsWith(".md") || syllabusFile?.downloadLink.endsWith(".md");

    // Fetch markdown content directly from Cloudinary (supports CORS)
    useEffect(() => {
        async function loadMarkdown() {
            if (syllabusFile && isMarkdown) {
                setLoadingMarkdown(true);
                try {
                    const url = syllabusFile.downloadLink || syllabusFile.viewLink;
                    const res = await fetch(url);
                    if (res.ok) {
                        const text = await res.text();
                        setMarkdownContent(text);
                    } else {
                        console.error(`Markdown fetch failed: ${res.status} ${res.statusText}`);
                        setMarkdownContent("Failed to load markdown content.");
                    }
                } catch (error) {
                    console.error("Markdown fetch error:", error);
                    setMarkdownContent("Failed to load markdown content.");
                }
                setLoadingMarkdown(false);
            }
        }
        loadMarkdown();
    }, [syllabusFile, isMarkdown]);


    const activeCourse = dbCourses.find(c => c.id === activeCourseId);
    const maxSems = activeCourse?.totalSemesters || 6;
    const computedSemesters = Array.from({ length: maxSems }, (_, i) => `Sem ${i + 1}`);

    return (
        <div className="relative min-h-screen bg-white dark:bg-[#050505] selection:bg-indigo-100 dark:selection:bg-indigo-900/40 pb-20 overflow-x-hidden">
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[100px] rounded-full" />
            </div>

            <main className="max-w-7xl mx-auto px-6 pt-12">
                <div className="flex flex-col lg:flex-row gap-10">
                    
                    {/* Left Sidebar: Curriculum Hub */}
                    <aside className="w-full lg:w-80 shrink-0">
                        <div className="lg:sticky lg:top-28 space-y-8">
                            
                            {/* Branding / Title */}
                            <div className="space-y-1 pl-2">
                                <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter uppercase italic leading-none">Syllabus</h1>
                                <p className="text-[10px] font-black text-blue-500 dark:text-blue-400 tracking-[0.3em] uppercase opacity-70">View Syllabus</p>
                            </div>

                            <div className="bg-zinc-50 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800/60 rounded-[2.5rem] p-6 shadow-2xl space-y-8">
                                
                                {/* Program Selection */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 px-2">
                                        <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                                        <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Select Course</span>
                                    </div>
                                    <div className="flex flex-col gap-2 p-1.5 bg-white dark:bg-zinc-950/50 rounded-3xl border border-zinc-100 dark:border-zinc-800/50">
                                        {loadingCourses ? (
                                            <div className="p-10 flex flex-col items-center justify-center w-full gap-3">
                                                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                                            </div>
                                        ) : dbCourses.map(c => (
                                            <button
                                                key={c.id}
                                                onClick={() => { setActiveCourseId(c.id); setActiveSem("Sem 1"); }}
                                                className={`flex items-center justify-between px-5 py-3 rounded-2xl text-[11px] font-black transition-all group uppercase tracking-widest ${activeCourseId === c.id
                                                    ? "bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xl scale-[1.02]"
                                                    : "text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/80 hover:text-zinc-900 dark:hover:text-zinc-100"
                                                    }`}
                                            >
                                                <span>{c.name}</span>
                                                {activeCourseId === c.id ? <ArrowRight className="h-4 w-4" /> : <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Semester Selection */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 px-2">
                                        <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                                        <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Semester</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto scrollbar-hide pr-1">
                                        {computedSemesters.map(sem => (
                                            <button
                                                key={sem}
                                                onClick={() => setActiveSem(sem)}
                                                className={`py-3 rounded-2xl text-[10px] font-black transition-all text-center uppercase tracking-widest border ${activeSem === sem
                                                    ? "bg-indigo-500 text-white shadow-xl shadow-indigo-500/30 border-transparent"
                                                    : "bg-white dark:bg-zinc-950/30 border-zinc-100 dark:border-zinc-800/60 text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600"
                                                    }`}
                                            >
                                                {sem}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Subject List */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 px-2">
                                        <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
                                        <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Subjects</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto scrollbar-hide pr-1 relative min-h-[100px]">
                                        {loadingSubjects ? (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                                <Loader2 className="h-6 w-6 animate-spin text-blue-500 opacity-20" />
                                            </div>
                                        ) : dbSubjects.length > 0 ? (
                                            dbSubjects.map(subject => (
                                                <button
                                                    key={subject.id}
                                                    onClick={() => setActiveSubjectId(subject.id)}
                                                    className={`w-full py-4 px-4 rounded-xl text-[10px] transition-all text-left flex items-center gap-3 group border ${activeSubjectId === subject.id
                                                        ? "bg-blue-500 text-white font-black border-transparent shadow-lg shadow-blue-500/20"
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
                                                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">No subjects found</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Right Main Content */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-white dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/40 rounded-[3rem] p-6 lg:p-12 shadow-2xl min-h-[calc(100vh-160px)] flex flex-col relative overflow-hidden">
                            
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/[0.03] blur-[100px] -mr-20 -mt-20 pointer-events-none" />

                            <div className="relative z-10 flex flex-col h-full w-full">

                                {/* Top Banner/Actions */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-12 pb-10 border-b border-zinc-100 dark:border-zinc-800/60">
                                    <div className="space-y-4 max-w-2xl text-center sm:text-left">
                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                            <div className="px-4 py-1.5 bg-zinc-100 dark:bg-zinc-900/50 rounded-full border border-zinc-200 dark:border-zinc-800 text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                                                {activeCourse?.name || "Library"}
                                            </div>
                                            <ChevronRight className="h-3 w-3 text-zinc-300" />
                                            <div className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
                                                {activeSem}
                                            </div>
                                            {syllabusFile && (
                                                <div className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20 shadow-sm shrink-0">
                                                    <Sparkles className="w-3 h-3" />
                                                    Verified
                                                </div>
                                            )}
                                        </div>
                                        <h2 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter italic uppercase leading-none">
                                            {dbSubjects.find(s => s.id === activeSubjectId)?.name || "Subject Syllabus"}
                                        </h2>
                                        <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">
                                            {loadingSyllabus ? "Loading..." : syllabusFile ? "Check your subject syllabus here." : "Syllabus not available."}
                                        </p>
                                    </div>

                                    {syllabusFile && (
                                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                                            <ClickSpark className="shrink-0 w-full sm:w-auto">
                                                <button
                                                    onClick={() => {
                                                        const url = `${window.location.origin}/s/${activeSubjectId}`;
                                                        navigator.clipboard.writeText(url);
                                                        toast.success("Link copied to clipboard!");
                                                    }}
                                                    className="w-full sm:w-auto px-6 py-5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 text-[11px] uppercase tracking-widest group shadow-sm"
                                                >
                                                    <Share2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                    Share Syllabus
                                                </button>
                                            </ClickSpark>
                                            <ClickSpark className="shrink-0 w-full sm:w-auto">
                                                {isMarkdown ? (
                                                    <MarkdownExportButton 
                                                        elementId="markdown-content"
                                                        fileName={`${dbSubjects.find(s => s.id === activeSubjectId)?.name || 'Syllabus'} - Syllabus`}
                                                        headerData={{
                                                            title: dbSubjects.find(s => s.id === activeSubjectId)?.name || 'Syllabus',
                                                            course: activeCourse?.name || '',
                                                            semester: activeSem
                                                        }}
                                                    />
                                                ) : (
                                                    <a
                                                        href={syllabusFile.downloadLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-full sm:w-auto px-10 py-5 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95 text-[11px] uppercase tracking-widest"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                        Download Archive
                                                    </a>
                                                )}
                                            </ClickSpark>
                                        </div>
                                    )}

                                </div>

                                {/* Viewer Frame */}
                                <div className="flex-1">
                                    {loadingSyllabus ? (
                                        <div className="h-full flex flex-col items-center justify-center gap-6 py-40">
                                            <div className="relative">
                                                <div className="w-24 h-24 bg-blue-500/10 blur-[80px] rounded-full absolute -inset-6 animate-pulse" />
                                                <Loader2 className="h-12 w-12 animate-spin text-blue-500 relative z-10 opacity-30" />
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 animate-pulse">Loading document...</p>
                                        </div>
                                    ) : syllabusFile ? (
                                        isMarkdown ? (
                                            <>
                                                {loadingMarkdown ? (
                                                    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-400 py-20">
                                                        <Loader2 className="h-10 w-10 animate-spin text-blue-500 opacity-20" />
                                                    </div>
                                                ) : (
                                                    <div id="markdown-content" className="w-full bg-zinc-50/50 dark:bg-zinc-950/30 p-8 md:p-14 rounded-[3rem] border border-zinc-100 dark:border-zinc-800/60 prose prose-zinc dark:prose-invert max-w-none selection:bg-indigo-100 dark:selection:bg-indigo-900/40 shadow-inner overflow-x-auto break-words">
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownContent || ""}</ReactMarkdown>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="h-full min-h-[800px] rounded-[3rem] overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-2xl group relative bg-zinc-100 dark:bg-black">
                                                <PDFViewer url={syllabusFile.viewLink} />
                                            </div>
                                        )
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-zinc-50 dark:bg-zinc-950/20 border-2 border-dashed border-zinc-100 dark:border-zinc-800/40 rounded-[4rem] space-y-8">
                                            <div className="w-28 h-28 bg-white dark:bg-zinc-900/50 rounded-[2.5rem] flex items-center justify-center shadow-xl border border-zinc-100 dark:border-zinc-800 text-zinc-200 dark:text-zinc-800">
                                                <FileText className="h-12 w-12" />
                                            </div>
                                            <div className="space-y-4">
                                                <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter italic uppercase">No Syllabus Found</h3>
                                                <p className="text-zinc-400 dark:text-zinc-500 max-w-xs mx-auto font-medium leading-relaxed">
                                                    The syllabus for {dbSubjects.find(s => s.id === activeSubjectId)?.name || "this subject"} hasn&apos;t been uploaded yet.
                                                </p>
                                            </div>
                                            <Link href="/vault" className="inline-flex items-center gap-3 text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em] hover:gap-5 transition-all">
                                                Go to Vault <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
