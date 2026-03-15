import { getLeaderboardAction, type LeaderboardUser } from "@/actions/leaderboard";
import { Trophy, User, GraduationCap, Sparkles, Medal, Crown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { ContributorAction } from "@/components/leaderboard/contributor-action";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Hall of Fame | Community Leaderboard",
    description: "Meet the top contributors who are building the largest resource library for Patna University students.",
    openGraph: {
        title: "PU Digital Library Hall of Fame",
        description: "Celebrating our top contributors and their impact on the community.",
    },
};

export default async function LeaderboardPage() {
    const { success, data, error } = await getLeaderboardAction();

    if (!success || !data) {
        return (
            <div className="p-6 max-w-5xl mx-auto">
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 p-6 rounded-[2rem] flex items-center gap-4">
                    <div className="p-3 bg-red-100 dark:bg-red-500/20 rounded-2xl">
                         <Trophy className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-lg">{error || "Failed to load leaderboard data."}</p>
                </div>
            </div>
        );
    }

    const topThree = data.slice(0, 3);
    const restOfUsers = data.slice(3);

    return (
        <div className="min-h-screen bg-[#fcfcfd] dark:bg-black overflow-hidden selection:bg-yellow-100 dark:selection:bg-yellow-900/30">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-400/10 dark:bg-yellow-500/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 dark:bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            <main className="relative z-10 p-6 md:p-12 max-w-6xl mx-auto space-y-16">
                
                {/* Header Section */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-100 dark:border-yellow-500/20 rounded-full text-yellow-600 dark:text-yellow-400 text-xs font-black uppercase tracking-widest">
                        <Sparkles className="w-3.5 h-3.5" />
                        Hall of Fame
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                        The Leaderboard
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 max-w-lg font-medium text-lg leading-relaxed">
                        Celebrating our top contributors who help build the largest resource library for Patna University students.
                    </p>
                </div>

                {/* Top 3 PodiumSection */}
                {topThree.length > 0 && (
                    <div className="relative pt-12 pb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                            {/* Rank 2 - Silver */}
                            <div className="md:order-1 flex flex-col items-center">
                                {topThree[1] && <PodiumCard user={topThree[1]} rank={2} variant="silver" />}
                            </div>

                            {/* Rank 1 - Gold */}
                            <div className="md:order-2 flex flex-col items-center mb-8 md:mb-16">
                                {topThree[0] && <PodiumCard user={topThree[0]} rank={1} variant="gold" />}
                            </div>

                            {/* Rank 3 - Bronze */}
                            <div className="md:order-3 flex flex-col items-center">
                                {topThree[2] && <PodiumCard user={topThree[2]} rank={3} variant="bronze" />}
                            </div>
                        </div>
                    </div>
                )}

                {/* Rest of the Ranking List */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-6">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-6 h-6 text-blue-500" />
                            <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">Top Rankings</h2>
                        </div>
                        <div className="text-xs font-black uppercase tracking-widest text-zinc-400">
                            {data.length} Global Contributors
                        </div>
                    </div>

                    {restOfUsers.length > 0 ? (
                        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] shadow-xl shadow-zinc-200/20 dark:shadow-none overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/30 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                            <th className="px-8 py-6 w-24 text-center">Rank</th>
                                            <th className="px-8 py-6">Contributor</th>
                                            <th className="px-8 py-6 hidden lg:table-cell text-center">Program</th>
                                            <th className="px-8 py-6 text-right">Activity</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                                        {restOfUsers.map((user, index) => (
                                            <tr key={user.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all duration-300">
                                                <td className="px-8 py-6 text-center italic font-black text-zinc-300 dark:text-zinc-700 text-2xl group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors">
                                                    #{index + 4}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <Link href={`/u/${user.username}`} className="flex items-center gap-4 group-hover:translate-x-1 transition-transform">
                                                        <div className="relative">
                                                            {user.image ? (
                                                                // eslint-disable-next-line @next/next/no-img-element
                                                                <img 
                                                                    src={user.image} 
                                                                    alt={user.username === null ? "User" : user.username} 
                                                                    className="w-12 h-12 rounded-2xl object-cover border border-zinc-200 dark:border-zinc-800 shadow-sm" 
                                                                    referrerPolicy="no-referrer" 
                                                                />
                                                            ) : (
                                                                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
                                                                    <User className="w-6 h-6 text-zinc-400" />
                                                                </div>
                                                            )}
                                                            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center border-2 border-white dark:border-zinc-950 scale-0 group-hover:scale-100 transition-transform duration-300">
                                                                <Sparkles className="w-2.5 h-2.5 text-white" />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-zinc-900 dark:text-zinc-100">{user.name}</p>
                                                            <p className="text-xs font-bold text-zinc-400">@{user.username}</p>
                                                        </div>
                                                    </Link>
                                                </td>
                                                <td className="px-8 py-6 hidden lg:table-cell">
                                                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
                                                        <GraduationCap className="w-4 h-4 text-blue-500" />
                                                        {user.courseName}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="inline-flex flex-col items-end">
                                                        <div className="flex items-center gap-2 font-black text-xl text-zinc-900 dark:text-zinc-100">
                                                            {user.uploadCount}
                                                            <Medal className="w-5 h-5 text-blue-500 opacity-50" />
                                                        </div>
                                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-0.5">Verified</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-zinc-950 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-16 text-center">
                            <div className="bg-zinc-50 dark:bg-zinc-900 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
                                <Trophy className="w-10 h-10 text-zinc-300" />
                            </div>
                            <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 mb-2">No other rankings yet</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto font-medium">Be the next high-impact contributor and secure your spot in the global rankings!</p>
                        </div>
                    )}
                </div>

                <footer className="pt-20 text-center space-y-4">
                    <ContributorAction />
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                        Patna University Digital Library Community Ranking System
                    </p>
                </footer>

            </main>
        </div>
    );
}

function PodiumCard({ user, rank, variant }: { user: LeaderboardUser, rank: number, variant: "gold" | "silver" | "bronze" }) {
    const configs = {
        gold: {
            bg: "bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/10 dark:to-amber-900/20",
            border: "border-yellow-200 dark:border-yellow-500/30",
            icon: <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500/20" />,
            medal: "bg-yellow-500 text-white",
            shadow: "shadow-yellow-500/10",
            avatarBorder: "border-yellow-400 dark:border-yellow-500/50"
        },
        silver: {
            bg: "bg-gradient-to-br from-zinc-50 to-slate-200 dark:from-zinc-900/10 dark:to-slate-900/20",
            border: "border-zinc-200 dark:border-zinc-500/30",
            icon: <Medal className="w-6 h-6 text-zinc-400 fill-zinc-400/20" />,
            medal: "bg-zinc-400 text-white",
            shadow: "shadow-zinc-500/10",
            avatarBorder: "border-zinc-300 dark:border-zinc-400/50"
        },
        bronze: {
            bg: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/10 dark:to-orange-900/20",
            border: "border-orange-200 dark:border-orange-500/30",
            icon: <Medal className="w-6 h-6 text-orange-600 fill-orange-600/20" />,
            medal: "bg-orange-600 text-white",
            shadow: "shadow-orange-500/10",
            avatarBorder: "border-orange-400 dark:border-orange-500/50"
        }
    };

    const config = configs[variant];

    return (
        <Link
            href={`/u/${user.username}`}
            className={`group relative flex flex-col items-center w-full max-w-[280px] ${config.bg} border ${config.border} rounded-[3rem] p-8 pb-10 ${config.shadow} hover:scale-105 transition-all duration-500 overflow-hidden shadow-2xl`}
        >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 inset-x-0 h-1/2 bg-white/40 dark:bg-black/20 blur-2xl rounded-full translate-y-[-40%]" />

            {/* Rank Bubble */}
            <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-10 ${config.medal} rounded-2xl flex items-center justify-center font-black text-lg border-4 border-white dark:border-zinc-950 shadow-lg group-hover:rotate-[360deg] transition-transform duration-700`}>
                {rank}
            </div>

            <div className="absolute top-6 right-6 opacity-40 group-hover:opacity-100 transition-opacity">
                {config.icon}
            </div>

            {/* Avatar Section */}
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-white/20 blur-xl scale-125" />
                {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                        src={user.image} 
                        alt={user.username === null ? "User" : user.username} 
                        className={`relative w-28 h-28 rounded-[2.5rem] object-cover border-4 ${config.avatarBorder} bg-white dark:bg-zinc-800 shadow-xl`} 
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div className={`relative w-28 h-28 rounded-[2.5rem] flex items-center justify-center bg-white dark:bg-zinc-900 border-4 ${config.avatarBorder} shadow-xl`}>
                        <User className="w-12 h-12 text-zinc-300" />
                    </div>
                )}
            </div>

            <div className="text-center space-y-1 w-full relative z-10">
                <h3 className="font-black text-xl text-zinc-900 dark:text-zinc-100 truncate">{user.name}</h3>
                <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 truncate tracking-tight">@{user.username}</p>
            </div>

            <div className="mt-8 relative z-10">
                <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{user.uploadCount}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 mt-0.5">Items Uploaded</span>
                </div>
            </div>

            {/* Decorative Sparkle for #1 */}
            {variant === "gold" && (
                <div className="absolute -bottom-2 -left-2 opacity-50 animate-bounce">
                    <Sparkles className="w-12 h-12 text-white fill-white/10 blur-sm" />
                </div>
            )}
        </Link>
    );
}
