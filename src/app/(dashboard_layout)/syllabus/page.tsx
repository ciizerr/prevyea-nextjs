"use client";

import { useState } from "react";
import { BookOpen, GraduationCap, ChevronRight, CheckCircle2, FileText, Download, Briefcase } from "lucide-react";
import ClickSpark from "@/components/reactbits/ClickSpark";

const courses = [
    { id: "bca", name: "BCA" },
    { id: "bscit", name: "B.Sc IT" },
    { id: "bba", name: "BBA" }
];

const semesters = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"];

// Mock syllabus data
const mockSyllabus = {
    "Operating Systems": {
        description: "Introduction to Operating Systems, Process Management, Memory Management, File Systems, and I/O.",
        units: [
            {
                title: "Unit 1: Introduction",
                topics: ["What is an OS", "Generations of OS", "Types of OS (Batch, Time-sharing, Distributed)"]
            },
            {
                title: "Unit 2: Process Management",
                topics: ["Process Concept", "Process Scheduling", "Inter-process Communication", "Deadlocks (Prevention, Avoidance)"]
            },
            {
                title: "Unit 3: Memory Management",
                topics: ["Logical vs Physical Address Space", "Swapping", "Contiguous Memory Allocation", "Paging", "Segmentation"]
            },
        ],
        books: ["Operating System Concepts by Silberschatz, Galvin", "Modern Operating Systems by Andrew S. Tanenbaum"]
    },
    "Database Management Systems": {
        description: "Core concepts of DBMS, Relational Algebra, SQL, Normalization, and Transaction Processing.",
        units: [
            {
                title: "Unit 1: Basic Concepts",
                topics: ["Data vs Information", "File System vs DBMS", "Three schema architecture", "Data Independence"]
            },
            {
                title: "Unit 2: Data Models (E-R Model)",
                topics: ["Entities", "Attributes", "Relationships", "E-R Diagrams", "Strong and Weak Entities"]
            },
            {
                title: "Unit 3: Relational Algebra",
                topics: ["Select, Project, Cartesian Product", "Set Operations", "Joins (Inner, Outer, Equi)"]
            },
        ],
        books: ["Database System Concepts by Korth", "Fundamentals of Database Systems by Elmasri & Navathe"]
    },
    "Data Structures in C": {
        description: "Fundamental data structures and algorithms implemented in C.",
        units: [
            {
                title: "Unit 1: Basic Structures",
                topics: ["Arrays (1D, 2D)", "Strings", "Pointers and Dynamic Memory Allocation"]
            },
            {
                title: "Unit 2: Linear Data Structures",
                topics: ["Linked Lists (Singly, Doubly, Circular)", "Stacks and their applications", "Queues (Linear, Circular)"]
            },
        ],
        books: ["Data Structures in C by Reema Thareja", "Data Structures using C by Tenenbaum"]
    }
};

export default function SyllabusPage() {
    const [activeCourse, setActiveCourse] = useState("bca");
    const [activeSem, setActiveSem] = useState("Sem 3");
    const [activeSubject, setActiveSubject] = useState("Operating Systems");

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
                        <div className="space-y-1">
                            {Object.keys(mockSyllabus).map(subject => (
                                <button
                                    key={subject}
                                    onClick={() => setActiveSubject(subject)}
                                    className={`w-full py-2.5 px-3 rounded-xl text-sm transition-all text-left flex items-center gap-2 ${activeSubject === subject
                                            ? "bg-zinc-900 text-white font-bold dark:bg-white dark:text-zinc-900 shadow-md"
                                            : "bg-transparent text-zinc-600 font-medium hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                        }`}
                                >
                                    <BookOpen className={`h-4 w-4 shrink-0 ${activeSubject === subject ? "text-indigo-400 dark:text-indigo-600" : "text-zinc-400"}`} />
                                    <span className="truncate">{subject}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Pane */}
            <div className="flex-1 space-y-6 max-w-4xl">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden h-full flex flex-col">
                    {/* Decorative Blob */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none" />

                    <div className="relative z-10 flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider rounded-lg border border-zinc-200 dark:border-zinc-700">
                                {courses.find(c => c.id === activeCourse)?.name || activeCourse}
                            </span>
                            <ChevronRight className="h-4 w-4 text-zinc-400" />
                            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider rounded-lg border border-blue-200 dark:border-blue-800/50">
                                {activeSem}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white mb-4 tracking-tight">
                            {activeSubject}
                        </h1>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl font-medium mb-12">
                            {mockSyllabus[activeSubject as keyof typeof mockSyllabus]?.description}
                        </p>

                        <div className="space-y-10">
                            {mockSyllabus[activeSubject as keyof typeof mockSyllabus]?.units.map((unit, idx) => (
                                <div key={idx} className="group relative pl-6 sm:pl-8 border-l-2 border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors">
                                    <div className="absolute top-0 left-[-9px] w-4 h-4 bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-full group-hover:border-indigo-500 transition-colors mt-1.5" />
                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">{unit.title}</h3>
                                    <ul className="space-y-3">
                                        {unit.topics.map((topic, i) => (
                                            <li key={i} className="flex items-start gap-3 text-zinc-600 dark:text-zinc-400">
                                                <div className="mt-2 w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-600 rounded-full shrink-0" />
                                                <span className="leading-relaxed font-medium text-base">{topic}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 mt-12">
                        {/* Reference Books Section */}
                        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-amber-500" />
                                Recommended Textbooks
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {mockSyllabus[activeSubject as keyof typeof mockSyllabus]?.books.map((book, idx) => (
                                    <div key={idx} className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-500 shrink-0">
                                            <BookOpen className="h-4 w-4" />
                                        </div>
                                        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 line-clamp-2">{book}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                            <ClickSpark className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors active:scale-95 shadow-md shadow-indigo-600/20">
                                    <Download className="h-4 w-4" />
                                    Download Full PDF
                                </button>
                            </ClickSpark>
                            <button className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors active:scale-95 border border-zinc-200 dark:border-zinc-700">
                                <FileText className="h-4 w-4" />
                                View Related PYQs
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
