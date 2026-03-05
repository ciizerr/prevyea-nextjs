"use client";

import { useState, useRef, useTransition, useEffect } from "react";
import { X, UploadCloud, CheckCircle2, XCircle, FileType, Loader2, ChevronDown } from "lucide-react";
import ClickSpark from "@/components/reactbits/ClickSpark";
import { uploadPYQAction } from "@/actions/upload";
import { getCoursesAction, getSubjectsAction } from "@/actions/curriculum";

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

    // Dynamic Curriculum State
    const [courses, setCourses] = useState<CourseOption[]>([]);
    const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);

    // User Selection State
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");
    const [isFetchingSubjects, setIsFetchingSubjects] = useState(false);

    const selectedCourse = courses.find(c => c.id === selectedCourseId);
    const maxSemesters = selectedCourse?.totalSemesters ?? 8;

    // Fetch Courses on Open — deduplicate because of M2M join
    useEffect(() => {
        if (isOpen) {
            getCoursesAction().then((res) => {
                if (res.success && res.data) {
                    const raw = res.data as CourseOption[];
                    const unique = Array.from(new Map(raw.map(c => [c.id, c])).values());
                    setCourses(unique);
                }
            });
        }
    }, [isOpen]);

    // Reset semester when course changes (avoids out-of-range semesters)
    useEffect(() => {
        setSelectedSemester("");
        setSubjects([]);
    }, [selectedCourseId]);

    // Fetch Subjects when Course + Semester are both selected
    useEffect(() => {
        if (selectedCourseId && selectedSemester) {
            setIsFetchingSubjects(true);
            getSubjectsAction(selectedCourseId, selectedSemester).then((res) => {
                if (res.success && res.data) setSubjects(res.data as { id: string; name: string }[]);
                setIsFetchingSubjects(false);
            });
        } else {
            setSubjects([]);
        }
    }, [selectedCourseId, selectedSemester]);

    if (!isOpen) return null;

    const handleUpload = async (formData: FormData) => {
        setUploadStatus(null);
        startTransition(async () => {
            const result = await uploadPYQAction(formData);
            if (result.success) {
                setUploadStatus({ success: true, message: "Uploaded! Awaiting moderator approval." });
                if (fileInputRef.current) fileInputRef.current.value = "";
                setFileName("");
                setTimeout(() => { onClose(); setUploadStatus(null); }, 2000);
            } else {
                setUploadStatus({ success: false, message: result.error || "Upload failed." });
            }
        });
    };

    const selectClass = "w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none disabled:opacity-50 disabled:cursor-not-allowed";
    const labelClass = "block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 max-h-[95vh] overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800/60 sticky top-0 bg-white dark:bg-zinc-950 z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 dark:bg-blue-500/10 p-2 rounded-xl text-blue-600 dark:text-blue-500">
                            <UploadCloud className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Upload Document</h2>
                            <p className="text-xs text-zinc-500 font-medium mt-0.5">Submitted for moderator review</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body Form */}
                <form action={handleUpload} className="p-6 space-y-5">

                    {/* File Drop Zone */}
                    <div className="relative group cursor-pointer">
                        <div className={`absolute inset-0 rounded-xl border-2 border-dashed transition-colors ${fileName ? "bg-blue-50 dark:bg-blue-500/10 border-blue-400 dark:border-blue-500/50" : "bg-zinc-50 dark:bg-zinc-900/40 border-zinc-300 dark:border-zinc-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/5 group-hover:border-blue-300 dark:group-hover:border-blue-500/30"}`} />
                        <div className="relative flex flex-col items-center justify-center p-7 text-center pointer-events-none">
                            <FileType className={`h-8 w-8 mb-2 transition-colors ${fileName ? "text-blue-500" : "text-zinc-400 group-hover:text-blue-400"}`} />
                            {fileName ? (
                                <>
                                    <p className="text-sm font-bold text-blue-700 dark:text-blue-400 truncate max-w-xs">{fileName}</p>
                                    <p className="text-xs text-blue-500/70 mt-1">Click to change file</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Click to select PDF or MD</p>
                                    <p className="text-xs font-medium text-zinc-400 mt-1">Max 5 MB · PDF or Markdown allowed</p>
                                </>
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
                                    setUploadStatus({ success: false, message: `File is too large. Max size is ${MAX_FILE_SIZE_MB} MB.` });
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

                    {/* Title + Type */}
                    <div className="grid grid-cols-[2fr_1fr] gap-4">
                        <div>
                            <label className={labelClass}>Document Title</label>
                            <input
                                name="title"
                                type="text"
                                required
                                placeholder="e.g. OS End Sem 2023"
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Type</label>
                            <div className="relative">
                                <select name="type" required defaultValue="PYQ" className={selectClass}>
                                    <option value="PYQ">PYQ</option>
                                    <option value="Notes">Notes</option>
                                    <option value="Syllabus">Syllabus</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            </div>
                        </div>
                    </div>

                    {/* Course + Semester */}
                    <div>
                        <p className={labelClass}>Curriculum Context</p>
                        <div className="grid grid-cols-2 gap-3 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
                            <div>
                                <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Course</label>
                                <div className="relative">
                                    <select
                                        name="courseId"
                                        required
                                        value={selectedCourseId}
                                        onChange={(e) => setSelectedCourseId(e.target.value)}
                                        className={selectClass}
                                    >
                                        <option value="" disabled>Select course</option>
                                        {courses.map((course) => (
                                            <option key={course.id} value={course.id}>{course.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">
                                    Semester {selectedCourse ? `(1–${maxSemesters})` : ""}
                                </label>
                                <div className="relative">
                                    <select
                                        name="semester"
                                        required
                                        value={selectedSemester}
                                        disabled={!selectedCourseId}
                                        onChange={(e) => setSelectedSemester(e.target.value)}
                                        className={selectClass}
                                    >
                                        <option value="" disabled>{!selectedCourseId ? "Pick course first" : "Select semester"}</option>
                                        {Array.from({ length: maxSemesters }, (_, i) => (
                                            <option key={i} value={`Sem ${i + 1}`}>Semester {i + 1}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                </div>
                            </div>

                            {/* Context breadcrumb */}
                            {(selectedCourse || selectedSemester) && (
                                <div className="col-span-2 flex items-center gap-2 pt-1 text-xs text-zinc-400 font-medium">
                                    <span className={selectedCourse ? "text-blue-600 dark:text-blue-400 font-bold" : ""}>{selectedCourse?.name ?? "—"}</span>
                                    <span>›</span>
                                    <span className={selectedSemester ? "text-blue-600 dark:text-blue-400 font-bold" : ""}>{selectedSemester || "—"}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Subject + Year */}
                    <div className="grid grid-cols-[2fr_1fr] gap-4">
                        <div>
                            <label className={`${labelClass} flex items-center justify-between`}>
                                <span>Subject</span>
                                {isFetchingSubjects && <Loader2 className="h-3 w-3 animate-spin text-blue-500" />}
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
                                        {!selectedCourseId
                                            ? "Select a course first"
                                            : !selectedSemester
                                                ? "Select a semester first"
                                                : isFetchingSubjects
                                                    ? "Loading subjects..."
                                                    : subjects.length === 0
                                                        ? "No subjects found"
                                                        : "Select subject"}
                                    </option>
                                    {subjects.map((sub) => (
                                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Year</label>
                            <input
                                name="year"
                                type="number"
                                required
                                min="1990"
                                max={new Date().getFullYear()}
                                defaultValue={new Date().getFullYear()}
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>
                    </div>

                    {/* Status Message */}
                    {uploadStatus && (
                        <div className={`p-4 rounded-xl border flex items-center gap-3 ${uploadStatus.success ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400" : "bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/20 text-red-700 dark:text-red-400"}`}>
                            {uploadStatus.success ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <XCircle className="h-5 w-5 shrink-0" />}
                            <p className="text-sm font-semibold">{uploadStatus.message}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="pt-2 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <ClickSpark>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending
                                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
                                    : "Submit for Verification"}
                            </button>
                        </ClickSpark>
                    </div>

                </form>
            </div>
        </div>
    );
}
