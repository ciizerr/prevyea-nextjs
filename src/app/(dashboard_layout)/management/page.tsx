import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { eq, desc } from "drizzle-orm";
import { users, courses, colleges, subjects, collegeCourses, holidays } from "@/db/schema";
import { Building2, GraduationCap, BookOpen, Plus, FileText, CalendarDays } from "lucide-react";

import { createCollegeAction, createCourseAction, deleteCollegeAction, bulkDeleteCollegesAction, deleteCourseAction, bulkDeleteCoursesAction, deleteSubjectAction, bulkDeleteSubjectsAction } from "@/actions/management";
import CreateSubjectClientForm from "@/components/management/subject-form";
import ManageFilesSection from "@/components/management/manage-files-section";
import { CollegeList, CourseList, SubjectList } from "@/components/management/management-lists";
import HolidayManagement from "@/components/management/holiday-management";

export default async function ManagementPage() {
    const session = await auth();

    if (!session?.user?.id) redirect("/login");

    const currentUser = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });

    if (currentUser?.role !== "ADMIN") redirect("/dashboard");

    const [allColleges, allCourses, allSubjects, allCollegeCourses, allHolidays] = await Promise.all([
        db.query.colleges.findMany({ orderBy: desc(colleges.id) }),
        db.query.courses.findMany({ orderBy: desc(courses.id) }),
        db.query.subjects.findMany({ orderBy: desc(subjects.id) }),
        db.select().from(collegeCourses),
        db.query.holidays.findMany({ orderBy: desc(holidays.date) }),
    ]);

    const inputClass = "w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 outline-none";

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">

            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-indigo-100 dark:bg-indigo-500/10 p-2 rounded-xl text-indigo-600 dark:text-indigo-500">
                        <Building2 className="h-6 w-6" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">Backend Management</h1>
                </div>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Admin portal to create and manage Colleges, Courses, Subjects, and uploaded Files.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* CREATE COLLEGE */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-indigo-500" /> Create College
                    </h3>
                    <form action={async (formData) => { "use server"; await createCollegeAction(formData); }} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">College Name</label>
                            <input type="text" name="name" required placeholder="e.g. Panjab University" className={`${inputClass} focus:ring-indigo-500/50`} />
                        </div>
                        <button type="submit" className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all active:scale-95 shadow-md">
                            <Plus className="h-4 w-4" /> Add College
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800/60">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Total Colleges: {allColleges.length}</p>
                        <CollegeList 
                            allColleges={allColleges} 
                            deleteAction={async (id) => { "use server"; await deleteCollegeAction(id); }} 
                            bulkDeleteAction={async (ids) => { "use server"; await bulkDeleteCollegesAction(ids); }}
                        />
                    </div>
                </div>

                {/* CREATE COURSE */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-emerald-500" /> Create Course
                    </h3>
                    <form action={async (formData) => { "use server"; await createCourseAction(formData); }} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Course Name</label>
                            <input type="text" name="name" required placeholder="e.g. BCA, B.Sc IT" className={`${inputClass} focus:ring-emerald-500/50`} />
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Assign to College(s)</label>
                            <div className="flex flex-col gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                                {allColleges.map(c => (
                                    <label key={c.id} className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" name="collegeIds" value={c.id} className="w-5 h-5 text-emerald-600 rounded border-zinc-300 focus:ring-emerald-600 dark:border-zinc-700 dark:bg-zinc-900 transition-all" />
                                        <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{c.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Total Semesters</label>
                            <input type="number" name="totalSemesters" min="1" max="12" defaultValue="6" required className={`${inputClass} focus:ring-emerald-500/50`} />
                        </div>
                        <button type="submit" className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all active:scale-95 shadow-md">
                            <Plus className="h-4 w-4" /> Add Course
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800/60">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Total Courses: {allCourses.length}</p>
                        <CourseList 
                            allCourses={allCourses} 
                            allColleges={allColleges} 
                            allCollegeCourses={allCollegeCourses} 
                            deleteAction={async (id) => { "use server"; await deleteCourseAction(id); }} 
                            bulkDeleteAction={async (ids) => { "use server"; await bulkDeleteCoursesAction(ids); }} 
                        />
                    </div>
                </div>

                {/* CREATE SUBJECT */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm lg:col-span-2">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-amber-500" /> Create Subject
                    </h3>

                    <CreateSubjectClientForm allCourses={allCourses} />

                    <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800/60 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 sticky top-0 bg-white dark:bg-zinc-900 py-1 z-10">Total Subjects: {allSubjects.length}</p>
                        <SubjectList 
                            allSubjects={allSubjects} 
                            allCourses={allCourses} 
                            deleteAction={async (id) => { "use server"; await deleteSubjectAction(id); }} 
                            bulkDeleteAction={async (ids) => { "use server"; await bulkDeleteSubjectsAction(ids); }} 
                        />
                    </div>
                </div>

                {/* MANAGE FILES */}
                <div className="lg:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-blue-100 dark:bg-blue-500/10 p-2 rounded-xl text-blue-600 dark:text-blue-500">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">File Library</h2>
                            <p className="text-sm text-zinc-500">Edit titles or delete any uploaded document across all subjects.</p>
                        </div>
                    </div>
                    <ManageFilesSection />
                </div>

                {/* HOLIDAYS CALENDAR MANAGEMENT */}
                <div className="lg:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-amber-100 dark:bg-amber-500/10 p-2 rounded-xl text-amber-600 dark:text-amber-500">
                            <CalendarDays className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">Holiday Calendar</h2>
                            <p className="text-sm text-zinc-500">Manage academic dates, breaks, and holidays dynamically.</p>
                        </div>
                    </div>
                    <HolidayManagement allHolidays={allHolidays} />
                </div>

            </div>
        </div>
    );
}
