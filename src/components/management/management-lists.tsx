"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2, CheckSquare, Square } from "lucide-react";
import { ConfirmDeleteButton } from "./confirm-delete-button";

type College = { id: string; name: string; };
type Course = { id: string; name: string; totalSemesters: number; };
type Subject = { id: string; name: string; courseId: string; semester: string; };
type Routine = { id: string; courseId: string; courseName: string | null; semester: string; dayOfWeek: number; schedule: string; };

function BulkHeader({ 
    selectedCount, 
    totalCount, 
    onToggleAll, 
    onBulkDelete, 
    isPending 
}: { 
    selectedCount: number; 
    totalCount: number; 
    onToggleAll: () => void; 
    onBulkDelete: () => void; 
    isPending: boolean 
}) {
    return (
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <button 
                onClick={onToggleAll}
                className="text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 flex items-center gap-1.5 transition-colors"
                type="button"
            >
                {selectedCount === totalCount && totalCount > 0 ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                Select All
            </button>
            {selectedCount > 0 && (
                <button
                    onClick={onBulkDelete}
                    disabled={isPending}
                    type="button"
                    className="text-xs font-bold bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                    {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    Delete Selected ({selectedCount})
                </button>
            )}
        </div>
    );
}

export function CollegeList({ 
    allColleges, 
    deleteAction, 
    bulkDeleteAction 
}: { 
    allColleges: College[]; 
    deleteAction: (id: string) => Promise<unknown>; 
    bulkDeleteAction: (ids: string[]) => Promise<unknown>; 
}) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isPending, startTransition] = useTransition();

    const toggleSelection = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const handleBulkDelete = () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.size} College(s)? This will also remove all college-course associations.`)) return;
        startTransition(async () => {
            await bulkDeleteAction(Array.from(selectedIds));
            setSelectedIds(new Set());
        });
    };

    return (
        <div>
            <BulkHeader 
                selectedCount={selectedIds.size} 
                totalCount={allColleges.length} 
                onToggleAll={() => setSelectedIds(selectedIds.size === allColleges.length ? new Set() : new Set(allColleges.map((c) => c.id)))}
                onBulkDelete={handleBulkDelete}
                isPending={isPending}
            />
            <div className="flex flex-wrap gap-2">
                {allColleges.map(c => {
                    const isSelected = selectedIds.has(c.id);
                    return (
                        <div key={c.id} className="relative group/item flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                checked={isSelected} 
                                onChange={() => toggleSelection(c.id)}
                                className="w-4 h-4 text-indigo-600 rounded border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800"
                            />
                            <span className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${isSelected ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'}`}>
                                {c.name}
                                <ConfirmDeleteButton
                                    label={c.name}
                                    entityType="College"
                                    warning="This will also remove all college-course associations. Subjects and files in those courses may become orphaned."
                                    action={async () => await deleteAction(c.id)}
                                />
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function CourseList({ 
    allCourses, 
    allColleges, 
    allCollegeCourses, 
    deleteAction, 
    bulkDeleteAction 
}: { 
    allCourses: Course[]; 
    allColleges: College[]; 
    allCollegeCourses: { collegeId: string, courseId: string }[]; 
    deleteAction: (id: string) => Promise<unknown>; 
    bulkDeleteAction: (ids: string[]) => Promise<unknown>; 
}) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isPending, startTransition] = useTransition();

    const toggleSelection = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const handleBulkDelete = () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.size} Course(s)? This will delete all subjects and files associated with these courses.`)) return;
        startTransition(async () => {
            await bulkDeleteAction(Array.from(selectedIds));
            setSelectedIds(new Set());
        });
    };

    return (
        <div>
            <BulkHeader 
                selectedCount={selectedIds.size} 
                totalCount={allCourses.length} 
                onToggleAll={() => setSelectedIds(selectedIds.size === allCourses.length ? new Set() : new Set(allCourses.map((c) => c.id)))}
                onBulkDelete={handleBulkDelete}
                isPending={isPending}
            />
            <div className="flex flex-wrap gap-2">
                {allCourses.map(c => {
                    const mappedCols = allCollegeCourses.filter(cc => cc.courseId === c.id)
                        .map(cc => allColleges.find(col => col.id === cc.collegeId)?.name)
                        .filter(Boolean).join(", ");
                    const isSelected = selectedIds.has(c.id);
                    return (
                        <div key={c.id} className="relative group/item flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                checked={isSelected} 
                                onChange={() => toggleSelection(c.id)}
                                className="w-4 h-4 text-emerald-600 rounded border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800"
                            />
                            <span className={`text-xs px-3 py-2 rounded-lg flex flex-col items-start gap-1 shadow-sm relative pr-8 transition-colors ${isSelected ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200/50 dark:border-red-900/30' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30'}`}>
                                <span className="font-black text-sm">{c.name}</span>
                                <span className={`opacity-80 text-[10px] px-2 py-0.5 rounded font-medium border shrink-0 ${isSelected ? 'bg-white dark:bg-red-900/50 border-red-100 dark:border-red-800' : 'bg-white dark:bg-emerald-900/50 border-emerald-100 dark:border-emerald-800'}`}>{mappedCols || "No College Links"}</span>
                                <span className="opacity-80 text-[10px] font-bold">{c.totalSemesters} Semesters</span>
                                <span className="absolute top-2 right-2">
                                    <ConfirmDeleteButton
                                        label={c.name}
                                        entityType="Course"
                                        warning="This will delete all subjects and files associated with this course."
                                        action={async () => await deleteAction(c.id)}
                                        iconSize="md"
                                    />
                                </span>
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function SubjectList({ 
    allSubjects, 
    allCourses, 
    deleteAction, 
    bulkDeleteAction 
}: { 
    allSubjects: Subject[]; 
    allCourses: Course[]; 
    deleteAction: (id: string) => Promise<unknown>; 
    bulkDeleteAction: (ids: string[]) => Promise<unknown>; 
}) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isPending, startTransition] = useTransition();

    const toggleSelection = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const handleBulkDelete = () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.size} Subject(s)? All files uploaded under these subjects will become orphaned.`)) return;
        startTransition(async () => {
            await bulkDeleteAction(Array.from(selectedIds));
            setSelectedIds(new Set());
        });
    };

    return (
        <div>
            <BulkHeader 
                selectedCount={selectedIds.size} 
                totalCount={allSubjects.length} 
                onToggleAll={() => setSelectedIds(selectedIds.size === allSubjects.length ? new Set() : new Set(allSubjects.map((s) => s.id)))}
                onBulkDelete={handleBulkDelete}
                isPending={isPending}
            />
            <div className="flex flex-wrap gap-2">
                {allSubjects.map(s => {
                    const course = allCourses.find(c => c.id === s.courseId);
                    const isSelected = selectedIds.has(s.id);
                    return (
                        <div key={s.id} className="relative group/item flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                checked={isSelected} 
                                onChange={() => toggleSelection(s.id)}
                                className="w-4 h-4 text-amber-600 rounded border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800"
                            />
                            <span className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 relative pr-8 transition-colors ${isSelected ? 'bg-red-50 text-red-800 dark:bg-red-500/10 dark:text-red-400 border border-red-200/50 dark:border-red-900/30' : 'bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30'}`}>
                                <span className="font-bold">{s.name}</span>
                                <span className={`opacity-60 text-[10px] px-1 rounded ${isSelected ? 'bg-red-200/50 dark:bg-black/20' : 'bg-white dark:bg-black/20'}`}>{course?.name} · {s.semester}</span>
                                <span className="absolute top-1/2 -translate-y-1/2 right-2">
                                    <ConfirmDeleteButton
                                        label={`${s.name} (${course?.name} · ${s.semester})`}
                                        entityType="Subject"
                                        warning="All files uploaded under this subject will become orphaned (not visible in Library)."
                                        action={async () => await deleteAction(s.id)}
                                    />
                                </span>
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function RoutineList({ 
    allRoutines, 
    deleteAction 
}: { 
    allRoutines: Routine[]; 
    deleteAction: (id: string) => Promise<unknown>; 
}) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allRoutines.map(r => (
                <div key={r.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 relative group shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <div className="space-y-1">
                            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase rounded">
                                {r.courseName || "Unknown Course"}
                            </span>
                            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{days[r.dayOfWeek]} · {r.semester}</h4>
                        </div>
                        <ConfirmDeleteButton
                            label={`${r.courseName} ${r.semester} ${days[r.dayOfWeek]}`}
                            entityType="Routine Entry"
                            action={async () => await deleteAction(r.id)}
                            iconSize="sm"
                        />
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed italic border-l-2 border-indigo-500/20 pl-3 mt-2">
                        {r.schedule}
                    </div>
                </div>
            ))}
            {allRoutines.length === 0 && (
                <div className="col-span-full py-10 text-center text-zinc-400 font-medium bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                    No routines synced to the platform yet.
                </div>
            )}
        </div>
    );
}
