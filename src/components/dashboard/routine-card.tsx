"use client";

import { useState, useEffect } from "react";
import { Clock, Calendar, Sparkles } from "lucide-react";
import dayjs from "dayjs";
import { getTodayRoutine } from "@/actions/routines";
import { getCoursesAction } from "@/actions/curriculum";

interface RoutineCardProps {
    courseId?: string | null;
    semester?: string | null;
}

export function RoutineCard({ courseId, semester: initialSemester }: RoutineCardProps) {
    const [routine, setRoutine] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSemester, setSelectedSemester] = useState(initialSemester || "");
    const [courseInfo, setCourseInfo] = useState<{ totalSemesters: number } | null>(null);

    useEffect(() => {
        if (!courseId) return;
        getCoursesAction().then(res => {
            if (res.success && res.data) {
                const fetchedCourses = res.data as { id: string; totalSemesters: number }[];
                const course = fetchedCourses.find(c => c.id === courseId);
                if (course) setCourseInfo(course);
            }
        });
    }, [courseId]);

    useEffect(() => {
        let isMounted = true;
        
        if (!courseId || !selectedSemester) {
            setRoutine(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        const dayOfWeek = dayjs().day();
        
        getTodayRoutine(courseId, selectedSemester, dayOfWeek).then(data => {
            if (isMounted) {
                setRoutine(data?.schedule || null);
                setLoading(false);
            }
        });

        return () => { isMounted = false; };
    }, [courseId, selectedSemester]);

    const parseSession = (session: string) => {
        // Matches patterns like (9:30 AM), (10:30-11:30), (9:30AM-10:30AM)
        const rangeMatch = session.match(/\(([^)]*[\d:]+\s*(?:AM|PM)?\s*-\s*[ \d:]+\s*(?:AM|PM)?)\)$/i);
        const singleMatch = session.match(/\(([^)]*[\d:]+\s*(?:AM|PM)?)\)$/i);
        
        const timePart = rangeMatch?.[1] || singleMatch?.[1] || null;
        const subject = timePart ? session.replace(`(${timePart})`, "").trim() : session;
        
        return { subject, time: timePart };
    };

    const isCurrentSession = (timeStr: string | null) => {
        if (!timeStr) return false;
        try {
            const now = dayjs();
            const [startPart, endPart] = timeStr.split("-").map(t => t.trim());
            
            // Helper to parse flexible times
            const parseTime = (t: string) => {
                let parsed = dayjs(t, "h:mm A");
                if (!parsed.isValid()) parsed = dayjs(t, "h:mm"); // Try without AM/PM
                return now.hour(parsed.hour()).minute(parsed.minute());
            };

            const startTime = parseTime(startPart);
            let endTime = endPart ? parseTime(endPart) : startTime.add(1, "hour");
            
            // If AM/PM is missing from end but present in start, or vice versa, logic can get tricky
            // but for simplicity we assume typical class hours
            if (endTime.isBefore(startTime)) endTime = endTime.add(12, "hour");

            return now.isAfter(startTime.subtract(2, "minute")) && now.isBefore(endTime);
        } catch {
            return false;
        }
    };

    if (!courseId) return null;

    const sessionList = routine ? routine.split(",").map(s => parseSession(s.trim())) : [];
    const currentTime = dayjs().format("h:mm A");

    return (
        <div className="relative group overflow-hidden bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md border border-indigo-500/10 rounded-3xl p-4 sm:p-5 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-indigo-500/5 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-4">
                {/* Ultra-Compact Header */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="shrink-0 w-9 h-9 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 shadow-sm">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-zinc-900 dark:text-white tracking-tight leading-none">
                                {dayjs().format("dddd")}<span className="text-zinc-400 font-medium ml-1 text-sm">· {dayjs().format("MMM D")}</span>
                            </h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-wider">Agenda</span>
                                <Sparkles className="h-2.5 w-2.5 text-amber-500" />
                            </div>
                        </div>
                    </div>

                    <select 
                        value={selectedSemester} 
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-lg px-3 py-1.5 text-[10px] font-black text-zinc-500 dark:text-zinc-400 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer h-8"
                    >
                        <option value="">Semester</option>
                        {Array.from({ length: courseInfo?.totalSemesters || 8 }).map((_, i) => (
                            <option key={i} value={`Sem ${i + 1}`}>Sem {i + 1}</option>
                        ))}
                    </select>
                </div>

                {/* Ultra-Compact Grid Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {loading ? (
                        <div className="col-span-full space-y-2 animate-pulse">
                            <div className="h-8 w-full bg-zinc-100 dark:bg-white/5 rounded-xl" />
                        </div>
                    ) : sessionList.length > 0 ? (
                        sessionList.map((session, i) => {
                            const isActive = isCurrentSession(session.time);
                            return (
                                <div 
                                    key={i} 
                                    className={`relative flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 group/session ${
                                        isActive 
                                        ? "bg-indigo-600/10 border-2 border-indigo-500/50 shadow-lg shadow-indigo-500/10" 
                                        : "bg-white/30 dark:bg-zinc-900/40 border border-zinc-100 dark:border-white/5"
                                    }`}
                                >
                                    <div className={`shrink-0 w-1.5 h-1.5 rounded-full ${
                                        isActive ? "bg-indigo-500 animate-pulse ring-4 ring-indigo-500/20" : "bg-zinc-300 dark:bg-zinc-800"
                                    }`} />

                                    <div className="flex-1 flex items-center justify-between min-w-0">
                                        <h4 className={`text-[13px] font-bold truncate pr-3 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-700 dark:text-zinc-300"}`}>
                                            {session.subject}
                                        </h4>
                                        <div className={`shrink-0 px-2.5 py-1 rounded-md text-[10px] font-black whitespace-nowrap ${
                                            isActive ? "bg-indigo-500 text-white shadow-sm" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                                        }`}>
                                            {session.time || "--"}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-4 text-center bg-zinc-50 dark:bg-zinc-900/20 border border-dashed border-zinc-200 dark:border-white/5 rounded-xl">
                            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">No classes today</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
