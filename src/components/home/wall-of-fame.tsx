import { Trophy, Medal, Upload, Award } from "lucide-react";
import ClickSpark from "@/components/reactbits/ClickSpark";
import Link from "next/link";

const LEADERBOARD_DATA = [
    { rank: 1, name: "Rahul S.", course: "BCA Sem 5", uploads: 42, points: 1250, recent: "Uploaded 2023 OS Paper" },
    { rank: 2, name: "Aman K.", course: "B.Sc IT Sem 3", uploads: 38, points: 980, recent: "Shared C++ Notes" },
    { rank: 3, name: "Priya M.", course: "BBA Sem 4", uploads: 25, points: 720, recent: "Updated Syllabus" },
    { rank: 4, name: "Vikash D.", course: "BCA Sem 2", uploads: 18, points: 450, recent: "Added Math PYQs" },
    { rank: 5, name: "Neha Y.", course: "B.Sc Biotech", uploads: 12, points: 310, recent: "Shared Zoology Notes" }
];

export interface LeaderboardUser {
    rank: number;
    name: string;
    course: string;
    uploads: number;
    points: number;
    recent: string;
}

export default function WallOfFame({ leaderboard }: { leaderboard?: LeaderboardUser[] }) {
    const dataToUse = leaderboard && leaderboard.length > 0 ? leaderboard : LEADERBOARD_DATA;

    return (
        <section className="w-full py-24 md:py-32 px-4 relative bg-zinc-50 dark:bg-[#0a0a0a] overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-amber-500/5 dark:bg-amber-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12 md:mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-semibold text-sm mb-4 border border-amber-200/50 dark:border-amber-800/50">
                        <Trophy className="h-4 w-4" />
                        Legends of the Library
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Built by students, for students.
                    </h2>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                        The ultimate flex? Saving your juniors before exams. Join the leaderboard by contributing to the archive.
                    </p>
                </div>

                {/* Leaderboard */}
                <div className="bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden mb-12">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 text-sm md:text-base">
                                    <th className="py-4 px-6 font-semibold text-zinc-500 dark:text-zinc-400 w-16">Rank</th>
                                    <th className="py-4 px-6 font-semibold text-zinc-500 dark:text-zinc-400">Contributor</th>
                                    <th className="py-4 px-6 font-semibold text-zinc-500 dark:text-zinc-400 hidden sm:table-cell">Recent Activity</th>
                                    <th className="py-4 px-6 font-semibold text-zinc-500 dark:text-zinc-400 text-right">Uploads</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                                {dataToUse.map((user) => (
                                    <tr key={user.rank} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold
                                                ${user.rank === 1 ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400' :
                                                    user.rank === 2 ? 'bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' :
                                                        user.rank === 3 ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400' :
                                                            'bg-zinc-100 text-zinc-500 dark:bg-zinc-900/50 dark:text-zinc-500'}`}
                                            >
                                                {user.rank === 1 ? <Trophy className="h-4 w-4" /> : user.rank === 2 ? <Medal className="h-4 w-4" /> : user.rank === 3 ? <Award className="h-4 w-4" /> : user.rank}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-zinc-900 dark:text-zinc-100">{user.name}</span>
                                                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-500">{user.course}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 hidden sm:table-cell">
                                            <span className="inline-flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full border border-zinc-200/50 dark:border-zinc-800/50">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                {user.recent}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                                                {user.uploads.toLocaleString()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col items-center justify-center space-y-4">
                    <p className="text-zinc-600 dark:text-zinc-400 font-medium text-center">
                        Upload your old notes or past papers and claim your spot.
                    </p>
                    <ClickSpark className="w-full sm:w-auto">
                        <Link href="/vault" className="w-full sm:w-auto inline-flex bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-bold py-4 px-8 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer">
                            <Upload className="h-5 w-5" />
                            Contribute Material
                        </Link>
                    </ClickSpark>
                </div>
            </div>
        </section>
    );
}
