"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { createSubjectAction } from "@/actions/management";

type CourseType = {
    id: string;
    name: string;
    totalSemesters: number;
};

type SubjectFormProps = {
    allCourses: CourseType[];
};

export default function CreateSubjectClientForm({ allCourses }: SubjectFormProps) {
    const [selectedCourseId, setSelectedCourseId] = useState<string>("");
    // Find the currently selected course's metadata
    const selectedCourse = allCourses.find((c) => c.id === selectedCourseId);

    // Default to at least 1, max is determined by the course's `totalSemesters` column
    const maxSemesters = selectedCourse?.totalSemesters || 12;

    return (
        <form action={async (formData) => { await createSubjectAction(formData); return; }} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Subject Name(s)</label>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">You can add multiple subjects at once by separating them with commas or new lines.</p>
                    <textarea
                        name="name"
                        required
                        rows={3}
                        placeholder="e.g. Operating Systems, Computer Networks"
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-amber-500/50 outline-none resize-y"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Assign to Course</label>
                    <select
                        name="courseId"
                        required
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-amber-500/50 outline-none appearance-none"
                    >
                        <option value="">Select Course</option>
                        {allCourses.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Semester</label>
                    <select
                        name="semester"
                        required
                        disabled={!selectedCourseId}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-amber-500/50 outline-none appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="">{selectedCourseId ? "Select Semester" : "Select Course First"}</option>
                        {selectedCourseId &&
                            Array.from({ length: maxSemesters }).map((_, i) => (
                                <option key={i} value={`Sem ${i + 1}`}>
                                    Sem {i + 1}
                                </option>
                            ))}
                    </select>
                </div>
            </div>
            <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-all active:scale-95 shadow-md"
            >
                <Plus className="h-4 w-4" /> Add Subject
            </button>
        </form>
    );
}
