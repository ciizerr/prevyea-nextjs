import { Metadata } from "next";
import { db } from "@/db";

import { users, pyqs, courses } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { User, ShieldCheck, GraduationCap, FileType, ExternalLink, Instagram, MessageSquare, Github, ArrowLeft, Trophy, Calendar, Sparkles } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";

interface ProfilePageProps {
    params: Promise<{
        username: string;
    }>;
}

interface PyqDoc {
    id: string;
    title: string;
    type: string | null;
    year: number;
    viewLink: string;
    createdAt: Date | null;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
    const { username } = await params;
    const userProfile = await db.query.users.findFirst({
        where: eq(users.username, username.toLowerCase()),
    });

    if (!userProfile) {
        return {
            title: "User Not Found",
        };
    }

    const name = userProfile.name || `@${userProfile.username}`;
    const description = `Check out ${name}'s profile and verified contributions on PU Digital Library.`;

    return {
        title: `${name} (@${userProfile.username}) | PU Digital Library`,
        description,
        openGraph: {
            title: `${name} (@${userProfile.username})`,
            description,
            type: "profile",
            username: userProfile.username || undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: `${name} (@${userProfile.username})`,
            description,
        },
    };
}

export default async function PublicProfilePage({ params }: ProfilePageProps) {
    const { username } = await params;

    const userProfile = await db.query.users.findFirst({
        where: eq(users.username, username.toLowerCase()),
        with: {
            pyqs: {
                where: eq(pyqs.status, "APPROVED"),
                orderBy: desc(pyqs.createdAt)
            }
        }
    });

    if (!userProfile) {
        notFound();
    }

    let joinedDateString = "Unknown";
    try {
        if (userProfile.createdAt) {
            const parsed = new Date(userProfile.createdAt);
            if (!isNaN(parsed.getTime())) {
                joinedDateString = dayjs(parsed).format("MMMM YYYY");
            }
        }
    } catch { }

    let courseName = userProfile.course;
    if (userProfile.course) {
        const courseData = await db.query.courses.findFirst({
            where: eq(courses.id, userProfile.course)
        });
        if (courseData) {
            courseName = courseData.name;
        }
    }

    const pyqsList = (userProfile as unknown as { pyqs: PyqDoc[] }).pyqs || [];
    const totalContributions = pyqsList.length;

    return (
        <div className="min-h-screen bg-[#fcfcfd] dark:bg-black selection:bg-blue-100 dark:selection:bg-blue-900/40">
            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link 
                        href="/dashboard"
                        className="flex items-center gap-2 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all group"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Public Profile</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
                
                {/* Hero Profile Section */}
                <div className="relative group">
                    {/* Background Decorative Element */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 dark:from-blue-600/10 dark:to-purple-600/10 rounded-[2.5rem] -rotate-1 group-hover:rotate-0 transition-transform duration-500" />
                    
                    <div className="relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 sm:p-12 shadow-xl shadow-zinc-200/20 dark:shadow-none overflow-hidden">
                        {/* More decorative background mesh */}
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full" />
                        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full" />

                        <div className="relative z-10 flex flex-col items-center text-center md:flex-row md:text-left md:items-start gap-8 sm:gap-12">
                            {/* Avatar */}
                            <div className="relative shrink-0">
                                <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 scale-110" />
                                {userProfile.image ? (
                                    <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img 
                                            src={userProfile.image} 
                                            alt={username} 
                                            className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-[2rem] border-4 border-zinc-50 dark:border-zinc-900 object-cover shadow-2xl bg-white dark:bg-zinc-800"
                                            referrerPolicy="no-referrer"
                                        />
                                    </>
                                ) : (
                                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-[2rem] border-4 border-zinc-50 dark:border-zinc-900 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 shadow-2xl">
                                        <User className="w-16 h-16" />
                                    </div>
                                )}
                                {userProfile.role === "ADMIN" && (
                                    <div className="absolute -bottom-2 -right-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 p-2 rounded-2xl shadow-xl border-4 border-white dark:border-zinc-950">
                                        <ShieldCheck className="w-5 h-5 font-black" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 flex flex-col gap-6">
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                                            {userProfile.name || `@${userProfile.username}`}
                                        </h1>
                                        <div className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100 dark:border-blue-900/30">
                                            {userProfile.role}
                                        </div>
                                    </div>
                                    <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium">@{userProfile.username}</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
                                        <div className="p-2.5 bg-white dark:bg-zinc-800 rounded-xl shadow-sm">
                                            <GraduationCap className="w-5 h-5 text-indigo-500" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Course</p>
                                            <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{courseName || "None"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
                                        <div className="p-2.5 bg-white dark:bg-zinc-800 rounded-xl shadow-sm">
                                            <Calendar className="w-5 h-5 text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Since</p>
                                            <p className="font-bold text-zinc-900 dark:text-zinc-100">{joinedDateString}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
                                        <div className="p-2.5 bg-white dark:bg-zinc-800 rounded-xl shadow-sm">
                                            <Trophy className="w-5 h-5 text-amber-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Uploads</p>
                                            <p className="font-bold text-zinc-900 dark:text-zinc-100">{totalContributions}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Context */}
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                                    {userProfile.instagram && (
                                        <a href={`https://instagram.com/${userProfile.instagram}`} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 px-5 py-2.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-2xl text-sm font-bold transition-all text-zinc-700 dark:text-zinc-300">
                                            <Instagram className="w-4 h-4 text-pink-500" />
                                            <span>Instagram</span>
                                        </a>
                                    )}
                                    {userProfile.github && (
                                        <a href={`https://github.com/${userProfile.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 px-5 py-2.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-2xl text-sm font-bold transition-all text-zinc-700 dark:text-zinc-300">
                                            <Github className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                                            <span>GitHub</span>
                                        </a>
                                    )}
                                    {userProfile.discord && (
                                        <div className="flex items-center gap-2.5 px-5 py-2.5 bg-zinc-100 dark:bg-zinc-900 rounded-2xl text-sm font-bold text-zinc-700 dark:text-zinc-300 cursor-help" title={`Discord: ${userProfile.discord}`}>
                                            <MessageSquare className="w-4 h-4 text-indigo-500" />
                                            <span>Discord</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-4">
                        <div className="flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-blue-500" />
                            <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">Verified Contributions</h2>
                        </div>
                        <div className="text-xs font-black uppercase tracking-widest text-zinc-400">
                            {totalContributions} Items
                        </div>
                    </div>

                    {totalContributions === 0 ? (
                        <div className="bg-zinc-50 dark:bg-zinc-900/40 border-2 border-dashed border-zinc-200 dark:border-zinc-800/80 rounded-[2.5rem] p-16 text-center">
                            <div className="bg-white dark:bg-zinc-900 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
                                <FileType className="w-10 h-10 text-zinc-300" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">No contributions yet</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">This community member hasn&apos;t published any verified documents to the library still.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {pyqsList.map((doc: PyqDoc) => (
                                <Link 
                                    key={doc.id}
                                    href={doc.viewLink}
                                    target="_blank"
                                    className="group flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 hover:border-blue-500/50 transition-all duration-300 overflow-hidden relative"
                                >
                                    {/* Decorative subtle background icon */}
                                    <FileType className="absolute -bottom-6 -right-6 w-32 h-32 text-zinc-100 dark:text-zinc-900/50 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />

                                    <div className="relative z-10 flex items-center gap-5 w-full">
                                        <div className="shrink-0 p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                                            <FileType className="w-7 h-7" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-wider rounded-md">
                                                    {doc.type}
                                                </span>
                                                <span className="text-[10px] font-bold text-zinc-400 tracking-tight">
                                                    Class of {doc.year}
                                                </span>
                                            </div>
                                            <h3 className="font-black text-zinc-900 dark:text-zinc-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {doc.title}
                                            </h3>
                                            <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-widest">
                                                Verified • {dayjs(doc.createdAt).format("MMM DD, YYYY")}
                                            </p>
                                        </div>
                                        <div className="shrink-0 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl text-zinc-400 group-hover:text-blue-600 transition-colors">
                                            <ExternalLink className="w-5 h-5" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Minimalist Footer */}
                <div className="pt-12 text-center">
                    <p className="text-sm font-bold text-zinc-400 flex items-center justify-center gap-2">
                        PU Digital Library <span className="h-1 w-1 rounded-full bg-zinc-300" /> Community Profile
                    </p>
                </div>

            </main>
        </div>
    );
}
