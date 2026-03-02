"use client";

import { useState } from "react";
import { Search, FolderOpen, ChevronRight, CheckCircle2, FileText, Download, Clock, User, BookOpen, X, Share2, ZoomIn, ChevronDown, ChevronUp, LayoutGrid, List } from "lucide-react";
import ClickSpark from "@/components/reactbits/ClickSpark";

const courses = [
    { id: "bca", name: "BCA" },
    { id: "bscit", name: "B.Sc IT" },
    { id: "bba", name: "BBA" }
];

const semesters = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"];

// Mock Vault data mapped by Subject
const mockVault = {
    "Operating Systems": [
        { id: 101, year: "2023", type: "End Sem", author: "Aman K.", downloads: 840, date: "Jan 12, 2024" },
        { id: 102, year: "2022", type: "End Sem", author: "Admin", downloads: 1250, date: "Dec 05, 2023" },
        { id: 103, year: "2021", type: "Online Format", author: "Priya S.", downloads: 420, date: "Nov 20, 2022" },
        { id: 104, year: "2019", type: "Mid Sem", author: "Admin", downloads: 93, date: "Oct 15, 2020" }
    ],
    "Database Management Systems": [
        { id: 201, year: "2023", type: "End Sem", author: "Admin", downloads: 1024, date: "Feb 02, 2024" },
        { id: 202, year: "2022", type: "End Sem", author: "Rahul C.", downloads: 876, date: "Jan 18, 2023" },
        { id: 203, year: "2020", type: "Mid Sem", author: "Admin", downloads: 310, date: "Dec 10, 2021" }
    ],
    "Data Structures in C": [
        { id: 301, year: "2024", type: "Mid Sem", author: "Admin", downloads: 210, date: "Mar 15, 2024" },
        { id: 302, year: "2023", type: "End Sem", author: "Aman K.", downloads: 1540, date: "Jan 22, 2024" },
        { id: 303, year: "2022", type: "End Sem", author: "Admin", downloads: 920, date: "Feb 05, 2023" }
    ],
    "Computer Networks": [
        { id: 401, year: "2023", type: "End Sem", author: "Priya S.", downloads: 650, date: "Jan 30, 2024" },
        { id: 402, year: "2021", type: "Mid Sem", author: "Admin", downloads: 220, date: "Nov 12, 2022" }
    ]
};

type Paper = {
    id: number;
    year: string;
    type: string;
    author: string;
    downloads: number;
    date: string;
};

export default function VaultPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCourse, setActiveCourse] = useState("bca");
    const [activeSem, setActiveSem] = useState("Sem 3");
    const [activeSubject, setActiveSubject] = useState("Operating Systems");
    const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const availableSubjects = Object.keys(mockVault).filter(subject =>
        subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const papers = mockVault[activeSubject as keyof typeof mockVault] || [];

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
                        <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl">
                            {courses.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => setActiveCourse(c.id)}
                                    className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${activeCourse === c.id
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
                        <div className="grid grid-cols-2 gap-2">
                            {semesters.map(sem => (
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
                        <div className="space-y-1 h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                            {availableSubjects.map(subject => (
                                <button
                                    key={subject}
                                    onClick={() => setActiveSubject(subject)}
                                    className={`w-full py-2.5 px-3 rounded-xl text-sm transition-all text-left flex items-center gap-2 ${activeSubject === subject
                                        ? "bg-zinc-900 text-white font-bold dark:bg-white dark:text-zinc-900 shadow-md"
                                        : "bg-transparent text-zinc-600 font-medium hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                        }`}
                                >
                                    <BookOpen className={`h-4 w-4 shrink-0 ${activeSubject === subject ? "text-blue-400 dark:text-blue-600" : "text-zinc-400"}`} />
                                    <span className="truncate">{subject}</span>
                                </button>
                            ))}
                            {availableSubjects.length === 0 && (
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
                                {courses.find(c => c.id === activeCourse)?.name || activeCourse}
                            </span>
                            <ChevronRight className="h-4 w-4 text-zinc-400" />
                            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider rounded-lg border border-zinc-200 dark:border-zinc-700">
                                {activeSem}
                            </span>
                        </div>

                        <div className="flex items-start justify-between mb-8 sm:mb-10">
                            <div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-2 tracking-tight">
                                    {activeSubject}
                                </h1>
                                <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 font-medium max-w-xl">
                                    {papers.length} verified past papers available for download. Select a year below.
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
                        <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5" : "flex flex-col space-y-4"}>
                            {papers.length > 0 ? (
                                papers.map((paper) => (
                                    <div
                                        key={paper.id}
                                        className={`group bg-zinc-50 border-2 border-zinc-200 dark:bg-zinc-950/50 dark:border-zinc-800 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all ${viewMode === "grid" ? "p-5 flex flex-col justify-between" : "p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6"}`}
                                    >
                                        <div className={viewMode === "list" ? "flex items-center gap-5 flex-1" : ""}>
                                            {/* File Icon */}
                                            <div className={`p-3 bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm border border-zinc-200 dark:border-zinc-800 group-hover:scale-110 transition-transform ${viewMode === "grid" ? "rounded-xl mb-4 w-min" : "rounded-2xl shrink-0"}`}>
                                                <FileText className="h-6 w-6" />
                                            </div>

                                            {/* Info block */}
                                            <div className="flex-1">
                                                <div className={`flex ${viewMode === "grid" ? "justify-between" : "items-center gap-3"} mb-1`}>
                                                    <div className="flex items-baseline gap-2">
                                                        <h3 className={`${viewMode === "grid" ? "text-3xl" : "text-2xl"} font-black text-zinc-900 dark:text-white tracking-tight`}>
                                                            {paper.year}
                                                        </h3>
                                                        <span className="text-sm font-semibold text-zinc-500 hidden sm:inline">PYQ</span>
                                                    </div>

                                                    {viewMode === "grid" && (
                                                        <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-md h-min">
                                                            {paper.type}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Meta data */}
                                                <div className={`flex items-center text-xs text-zinc-500 dark:text-zinc-400 ${viewMode === "grid" ? "justify-between border-t border-zinc-200 dark:border-zinc-800/60 pt-4 mt-8" : "gap-4 sm:gap-6"}`}>
                                                    {viewMode === "list" && (
                                                        <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 text-xs font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                                                            {paper.type}
                                                        </span>
                                                    )}
                                                    <div className="flex items-center gap-1.5 font-medium">
                                                        <User className="h-3.5 w-3.5" /> <span className="hidden sm:inline">{paper.author}</span>
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
                                                    View Document
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
                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">No papers uploaded yet</h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mb-6">
                                        We are actively sourcing papers for this subject. If you have valid PYQs, please upload them!
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
                                        {activeSubject} - {selectedPaper.year}.pdf
                                    </h3>
                                    <p className="text-xs text-zinc-500 font-medium">Verified by: {selectedPaper.author} • {selectedPaper.downloads} Downloads</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 sm:gap-6">
                                <div className="hidden md:flex items-center gap-3 border-r border-zinc-200 dark:border-zinc-800 pr-6 text-zinc-600 dark:text-zinc-400">
                                    <button className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors tooltip" aria-label="Previous Page">
                                        <ChevronUp className="h-5 w-5" />
                                    </button>
                                    <span className="text-sm font-mono font-semibold">1 / 4</span>
                                    <button className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors tooltip" aria-label="Next Page">
                                        <ChevronDown className="h-5 w-5" />
                                    </button>
                                    <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-800 mx-1"></div>
                                    <button className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors tooltip" aria-label="Zoom In">
                                        <ZoomIn className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 dark:text-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors">
                                        <Share2 className="h-4 w-4" /> Share
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all active:scale-95">
                                        <Download className="h-4 w-4" /> Download
                                    </button>
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
                        <div className="flex-1 overflow-y-auto relative bg-zinc-300/50 dark:bg-neutral-950 flex flex-col items-center py-8 px-4 sm:px-8 space-y-8 custom-scrollbar scroll-smooth">

                            {/* Page 1 */}
                            <div className="w-full max-w-3xl bg-white shadow-2xl rounded-sm aspect-[1/1.4] p-8 sm:p-12 md:p-16 relative mx-auto shrink-0 select-text">
                                <div className="w-full h-full flex flex-col text-black">
                                    <div className="text-center border-b-2 border-black/80 pb-4 mb-8">
                                        <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-widest uppercase">Patna University</h1>
                                        <h2 className="text-lg sm:text-xl font-bold mt-2">{courses.find(c => c.id === activeCourse)?.name.toUpperCase()} ({activeSem}) Examination, {selectedPaper.year}</h2>
                                        <h3 className="font-bold mt-1 text-sm sm:text-base">Subject: {activeSubject}</h3>
                                    </div>
                                    <div className="flex justify-between text-sm sm:text-base font-bold mb-10">
                                        <span>Time : 3 Hours</span>
                                        <span>Full Marks : 70</span>
                                    </div>
                                    <div className="space-y-8 font-serif text-sm sm:text-base">
                                        <p className="font-bold italic text-black/80">Candidates are required to give their answers in their own words as far as practicable. Answer any FIVE questions.</p>

                                        <div className="flex gap-4">
                                            <span className="font-bold">1.</span>
                                            <div className="space-y-3">
                                                <p>(a) Fully explain the core concepts of {activeSubject}. Discuss its primary advantages and disadvantages.</p>
                                                <p>(b) Differentiate between the modern implementations and classical approaches regarding this subject matter.</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <span className="font-bold">2.</span>
                                            <div className="space-y-3">
                                                <p>Write a detailed note on the architecture of {activeSubject} systems. Draw well-labeled diagrams where necessary to substantiate your answer.</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <span className="font-bold">3.</span>
                                            <div className="space-y-3">
                                                <p>Explain the significance of error-handling and exception protocols. Provide two concrete real-world use cases.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Page 2 */}
                            <div className="w-full max-w-3xl bg-white shadow-2xl rounded-sm aspect-[1/1.4] p-8 sm:p-12 md:p-16 relative mx-auto shrink-0 select-text">
                                <div className="w-full h-full flex flex-col text-black font-serif text-sm sm:text-base">
                                    <div className="flex justify-between text-xs font-bold text-black/50 mb-10">
                                        <span>{activeSubject}</span>
                                        <span>Page 2</span>
                                    </div>
                                    <div className="space-y-8">
                                        <div className="flex gap-4">
                                            <span className="font-bold">4.</span>
                                            <div className="space-y-3">
                                                <p>Define the following terms concisely:</p>
                                                <ul className="list-[lower-roman] pl-6 space-y-2 font-medium">
                                                    <li>Throughput scaling</li>
                                                    <li>Latency bottlenecks</li>
                                                    <li>Concurrency overhead</li>
                                                    <li>Redundancy models</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <span className="font-bold">5.</span>
                                            <div className="space-y-3">
                                                <p>A system exhibits sequential degradation under peak load. Propose an algorithmic solution to mitigate this behavior utilizing the caching techniques you studied.</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <span className="font-bold">6.</span>
                                            <div className="space-y-3">
                                                <p>Distinguish between synchronous and asynchronous transmission protocols. Which is superior for real-time streaming data?</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
