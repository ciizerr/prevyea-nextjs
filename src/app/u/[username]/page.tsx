import { db } from "@/db";
import { users, pyqs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { User, ShieldCheck, GraduationCap, FileType, Download } from "lucide-react";
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

    const pyqsList = (userProfile as unknown as { pyqs: PyqDoc[] }).pyqs || [];
    const totalContributions = pyqsList.length;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-12">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Profile Header Card */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8">
                    {userProfile.image ? (
                        <img src={userProfile.image} alt={username} className="w-32 h-32 rounded-full border-4 border-zinc-100 dark:border-zinc-800 object-cover shadow-sm bg-zinc-100" referrerPolicy="no-referrer" />
                    ) : (
                        <div className="w-32 h-32 rounded-full border-4 border-zinc-100 dark:border-zinc-800 flex items-center justify-center bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 shadow-sm">
                            <User className="w-12 h-12" />
                        </div>
                    )}

                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">{userProfile.name || `@${userProfile.username}`}</h1>
                            <p className="text-zinc-500 dark:text-zinc-400 font-medium mt-1">@{userProfile.username}</p>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                <ShieldCheck className={`w-4 h-4 ${userProfile.role === "ADMIN" || userProfile.role === "MODERATOR" ? "text-purple-500" : "text-zinc-400"}`} />
                                {userProfile.role}
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                <GraduationCap className="w-4 h-4 text-emerald-500" />
                                {userProfile.course || "No Course"} • {userProfile.semester || "No Sem"}
                            </div>
                        </div>

                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Joined {dayjs(userProfile.createdAt).format("MMMM YYYY")}
                        </p>
                    </div>

                    <div className="bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl p-6 text-center min-w-[120px]">
                        <p className="text-3xl font-black text-blue-600 dark:text-blue-400">{totalContributions}</p>
                        <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-1">Contributions</p>
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
