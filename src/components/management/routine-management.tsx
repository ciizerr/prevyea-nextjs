"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle2, XCircle, Loader2, Info, Trash2 } from "lucide-react";
import { bulkAddRoutines } from "@/actions/routines";
import { RoutineList } from "./management-lists";

export default function RoutineManagement({ 
    allRoutines, 
    deleteAction,
    deleteAllAction
}: { 
    allRoutines: {
        id: string;
        courseId: string;
        courseName: string | null;
        semester: string;
        dayOfWeek: number;
        schedule: string;
    }[]; 
    deleteAction: (id: string) => Promise<unknown>;
    deleteAllAction: () => Promise<unknown>;
}) {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<{ success: boolean; message: string; count?: number } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setStatus(null);

        try {
            const text = await file.text();
            const res = await bulkAddRoutines(text);
            if (res.success) {
                setStatus({ success: true, message: `Successfully updated ${res.count} routine entries!`, count: res.count });
                setFile(null);
            } else {
                setStatus({ success: false, message: res.error || "Failed to upload routine." });
            }
        } catch (error) {
            console.error(error);
            setStatus({ success: false, message: "Error reading file content." });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAll = async () => {
        if (!confirm("CRITICAL: This will permanently delete ALL synced routine entries across the entire platform. Proceed?")) return;
        await deleteAllAction();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                    <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 leading-none">Global Routine Sync</h2>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Bulk Schedule Management</p>
                </div>
            </div>

            <div className="bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-5 mb-6">
                <div className="flex gap-4">
                    <Info className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <div className="space-y-2">
                        <p className="text-sm font-bold text-indigo-900 dark:text-indigo-300">CSV Template Reference</p>
                        <p className="text-xs text-indigo-700/80 dark:text-indigo-400/70 leading-relaxed uppercase tracking-tight">
                            Columns: <span className="font-black text-indigo-900 dark:text-indigo-200">Course, Semester, Day, Schedule</span>
                        </p>
                        <ul className="text-[10px] text-indigo-700/60 dark:text-indigo-400/60 font-bold space-y-1 pt-1">
                            <li>• Day: 0 (Sun) to 6 (Sat) OR names like &quot;Monday&quot;</li>
                            <li>• Schedule: &quot;Subject A (Time), Subject B (Time)&quot;</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="relative group border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-10 flex flex-col items-center justify-center transition-all hover:border-indigo-500/40 hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                <input 
                    type="file" 
                    accept=".csv" 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
                
                <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                    <Upload className="h-8 w-8 text-zinc-400 group-hover:text-indigo-500" />
                </div>
                
                <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                    {file ? file.name : "Click or drag CSV here"}
                </p>
                <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400">
                    {file ? `${(file.size / 1024).toFixed(1)} KB` : "Max file size 2MB"}
                </p>
            </div>

            {status && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${status.success ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400" : "bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"}`}>
                    {status.success ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <XCircle className="h-5 w-5 shrink-0" />}
                    <p className="text-sm font-semibold">{status.message}</p>
                </div>
            )}

            <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="w-full py-4 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white disabled:opacity-50 text-white dark:text-zinc-900 font-black rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
                {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Processing Data...</> : (
                    <>
                        Upload & Sync Routine
                        <CheckCircle2 className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                )}
            </button>

            {/* Sync History / Manage Routines */}
            <div className="mt-12 pt-10 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 italic">Global Sync Map</h3>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active routine entries in database</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                            {allRoutines.length} Entries
                        </div>
                        {allRoutines.length > 0 && (
                            <button
                                onClick={handleDeleteAll}
                                className="text-[10px] font-black text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Wipe Map
                            </button>
                        )}
                    </div>
                </div>
                <RoutineList allRoutines={allRoutines} deleteAction={deleteAction} />
            </div>
        </div>
    );
}
