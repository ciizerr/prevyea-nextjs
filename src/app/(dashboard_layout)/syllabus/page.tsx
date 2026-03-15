"use client";

import { useState, useEffect } from "react";
import { GraduationCap, ChevronRight, CheckCircle2, FileText, Download, BookOpen, Loader2, Sparkles, ArrowRight } from "lucide-react";
import ClickSpark from "@/components/reactbits/ClickSpark";
import Link from "next/link";
import { getCoursesAction, getSubjectsAction, getFilesAction } from "@/actions/curriculum";
import PDFViewer from "@/components/pdf-viewer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
    const [downloadingPdf, setDownloadingPdf] = useState(false);

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

    const handleDownloadPdf = () => {
        if (!isMarkdown || !syllabusFile) return;

        const mdElement = document.getElementById("markdown-content");
        if (!mdElement) return;

        setDownloadingPdf(true);
        try {
            const subjectName = dbSubjects.find(s => s.id === activeSubjectId)?.name || 'Syllabus';

            const iframe = document.createElement('iframe');
            iframe.style.position = 'fixed';
            iframe.style.right = '0';
            iframe.style.bottom = '0';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = '0';
            document.body.appendChild(iframe);

            const iframeDoc = iframe.contentWindow?.document;
            if (!iframeDoc) throw new Error("Could not create iframe");

            iframeDoc.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${subjectName}</title>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #000; padding: 2cm; line-height: 1.6; }
                        h1, h2, h3, h4 { color: #000; margin-top: 24px; margin-bottom: 16px; font-weight: 600; }
                        h1 { font-size: 2em; border-bottom: 1px solid #ccc; padding-bottom: 0.3em; margin-top: 0; }
                        h2 { font-size: 1.5em; border-bottom: 1px solid #ccc; padding-bottom: 0.3em; margin-top: 32px; }
                        p { margin-bottom: 16px; font-size: 12pt; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 11pt; }
                        th, td { border: 1px solid #000; padding: 8px 12px; text-align: left; }
                        th { font-weight: 600; }
                        ul, ol { margin-bottom: 16px; padding-left: 32px; font-size: 12pt; }
                        li { margin-bottom: 8px; }
                        a { color: #000; text-decoration: underline; }
                        blockquote { border-left: 4px solid #ccc; padding-left: 16px; color: #333; font-style: italic; margin: 0 0 16px 0; }
                        code { font-family: monospace; font-size: 0.9em; }
                        pre { padding: 16px; border: 1px solid #ccc; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word; }
                        .print-header { text-align: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid #000; }
                        .metadata { font-size: 11pt; color: #555; }
                        @media print {
                            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                            @page { margin: 1cm; }
                        }
                    </style>
                </head>
                <body>
                    <div class="print-header">
                        <h1>${subjectName}</h1>
                        <div class="metadata">
                            <strong>Course:</strong> ${activeCourse?.name || ''} | <strong>Semester:</strong> ${activeSem}
                        </div>
                    </div>
                    ${mdElement.innerHTML}
                </body>
                </html>
            `);
            iframeDoc.close();

            iframe.onload = () => {
                try {
                    iframe.contentWindow?.focus();
                    iframe.contentWindow?.print();
                } catch (e) {
                    console.error("Print failed:", e);
                } finally {
                    setTimeout(() => {
                        document.body.removeChild(iframe);
                        setDownloadingPdf(false);
                    }, 1000);
                }
            };
        } catch (error) {
            console.error("Failed to generate PDF", error);
            alert("Failed to initialize print window.");
            setDownloadingPdf(false);
        }
    };

    const activeCourse = dbCourses.find(c => c.id === activeCourseId);
    const maxSems = activeCourse?.totalSemesters || 6;
    const computedSemesters = Array.from({ length: maxSems }, (_, i) => `Sem ${i + 1}`);

    return (
        <div className="relative min-h-screen animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20 selection:bg-indigo-100 dark:selection:bg-indigo-900/40">

            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-500/5 blur-[100px] rounded-full" />
            </div>

            <main className="max-w-screen-2xl mx-auto px-6 pt-12 space-y-12">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 text-center md:text-left">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest">
                            <BookOpen className="w-3.5 h-3.5" />
                            Official Curriculum
                        </div>

                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">

                    {/* Left Navigation Hub */}
                    <div className="w-full lg:w-72 shrink-0 space-y-6">
                        <div className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-800/60 rounded-[2.5rem] p-6 shadow-2xl shadow-indigo-500/5 lg:sticky lg:top-24 space-y-8">

                            {/* Course Selection */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pl-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Select Program</p>
                                </div>
                                <div className="flex flex-col gap-2 bg-zinc-100/50 dark:bg-zinc-900/50 p-2 rounded-3xl border border-zinc-200/40 dark:border-zinc-800/40">
                                    {loadingCourses ? (
                                        <div className="p-10 flex flex-col items-center justify-center w-full gap-3">
                                            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Loading courses</span>
                                        </div>
                                    ) : dbCourses.map(c => (
                                        <button
                                            key={c.id}
                                            onClick={() => { setActiveCourseId(c.id); setActiveSem("Sem 1"); }}
                                            className={`flex items-center justify-between px-5 py-3 rounded-2xl text-sm font-black transition-all group ${activeCourseId === c.id
                                                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xl"
                                                : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900/80 hover:text-zinc-900 dark:hover:text-zinc-100"
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
                                <div className="flex items-center gap-2 pl-2">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Select Semester</p>
                                </div>
                                <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-2 scrollbar-hide">
                                    {computedSemesters.map(sem => (
                                        <button
                                            key={sem}
                                            onClick={() => setActiveSem(sem)}
                                            className={`py-3 px-4 rounded-2xl text-xs font-black transition-all text-left flex items-center justify-between group uppercase tracking-widest ${activeSem === sem
                                                ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/30"
                                                : "bg-zinc-50 dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                }`}
                                        >
                                            {sem}
                                            {activeSem === sem && <CheckCircle2 className="h-4 w-4 shrink-0 transition-transform scale-in-100" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Subjects Selection */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pl-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Subject List</p>
                                </div>
                                <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide relative min-h-[100px]">
                                    {loadingSubjects ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                                        </div>
                                    ) : dbSubjects.length > 0 ? (
                                        dbSubjects.map(subject => (
                                            <button
                                                key={subject.id}
                                                onClick={() => setActiveSubjectId(subject.id)}
                                                className={`w-full py-3 px-4 rounded-2xl text-sm transition-all text-left flex items-center gap-3 group ${activeSubjectId === subject.id
                                                    ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-black border border-blue-100 dark:border-blue-500/20"
                                                    : "bg-transparent text-zinc-500 font-bold hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
                                                    }`}
                                            >
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${activeSubjectId === subject.id ? "bg-blue-600 text-white" : "bg-zinc-100 dark:bg-zinc-900"}`}>
                                                    <BookOpen className="h-4 w-4" />
                                                </div>
                                                <span className="truncate flex-1 tracking-tight" title={subject.name}>{subject.name}</span>
                                                {activeSubjectId === subject.id && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="text-center py-10">
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">No modules found</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Display */}
                    <div className="flex-1 min-h-[600px] lg:h-[calc(100vh-140px)] lg:sticky lg:top-24">
                        <div className="h-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-[2.5rem] p-5 md:p-8 shadow-2xl shadow-zinc-200/20 dark:shadow-none relative overflow-hidden flex flex-col">

                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 blur-[100px] -mr-20 -mt-20 pointer-events-none" />

                            <div className="relative z-10 flex flex-col h-full w-full">

                                {/* Top Banner/Actions */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800/60">
                                    <div className="space-y-2 max-w-2xl text-center sm:text-left">
                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                            <div className="flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                                <GraduationCap className="w-3 h-3" />
                                                {activeCourse?.name || "Unselected"}
                                            </div>
                                            <ChevronRight className="h-3 w-3 text-zinc-300" />
                                            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-500/10 rounded-lg border border-blue-100 dark:border-blue-500/20 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                                                {activeSem}
                                            </div>
                                            {syllabusFile && (
                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-500/10 rounded-lg border border-amber-100 dark:border-amber-500/20 text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest shrink-0">
                                                    <Sparkles className="w-3 h-3" />
                                                    Verified
                                                </div>
                                            )}
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
                                            {dbSubjects.find(s => s.id === activeSubjectId)?.name || "Subject Syllabus"}
                                        </h2>
                                        <p className="text-sm font-medium text-zinc-500 max-w-xl">
                                            {loadingSyllabus ? "Loading syllabus..." : syllabusFile ? "Official verified syllabus for the current session" : "The curriculum for this subject has not been uploaded yet."}
                                        </p>
                                    </div>

                                    {syllabusFile && (
                                        <ClickSpark className="shrink-0 w-full sm:w-auto">
                                            {isMarkdown ? (
                                                <button
                                                    onClick={handleDownloadPdf}
                                                    disabled={downloadingPdf || loadingMarkdown}
                                                    className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-2xl shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-50 text-sm italic"
                                                >
                                                    {downloadingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                                    {downloadingPdf ? "Generating..." : "Export as PDF"}
                                                </button>
                                            ) : (
                                                <a
                                                    href={syllabusFile.downloadLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-2xl shadow-indigo-500/30 transition-all active:scale-95 text-sm italic"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    Download Syllabus
                                                </a>
                                            )}
                                        </ClickSpark>
                                    )}
                                </div>

                                {/* Viewer Frame */}
                                <div className="flex-1 min-h-0">
                                    {loadingSyllabus ? (
                                        <div className="h-full flex flex-col items-center justify-center gap-4 text-zinc-400">
                                            <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] flex items-center justify-center shadow-inner">
                                                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Loading document</p>
                                        </div>
                                    ) : syllabusFile ? (
                                        isMarkdown ? (
                                            <div className="h-full flex flex-col">
                                                {loadingMarkdown ? (
                                                    <div className="h-full flex flex-col items-center justify-center gap-4 text-zinc-400">
                                                        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                                                        <span className="text-[10px] font-black tracking-widest uppercase">Loading content</span>
                                                    </div>
                                                ) : (
                                                    <div id="markdown-content" className="h-full bg-zinc-50/50 dark:bg-zinc-900/30 p-6 md:p-10 rounded-[2rem] border border-zinc-200/60 dark:border-zinc-800/60 prose prose-indigo dark:prose-invert max-w-none overflow-y-auto scrollbar-hide selection:bg-indigo-200 dark:selection:bg-indigo-900/40">
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownContent || ""}</ReactMarkdown>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="h-full rounded-[2.5rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 group relative">
                                                <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/20 to-transparent pointer-events-none z-10" />
                                                <PDFViewer url={syllabusFile.viewLink} />
                                            </div>
                                        )
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-zinc-50 dark:bg-zinc-900/20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem] space-y-6">
                                            <div className="w-24 h-24 bg-white dark:bg-zinc-900 rounded-[2rem] flex items-center justify-center shadow-xl border border-zinc-100 dark:border-zinc-800">
                                                <FileText className="h-10 w-10 text-zinc-300" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">Syllabus Unavailable</h3>
                                                <p className="text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto font-medium">
                                                    We haven&apos;t received the syllabus for {dbSubjects.find(s => s.id === activeSubjectId)?.name || "this subject"} yet.
                                                </p>
                                            </div>
                                            <Link href="/vault" className="inline-flex items-center gap-2 text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:gap-3 transition-all">
                                                Explore Vault Archives <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* Spacing at bottom */}
                                <div className="mt-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
