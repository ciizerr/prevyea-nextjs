"use client";

import { useState, useRef, useTransition, useEffect } from "react";
import { X, UploadCloud, CheckCircle2, XCircle, FileType, Loader2 } from "lucide-react";
import ClickSpark from "@/components/reactbits/ClickSpark";
import { uploadPYQAction } from "@/actions/upload";
import { getCoursesAction, getSubjectsAction } from "@/actions/curriculum";

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
    const [isPending, startTransition] = useTransition();
    const [uploadStatus, setUploadStatus] = useState<{ success: boolean; message: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Dynamic Curriculum State
    const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);
    const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);

    // User Selection State
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");
    const [isFetchingSubjects, setIsFetchingSubjects] = useState(false);

    // Fetch Courses on Mount
    useEffect(() => {
        if (isOpen) {
            getCoursesAction().then((res) => {
                if (res.success && res.data) setCourses(res.data);
            });
        }
    }, [isOpen]);

    // Fetch Subjects when Course or Semester changes
    useEffect(() => {
        const fetchSubjects = async () => {
            if (selectedCourseId && selectedSemester) {
                setIsFetchingSubjects(true);
                const res = await getSubjectsAction(selectedCourseId, selectedSemester);
                if (res.success && res.data) setSubjects(res.data);
                setIsFetchingSubjects(false);
            } else {
                setSubjects([]); // Clear subjects if prereqs are missing
            }
        };
        fetchSubjects();
    }, [selectedCourseId, selectedSemester]);

    if (!isOpen) return null;

    const handleUpload = async (formData: FormData) => {
        setUploadStatus(null);
        startTransition(async () => {
            const result = await uploadPYQAction(formData);
            if (result.success) {
                setUploadStatus({ success: true, message: "PYQ Uploaded! Pending Moderator Approval." });
                if (fileInputRef.current) fileInputRef.current.value = "";
                // Automatically close modal after 2 seconds on success
                setTimeout(() => {
                    onClose();
                    setUploadStatus(null);
                }, 2000);
            } else {
                setUploadStatus({ success: false, message: result.error || "Upload failed." });
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800/60">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 dark:bg-blue-500/10 p-2 rounded-xl text-blue-600 dark:text-blue-500">
                            <UploadCloud className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Upload Document</h2>
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

                    {/* File Selection Zone */}
                    <div className="relative group cursor-pointer">
                        <div className="absolute inset-0 bg-blue-50 dark:bg-blue-500/5 rounded-xl border-2 border-dashed border-blue-200 dark:border-blue-500/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/10 group-hover:border-blue-400 dark:group-hover:border-blue-500/40 transition-colors"></div>
                        <div className="relative flex flex-col items-center justify-center p-8 text-center pointer-events-none">
                            <FileType className="h-8 w-8 text-blue-500 mb-3" />
                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Click to select PDF</p>
                            <p className="text-xs font-medium text-zinc-500 mt-1">Maximum file size: 50MB</p>
                        </div>
                        <input
                            type="file"
                            name="file"
                            accept="application/pdf"
                            required
                            ref={fileInputRef}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>

                    {/* Metadata Grid */}
                    <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-[2fr_1fr] gap-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">Document Title</label>
                                <input
                                    name="title"
                                    type="text"
                                    required
                                    placeholder="e.g. Operating Systems End Sem 2022"
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">Type</label>
                                <select
                                    name="type"
                                    required
                                    defaultValue="PYQ"
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                                >
                                    <option value="PYQ">PYQ</option>
                                    <option value="Notes">Notes</option>
                                    <option value="Syllabus">Syllabus</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">Course</label>
                                <select
                                    name="courseId"
                                    required
                                    value={selectedCourseId}
                                    onChange={(e) => setSelectedCourseId(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                                >
                                    <option value="" disabled>Select Course</option>
                                    {courses.map((course) => (
                                        <option key={course.id} value={course.id}>{course.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">Semester</label>
                                <select
                                    name="semester"
                                    required
                                    value={selectedSemester}
                                    onChange={(e) => setSelectedSemester(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                                >
                                    <option value="" disabled>Select Sem</option>
                                    {/* Mocking Semesters 1 to 8 */}
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <option key={i} value={`Sem ${i + 1}`}>Semester {i + 1}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-[2fr_1fr] gap-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider flex items-center justify-between">
                                    <span>Subject Name</span>
                                    {isFetchingSubjects && <Loader2 className="h-3 w-3 animate-spin text-blue-500" />}
                                </label>
                                <select
                                    name="subjectId"
                                    required
                                    defaultValue=""
                                    disabled={!selectedCourseId || !selectedSemester || isFetchingSubjects}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="" disabled>
                                        {!selectedCourseId || !selectedSemester ? "Select Course & Sem First" : "Select Subject"}
                                    </option>
                                    {subjects.map((sub) => (
                                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">Year</label>
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
                    </div>

                    {/* Status Message */}
                    {uploadStatus && (
                        <div className={`p-4 rounded-xl border flex items-center gap-3 ${uploadStatus.success ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400" : "bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/20 text-red-700 dark:text-red-400"}`}>
                            {uploadStatus.success ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <XCircle className="h-5 w-5 shrink-0" />}
                            <p className="text-sm font-semibold">{uploadStatus.message}</p>
                        </div>
                    )}

                    {/* Submit Actions */}
                    <div className="pt-4 flex items-center justify-end gap-3">
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
                                {isPending ? "Uploading..." : "Submit for Verification"}
                            </button>
                        </ClickSpark>
                    </div>

                </form>
            </div>
        </div>
    );
}
