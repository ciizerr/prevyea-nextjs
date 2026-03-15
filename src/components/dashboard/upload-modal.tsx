"use client";

import { useState, useRef, useTransition, useEffect } from "react";
import { X, UploadCloud, XCircle, FileType, Loader2, ChevronDown, Sparkles, ShieldCheck } from "lucide-react";
import ClickSpark from "@/components/reactbits/ClickSpark";
import { uploadPYQAction } from "@/actions/upload";
import { getCoursesAction, getSubjectsAction } from "@/actions/curriculum";
import { getUserProfileAction } from "@/actions/user";
import { motion, AnimatePresence } from "framer-motion";

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type CourseOption = { id: string; name: string; totalSemesters: number };

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
    const [isPending, startTransition] = useTransition();
    const [uploadStatus, setUploadStatus] = useState<{ success: boolean; message: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string>("");
    const MAX_FILE_SIZE_MB = 5;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    const [courses, setCourses] = useState<CourseOption[]>([]);
    const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);

    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");
    const [isFetchingSubjects, setIsFetchingSubjects] = useState(false);

    const selectedCourse = courses.find(c => c.id === selectedCourseId);
    const maxSemesters = selectedCourse?.totalSemesters ?? 8;

    useEffect(() => {
        const fetchData = async () => {
            if (isOpen) {
                // Fetch All Courses
                try {
                    const courseRes = await getCoursesAction();
                    if (courseRes.success && courseRes.data) {
                        const raw = courseRes.data as CourseOption[];
                        const unique = Array.from(new Map(raw.map(c => [c.id, c])).values());
                        setCourses(unique);
                    }

                    // Fetch User Profile to pre-fill
                    const profileRes = await getUserProfileAction();
                    if (profileRes.success && profileRes.data?.course) {
                        setSelectedCourseId(profileRes.data.course);
                        setSelectedSemester("Sem 1");
                    }
                } catch (error) {
                    console.error("Error pre-filling modal:", error);
                }
            }
        };
        
        fetchData();

        // If closing, we can reset state deferred to avoid cascading render lint
        if (!isOpen) {
            setTimeout(() => {
                setSelectedCourseId("");
                setSelectedSemester("");
                setSubjects([]);
                setFileName("");
                setUploadStatus(null);
            }, 0);
        }
    }, [isOpen]);

    // Reset semester when course changes (avoids out-of-range semesters)
    const handleCourseChange = (id: string) => {
        setSelectedCourseId(id);
        setSelectedSemester("");
        setSubjects([]);
    };

    const handleSemesterChange = (sem: string) => {
        setSelectedSemester(sem);
        if (selectedCourseId && sem) {
            setIsFetchingSubjects(true);
        }
    };

    // Fetch Subjects when Course + Semester are both selected
    useEffect(() => {
        let isCancelled = false;
        if (selectedCourseId && selectedSemester) {
            setTimeout(() => {
                if (!isCancelled) setIsFetchingSubjects(true);
            }, 0);
            getSubjectsAction(selectedCourseId, selectedSemester).then((res) => {
                if (!isCancelled && res.success && res.data) {
                    setSubjects(res.data as { id: string; name: string }[]);
                }
                if (!isCancelled) setIsFetchingSubjects(false);
            });
        }
        return () => { isCancelled = true; };
    }, [selectedCourseId, selectedSemester]);

    if (!isOpen) return null;

    const handleUpload = async (formData: FormData) => {
        setUploadStatus(null);
        startTransition(async () => {
            const result = await uploadPYQAction(formData);
            if (result.success) {
                setUploadStatus({ success: true, message: "Upload successful. Document sent for review." });
                if (fileInputRef.current) fileInputRef.current.value = "";
                setFileName("");
                setTimeout(() => { onClose(); setUploadStatus(null); }, 2500);
            } else {
                setUploadStatus({ success: false, message: result.error || "Upload failed: Submission rejected." });
            }
        });
    };

    const selectClass = "w-full px-5 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none disabled:opacity-30 disabled:cursor-not-allowed transition-all";
    const labelClass = "block text-[10px] font-black text-zinc-400 dark:text-zinc-500 mb-2 uppercase tracking-[0.2em]";

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xl z-[101]"
                />

                {/* Modal Container */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative z-[102] bg-white dark:bg-[#080808] border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] w-full max-w-xl overflow-hidden flex flex-col max-h-[90dvh]"
                >
                    {/* Interior Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-600/10 blur-[80px] rounded-full pointer-events-none" />
                    
                    {/* Top Bar */}
                    <div className="flex items-center justify-between p-8 border-b border-zinc-100 dark:border-zinc-900">
                        <div className="flex items-center gap-4">
                            <div className="bg-zinc-950 dark:bg-zinc-100 p-3 rounded-2xl shadow-xl">
                                <UploadCloud className="h-6 w-6 text-white dark:text-zinc-900" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter leading-none uppercase">Upload Document</h2>
                                <p className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                                    <ShieldCheck className="h-3 w-3" />
                                    Secure Document Upload
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-2xl transition-all group"
                        >
                            <X className="h-6 w-6 transition-transform group-hover:rotate-90" />
                        </button>
                    </div>

                    {/* Scrollable Form */}
                    <form action={handleUpload} className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                        
                        {/* File Area */}
                        <div className="relative group">
                            <div className={`absolute inset-0 rounded-3xl border-2 border-dashed transition-all duration-500 ${fileName ? "bg-indigo-500/5 border-indigo-500/50" : "bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 group-hover:border-indigo-500/30"}`} />
                            <div className="relative flex flex-col items-center justify-center p-10 text-center pointer-events-none">
                                <motion.div
                                    animate={fileName ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                                    transition={{ duration: 0.5 }}
                                >
                                    <FileType className={`h-12 w-12 mb-4 transition-colors ${fileName ? "text-indigo-500" : "text-zinc-400 opacity-40 group-hover:opacity-100"}`} />
                                </motion.div>
                                {fileName ? (
                                    <div className="space-y-2">
                                        <p className="text-sm font-black text-zinc-900 dark:text-zinc-50 truncate max-w-[280px]">{fileName}</p>
                                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">File ready to upload</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <p className="text-sm font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">Drop PDF or Markdown Here</p>
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-relaxed">Max File Size: 5.0 MB</p>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                name="file"
                                accept="application/pdf,.md"
                                required
                                ref={fileInputRef}
                                onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file && file.size > MAX_FILE_SIZE_BYTES) {
                                        setUploadStatus({ success: false, message: `Error: File size exceeds ${MAX_FILE_SIZE_MB}MB limit.` });
                                        e.target.value = "";
                                        setFileName("");
                                    } else {
                                        setUploadStatus(null);
                                        setFileName(file?.name ?? "");
                                    }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>

                        {/* Metadata Grid */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className={labelClass}>Document Title</label>
                                    <input
                                        name="title"
                                        type="text"
                                        required
                                        placeholder="E.G. OS END SEM 2023"
                                        className="w-full px-5 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-sm font-bold text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-300 dark:placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all uppercase"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className={labelClass}>Document Type</label>
                                    <div className="relative">
                                        <select name="type" required defaultValue="PYQ" className={selectClass}>
                                            <option value="PYQ">Previous Year (PYQ)</option>
                                            <option value="Notes">Study Notes</option>
                                            <option value="Syllabus">Official Syllabus</option>
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-100 dark:border-zinc-800/60 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className={labelClass}>Select Course</label>
                                        <div className="relative">
                                            <select
                                                name="courseId"
                                                required
                                                value={selectedCourseId}
                                                onChange={(e) => handleCourseChange(e.target.value)}
                                                className={selectClass}
                                            >
                                                <option value="" disabled>CHOOSE COURSE</option>
                                                {courses.map((course) => (
                                                    <option key={course.id} value={course.id}>{course.name.toUpperCase()}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className={labelClass}>Semester</label>
                                        <div className="relative">
                                            <select
                                                name="semester"
                                                required
                                                value={selectedSemester}
                                                disabled={!selectedCourseId}
                                                onChange={(e) => handleSemesterChange(e.target.value)}
                                                className={selectClass}
                                            >
                                                <option value="" disabled>SELECT SEM</option>
                                                {Array.from({ length: maxSemesters }, (_, i) => (
                                                    <option key={i} value={`Sem ${i + 1}`}>SEMESTER {i + 1}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className={`${labelClass} flex items-center justify-between`}>
                                        <span>Subject</span>
                                        {isFetchingSubjects && <Loader2 className="h-3 w-3 animate-spin text-indigo-500" />}
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="subjectId"
                                            required
                                            defaultValue=""
                                            disabled={!selectedCourseId || !selectedSemester || isFetchingSubjects}
                                            className={selectClass}
                                        >
                                            <option value="" disabled>
                                                {isFetchingSubjects ? "LOADING SUBJECTS..." : "SELECT SUBJECT"}
                                            </option>
                                            {subjects.map((sub) => (
                                                <option key={sub.id} value={sub.id}>{sub.name.toUpperCase()}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className={labelClass}>Examination Year</label>
                                <input
                                    name="year"
                                    type="number"
                                    required
                                    min="1990"
                                    max={new Date().getFullYear()}
                                    defaultValue={new Date().getFullYear()}
                                    className="w-full px-5 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-sm font-bold text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Confirmation */}
                        {uploadStatus && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`p-6 rounded-3xl border flex items-center gap-4 ${uploadStatus.success ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"}`}
                            >
                                {uploadStatus.success ? <Sparkles className="h-6 w-6 shrink-0" /> : <XCircle className="h-6 w-6 shrink-0" />}
                                <p className="text-xs font-black uppercase tracking-widest leading-relaxed">
                                    {uploadStatus.message}
                                </p>
                            </motion.div>
                        )}

                        {/* Footer Controls */}
                        <div className="pt-6 flex flex-col sm:flex-row items-center justify-end gap-6 text-center sm:text-left">
                            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest hidden sm:block">
                                Files will be reviewed <br /> by a moderator.
                            </p>
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 sm:flex-none px-8 py-4 text-[11px] font-black text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 uppercase tracking-widest transition-colors"
                                >
                                    Cancel
                                </button>
                                <ClickSpark className="flex-1 sm:flex-none">
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="w-full bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-900 px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:pointer-events-none"
                                    >
                                        {isPending
                                            ? <><Loader2 className="h-4 w-4 animate-spin text-white dark:text-zinc-900" /> Uploading...</>
                                            : "Submit Document"}
                                    </button>
                                </ClickSpark>
                            </div>
                        </div>
                    </form>

                    {/* Footer Watermark */}
                    <div className="px-8 py-4 bg-zinc-50 dark:bg-[#0a0a0a] border-t border-zinc-100 dark:border-zinc-900 flex justify-between items-center opacity-40">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">User Session</span>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">PU Library System</span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
