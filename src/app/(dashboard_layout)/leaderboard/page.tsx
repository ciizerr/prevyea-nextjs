import { getLeaderboardAction, type LeaderboardUser } from "@/actions/leaderboard";
import { Trophy, User, FileType, GraduationCap, Sparkles } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
    const { success, data, error } = await getLeaderboardAction();

    if (!success || !data) {
        return (
            <div className="p-6 max-w-5xl mx-auto">
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl flex items-center gap-3">
                    <Trophy className="w-5 h-5" />
                    <p className="font-medium text-sm">{error || "Failed to load leaderboard data."}</p>
                </div>
            </div>
        );
    }

    const topThree = data.slice(0, 3);
    const restOfUsers = data.slice(3);

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-yellow-500" />
                        Leaderboard
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
                        Top contributors based on verified document uploads.
                    </p>
                </div>
            </div>

            {/* Top 3 Podium */}
            {topThree.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    {/* Rank 2 - Silver */}
                    {topThree[1] && (
                        <div className="md:order-1 flex flex-col items-center mt-0 md:mt-8">
                            <PodiumCard user={topThree[1]} rank={2} color="bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 border-zinc-300 dark:border-zinc-600" />
                        </div>
                    )}

                    {/* Rank 1 - Gold */}
                    {topThree[0] && (
                        <div className="md:order-2 flex flex-col items-center">
                            <PodiumCard user={topThree[0]} rank={1} color="bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-500 border-yellow-200 dark:border-yellow-500/30" star />
                        </div>
                    )}

                    {/* Rank 3 - Bronze */}
                    {topThree[2] && (
                        <div className="md:order-3 flex flex-col items-center mt-0 md:mt-12">
                            <PodiumCard user={topThree[2]} rank={3} color="bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-500 border-orange-200 dark:border-orange-500/30" />
                        </div>
                    )}
                </div>
            )}

            {/* Rest of the List */}
            {restOfUsers.length > 0 && (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 text-sm">
                                    <th className="px-6 py-4 font-bold text-zinc-500 dark:text-zinc-400 w-16 text-center">Rank</th>
                                    <th className="px-6 py-4 font-bold text-zinc-500 dark:text-zinc-400">User</th>
                                    <th className="px-6 py-4 font-bold text-zinc-500 dark:text-zinc-400 hidden sm:table-cell">Course</th>
                                    <th className="px-6 py-4 font-bold text-zinc-500 dark:text-zinc-400 text-right">Uploads</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {restOfUsers.map((user, index) => (
                                    <tr key={user.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                                        <td className="px-6 py-4 text-center font-bold text-zinc-400 dark:text-zinc-500">{index + 4}</td>
                                        <td className="px-6 py-4">
                                            <Link href={`/u/${user.username}`} className="flex items-center gap-3 w-fit group-hover:opacity-80 transition-opacity">
                                                {user.image ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={user.image} alt={user.username || "User"} className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 bg-zinc-100" referrerPolicy="no-referrer" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 flex items-center justify-center border border-blue-100 dark:border-blue-900/50">
                                                        <User className="w-5 h-5" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{user.name}</p>
                                                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">@{user.username}</p>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell">
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                                <GraduationCap className="w-4 h-4" />
                                                {user.courseName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="inline-flex items-center justify-end gap-1.5 font-black text-blue-600 dark:text-blue-400">
                                                {user.uploadCount} <FileType className="w-4 h-4 opacity-75" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {data.length === 0 && (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center shadow-sm">
                    <Trophy className="w-12 h-12 mx-auto mb-4 text-zinc-300 dark:text-zinc-700" />
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">No contributors yet</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Be the first to upload and get ranked on the leaderboard!</p>
                </div>
            )}
        </div>
    );
}

// Helper component for the top 3 cards
function PodiumCard({ user, rank, color, star }: { user: LeaderboardUser, rank: number, color: string, star?: boolean }) {
    return (
        <Link
            href={`/u/${user.username}`}
            className="group relative flex flex-col items-center w-full max-w-[280px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all pt-10"
        >
            <div className={`absolute -top-5 w-10 h-10 rounded-full flex items-center justify-center font-black text-lg border-4 border-white dark:border-zinc-950 shadow-sm z-10 ${color}`}>
                #{rank}
            </div>

            {star && (
                <div className="absolute top-4 right-4 text-yellow-500">
                    <Sparkles className="w-5 h-5 fill-current" />
                </div>
            )}

            {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt={user.username || "User"} className="w-24 h-24 rounded-full object-cover border-4 border-zinc-100 dark:border-zinc-800 mb-4 bg-zinc-100" referrerPolicy="no-referrer" />
            ) : (
                <div className="w-24 h-24 rounded-full shrink-0 flex items-center justify-center bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 border-4 border-zinc-100 dark:border-zinc-800 mb-4">
                    <User className="w-10 h-10" />
                </div>
            )}

            <div className="text-center space-y-1 w-full">
                <h3 className="font-black text-lg text-zinc-900 dark:text-zinc-100 truncate">{user.name}</h3>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 truncate">@{user.username}</p>
            </div>

            <div className={`mt-5 w-full py-2.5 rounded-xl flex items-center justify-center gap-2 font-black ${color.replace('border-', 'border-0 bg-opacity-50 ')}`}>
                <FileType className="w-5 h-5" />
                <span>{user.uploadCount} Uploads</span>
            </div>
        </Link>
    );
}
