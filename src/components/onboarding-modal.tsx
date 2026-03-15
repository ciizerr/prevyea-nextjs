"use client";

import { useState, useTransition, useEffect } from "react";
import { CheckCircle2, User, GraduationCap, XCircle, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ClickSpark from "@/components/reactbits/ClickSpark";
import { getCoursesAction } from "@/actions/curriculum";
import { getCollegesAction } from "@/actions/management";
import { completeOnboardingAction } from "@/actions/user";

export default function OnboardingModal() {
    const { data: session, status: sessionStatus, update } = useSession();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [formStatus, setFormStatus] = useState<{ success: boolean; message: string } | null>(null);
    const [dismissed, setDismissed] = useState(false);

    // Dynamic Curriculum State
    const [courses, setCourses] = useState<{ id: string; name: string; collegeId: string | null }[]>([]);
    const [colleges, setColleges] = useState<{ id: string; name: string }[]>([]);

    const [selectedCollegeId, setSelectedCollegeId] = useState("");
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [selectedSession, setSelectedSession] = useState("");

    // Determine if modal should show
    const isLoggedIn = sessionStatus === "authenticated";
    const needsOnboarding = isLoggedIn && !(session?.user as Record<string, unknown> | undefined)?.username;

    // Fetch Curriculum when modal shows
    useEffect(() => {
        if (needsOnboarding && !dismissed) {
            Promise.all([getCoursesAction(), getCollegesAction()]).then(([coursesRes, collegesRes]) => {
                if (coursesRes.success && coursesRes.data) {
                    setCourses(coursesRes.data as { id: string; name: string; collegeId: string; totalSemesters: number }[]);
                }
                if (collegesRes.success && collegesRes.data) {
                    setColleges(collegesRes.data);
                }
            });
        }
    }, [needsOnboarding, dismissed]);

    if (!needsOnboarding || dismissed) return null;

    const handleSubmit = async (formData: FormData) => {
        setFormStatus(null);
        startTransition(async () => {
            const result = await completeOnboardingAction(formData);
            if (result.success) {
                setFormStatus({ success: true, message: "Welcome aboard! Redirecting..." });
                // Force JWT to re-read from DB by triggering an update
                await update({ trigger: "onboarding-complete" });
                setTimeout(() => {
                    router.refresh();
                }, 1200);
            } else {
                setFormStatus({ success: false, message: result.error || "Failed to save profile." });
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300 relative">

                {/* Close / Dismiss button */}
                <button
                    onClick={() => setDismissed(true)}
                    className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                    title="Dismiss for now"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="mb-8 text-center">
                    <div className="bg-blue-100 dark:bg-blue-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-500 shadow-sm">
                        <User className="h-8 w-8" />
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">Claim Your Identity</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                        Let&apos;s finish setting up your profile so you can start contributing.
                    </p>
                </div>

                <form action={handleSubmit} className="space-y-5">

                    {/* Username input */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">Unique Username</label>
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 text-zinc-400 font-bold">@</span>
                            <input
                                type="text"
                                name="username"
                                required
                                minLength={3}
                                maxLength={20}
                                pattern="^[a-zA-Z0-9_]*$"
                                title="Only letters, numbers, and underscores allowed"
                                placeholder="username"
                                className="w-full pl-9 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>
                        <p className="text-xs text-zinc-500 mt-2 ml-1">This will be your permanent public handle.</p>
                    </div>

                    <div className="border-t border-zinc-100 dark:border-zinc-800/60 my-6"></div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <GraduationCap className="h-4 w-4 text-emerald-500" />
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Academic Details</h3>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">College</label>
                            <select
                                name="collegeId"
                                required
                                value={selectedCollegeId}
                                onChange={(e) => {
                                    setSelectedCollegeId(e.target.value);
                                    setSelectedCourseId(""); // Reset course
                                    setSelectedSession(""); // Reset sem
                                }}
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                            >
                                <option value="" disabled>Select College</option>
                                {colleges.map((college) => (
                                    <option key={college.id} value={college.id}>{college.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">Course</label>
                                <select
                                    name="courseId"
                                    required
                                    value={selectedCourseId}
                                    onChange={(e) => {
                                        setSelectedCourseId(e.target.value);
                                        setSelectedSession("");
                                    }}
                                    disabled={!selectedCollegeId}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none disabled:opacity-50"
                                >
                                    <option value="" disabled>{selectedCollegeId ? "Select Course" : "Select College First"}</option>
                                    {courses.filter(c => c.collegeId === selectedCollegeId).map((course) => (
                                        <option key={course.id} value={course.id}>{course.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">Session</label>
                                <input
                                    name="session"
                                    type="text"
                                    required
                                    value={selectedSession}
                                    onChange={(e) => setSelectedSession(e.target.value)}
                                    placeholder="e.g. 2023-2027"
                                    disabled={!selectedCourseId}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                                />
                            </div>
                        </div>
                    </div>

                    {formStatus && (
                        <div className={`p-4 rounded-xl border flex items-center gap-3 ${formStatus.success ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400" : "bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"}`}>
                            {formStatus.success ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <XCircle className="h-5 w-5 shrink-0" />}
                            <p className="text-sm font-semibold">{formStatus.message}</p>
                        </div>
                    )}

                    <div className="pt-2">
                        <ClickSpark>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? "Validating..." : "Complete Setup"}
                            </button>
                        </ClickSpark>
                    </div>

                </form>
            </div>
        </div>
    );
}
