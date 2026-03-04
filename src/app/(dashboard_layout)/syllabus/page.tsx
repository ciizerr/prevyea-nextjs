"use client";

import { useState, useEffect } from "react";
import { GraduationCap, ChevronRight, CheckCircle2, FileText, Download, BookOpen, Loader2 } from "lucide-react";
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
                return;
            }
            setLoadingSyllabus(true);
            const res = await getFilesAction(activeSubjectId, ["Syllabus"]);
            if (res.success && res.data && res.data.length > 0) {
                // Pick the first syllabus uploaded
                const file = res.data[0];
                setSyllabusFile({
                    id: file.id,
                    title: file.title,
                    viewLink: file.viewLink,
                    downloadLink: file.downloadLink
                });
            } else {
                setSyllabusFile(null);
            }
            setLoadingSyllabus(false);
        }
        fetchSyllabus();
    }, [activeSubjectId]);

    const activeCourse = dbCourses.find(c => c.id === activeCourseId);
    const maxSems = activeCourse?.totalSemesters || 6;
    const computedSemesters = Array.from({ length: maxSems }, (_, i) => `Sem ${i + 1}`);


    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

            {/* Left Sidebar (Sticky Menu) */}
            <div className="w-full lg:w-80 shrink-0 space-y-6">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm sticky top-24">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-6">
                        <GraduationCap className="h-5 w-5 text-indigo-500" />
                        Curriculum
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
                                        ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50 border shadow-sm"
                                        : "bg-zinc-50 text-zinc-600 border-transparent dark:bg-zinc-950 dark:text-zinc-400 border hover:border-zinc-200 dark:hover:border-zinc-800"
                                        }`}
                                >
                                    {sem}
                                    {activeSem === sem && <CheckCircle2 className="h-4 w-4 shrink-0 transition-transform scale-in-100" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Subjects in active semester */}
                    <div className="space-y-3">
                        <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest pl-2">Subjects</p>
                        <div className="space-y-1 h-[250px] overflow-y-auto pr-2 custom-scrollbar relative">
                            {loadingSubjects ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                                </div>
                            ) : dbSubjects.map(subject => (
                                <button
                                    key={subject.id}
                                    onClick={() => setActiveSubjectId(subject.id)}
                                    className={`w-full py-2.5 px-3 rounded-xl text-sm transition-all text-left flex items-center gap-2 ${activeSubjectId === subject.id
                                        ? "bg-zinc-900 text-white font-bold dark:bg-white dark:text-zinc-900 shadow-md"
                                        : "bg-transparent text-zinc-600 font-medium hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                        }`}
                                >
                                    <BookOpen className={`h-4 w-4 shrink-0 ${activeSubjectId === subject.id ? "text-indigo-400 dark:text-indigo-600" : "text-zinc-400"}`} />
                                    <span className="truncate" title={subject.name}>{subject.name}</span>
                                </button>
                            ))}
                            {!loadingSubjects && dbSubjects.length === 0 && (
                                <div className="text-center py-6 text-sm text-zinc-500">
                                    No subjects found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Pane */}
            <div className="flex-1 space-y-6 lg:max-w-[calc(100vw-24rem)] mt-6 lg:mt-0">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col shadow-sm relative overflow-hidden h-full min-h-[600px] lg:h-[calc(100vh-120px)] lg:sticky lg:top-24">
                    {/* Decorative Blob */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none" />

                    <div className="relative z-10 flex flex-col h-full w-full">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
                            <div>
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider rounded-lg border border-zinc-200 dark:border-zinc-700">
                                        {activeCourse?.name || "Select Course"}
                                    </span>
                                    <ChevronRight className="h-4 w-4 text-zinc-400" />
                                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider rounded-lg border border-blue-200 dark:border-blue-800/50">
                                        {activeSem}
                                    </span>
                                </div>

                                <h1 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white mb-4 tracking-tight">
                                    {dbSubjects.find(s => s.id === activeSubjectId)?.name || "Syllabus"}
                                </h1>
                                <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl font-medium">
                                    {loadingSyllabus ? "Locating syllabus document..." : syllabusFile ? "Official Curriculum & Syllabus Document" : "No syllabus document found for this subject."}
                                </p>
                            </div>

                            {syllabusFile && (
                                <ClickSpark className="shrink-0 w-full sm:w-auto">
                                    <a
                                        href={syllabusFile.downloadLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20"
                                    >
                                        <Download className="h-4 w-4" />
                                        Download PDF
                                    </a>
                                </ClickSpark>
                            )}
                        </div>

                        {/* Interactive Viewer Body */}
                        <div className="flex-1 w-full bg-black/5 dark:bg-black/20 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center border border-zinc-200 dark:border-zinc-800/60 mt-2">
                            {loadingSyllabus ? (
                                <div className="flex flex-col items-center justify-center gap-4 text-zinc-400">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                    <span className="font-semibold text-sm">Loading document...</span>
                                </div>
                            ) : syllabusFile ? (
                                <iframe
                                    src={syllabusFile.viewLink}
                                    className="w-full h-full border-none"
                                    allow="autoplay"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center px-6 text-center">
                                    <div className="p-4 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-full mb-4">
                                        <FileText className="h-8 w-8 text-zinc-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">No Syllabus Uploaded</h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mb-6">
                                        We couldn&apos;t locate a verified syllabus for {dbSubjects.find(s => s.id === activeSubjectId)?.name || "this subject"}.
                                    </p>
                                    <a href="/vault" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                                        Check Vault for PYQs instead
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
