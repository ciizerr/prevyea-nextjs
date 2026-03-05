import { db } from "@/db";
import { users, pyqs, courses } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { User, ShieldCheck, GraduationCap, FileType, Download, Instagram, MessageSquare, Github } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";

interface ProfilePageProps {
    params: {
        username: string;
    };
}

interface PyqDoc {
    id: string;
    title: string;
    type: string | null;
    year: number;
    viewLink: string;
    createdAt: Date | null;
}

export default async function PublicProfilePage({ params }: ProfilePageProps) {
    const { username } = await params; // Needs to be awaited in Next 15+

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

    // SQLite dates can be finicky depending on how they were inserted (string vs timestamp).
    // Let's ensure we grab a safely formattable date by doing a robust string parse or fallback.
    let joinedDateString = "Unknown";
    try {
        if (userProfile.createdAt) {
            // Even if it's a raw string in SQLite, JS Date can usually parse 'YYYY-MM-DD HH:MM:SS'
            const parsed = new Date(userProfile.createdAt);
            if (!isNaN(parsed.getTime())) {
                joinedDateString = dayjs(parsed).format("MMMM YYYY");
            }
        }
    } catch {
        // Leave as "Unknown" if parsing catastrophically fails
    }

    // Get the actual course name instead of ID
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
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-12">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Profile Header Card */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
                    {/* Decorative Background Blob */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

                    <div className="relative z-10 shrink-0">
                        {userProfile.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={userProfile.image} alt={username} className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-zinc-800 object-cover shadow-md bg-zinc-100" referrerPolicy="no-referrer" />
                        ) : (
                            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-zinc-800 flex items-center justify-center bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 shadow-md">
                                <User className="w-12 h-12" />
                            </div>
                        )}
                    </div>

                    <div className="relative z-10 flex-1 text-center md:text-left space-y-4 w-full">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">{userProfile.name || `@${userProfile.username}`}</h1>
                                <p className="text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">@{userProfile.username}</p>
                            </div>

                            {/* Stats Badge */}
                            <div className="inline-flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl px-6 py-3 self-center md:self-start shrink-0">
                                <p className="text-2xl font-black text-blue-600 dark:text-blue-400 leading-none">{totalContributions}</p>
                                <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mt-1">Uploads</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-2.5">
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/50 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                <ShieldCheck className={`w-3.5 h-3.5 ${userProfile.role === "ADMIN" || userProfile.role === "MODERATOR" ? "text-purple-500" : "text-zinc-400"}`} />
                                {userProfile.role}
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/50 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
                                {courseName || "No Course"} • {userProfile.session || "No Session"}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                Joined {joinedDateString}
                            </p>

                            {/* Social Links */}
                            {(userProfile.instagram || userProfile.discord || userProfile.github) && (
                                <div className="flex items-center gap-2">
                                    {userProfile.github && (
                                        <a href={`https://github.com/${userProfile.github}`} target="_blank" rel="noreferrer" className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-white text-zinc-500 transition-colors" title="GitHub">
                                            <Github className="w-4 h-4" />
                                        </a>
                                    )}
                                    {userProfile.instagram && (
                                        <a href={`https://instagram.com/${userProfile.instagram}`} target="_blank" rel="noreferrer" className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-50 dark:bg-pink-500/10 hover:bg-pink-100 hover:text-pink-600 dark:hover:bg-pink-500/20 dark:text-pink-400/80 dark:hover:text-pink-400 text-pink-500 transition-colors" title="Instagram">
                                            <Instagram className="w-4 h-4" />
                                        </a>
                                    )}
                                    {userProfile.discord && (
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-500/20 dark:text-indigo-400/80 dark:hover:text-indigo-400 text-indigo-500 transition-colors cursor-help" title={`Discord: ${userProfile.discord}`}>
                                            <MessageSquare className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Verified Contributions List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 px-2">Verified Documents</h2>

                    {totalContributions === 0 ? (
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center text-zinc-500 shadow-sm">
                            <FileType className="w-12 h-12 mx-auto mb-4 text-zinc-300 dark:text-zinc-700" />
                            <p>This user hasn&apos;t uploaded any approved documents yet.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {pyqsList.map((doc: PyqDoc) => (
                                <div key={doc.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:border-blue-500/30 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center rounded-xl">
                                            <FileType className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{doc.title}</h3>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium flex items-center gap-2">
                                                <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-md">{doc.type}</span>
                                                • {doc.year}
                                            </p>
                                        </div>
                                    </div>

                                    <Link
                                        href={doc.viewLink}
                                        target="_blank"
                                        className="p-3 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-xl text-zinc-600 dark:text-zinc-300 transition-colors"
                                    >
                                        <Download className="w-5 h-5" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
