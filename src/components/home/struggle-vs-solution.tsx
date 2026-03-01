import { MessageCircle, FileDown, FolderOpen, ChevronRight, Check } from "lucide-react";
import ClickSpark from "@/components/reactbits/ClickSpark";

export default function StruggleVsSolution() {
    return (
        <section className="w-full py-24 md:py-32 px-4 relative overflow-hidden bg-zinc-50 dark:bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 md:mb-24 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Stop begging for notes.
                    </h2>
                    <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                        We built the tool we always wished we had. No more chaotic group chats or broken Drive links.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto relative">

                    {/* The "VS" Badge in the center */}
                    <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full items-center justify-center font-bold text-zinc-400 dark:text-zinc-500 z-10 shadow-sm">
                        VS
                    </div>

                    {/* Left Side: The Old Way (WhatsApp Chaos) */}
                    <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 overflow-hidden flex flex-col p-6 shadow-inner">
                        <div className="absolute top-0 left-0 w-full p-4 border-b border-red-100 dark:border-red-900/30 flex items-center gap-3 bg-red-50/80 dark:bg-red-950/40 backdrop-blur-md z-10">
                            <div className="w-10 h-10 rounded-full bg-red-200 dark:bg-red-900/50 flex items-center justify-center shrink-0">
                                <MessageCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-red-900 dark:text-red-400 text-sm">BCA Official Group (Sem 3) 💀</h3>
                                <p className="text-xs text-red-700/70 dark:text-red-500/70">142 participants, 28 online</p>
                            </div>
                        </div>

                        {/* Fake Chat Interface */}
                        <div className="flex-1 mt-16 space-y-4 overflow-hidden relative opacity-70 flex flex-col">
                            {/* Chat bubbles */}
                            <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl rounded-tl-sm shadow-sm border border-zinc-200 dark:border-zinc-800 max-w-[85%] self-start text-sm text-zinc-700 dark:text-zinc-300">
                                Bro anyone have 2022 OOPs PYQ?? Need immediately! 😭
                            </div>
                            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-2xl rounded-tr-sm shadow-sm border border-red-200 dark:border-red-800/50 max-w-[85%] self-end text-sm text-red-900 dark:text-red-200">
                                Check the pinned messages
                            </div>
                            <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl rounded-tl-sm shadow-sm border border-zinc-200 dark:border-zinc-800 max-w-[85%] self-start text-sm text-zinc-700 dark:text-zinc-300">
                                The drive link in pinned is expired bro 💀
                            </div>
                            <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl rounded-tl-sm shadow-sm border border-zinc-200 dark:border-zinc-800 max-w-[85%] self-start text-sm text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                                <FileDown className="h-4 w-4 text-zinc-400" />
                                <span className="text-blue-500 underline line-through">notes_final_v2.pdf</span>
                            </div>
                            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-2xl rounded-tr-sm shadow-sm border border-red-200 dark:border-red-800/50 max-w-[85%] self-end text-sm text-red-900 dark:text-red-200">
                                Ask seniors tomorrow I guess 🤷‍♂️
                            </div>
                        </div>

                        <div className="absolute font-black tracking-tighter text-red-600/10 dark:text-red-400/5 text-7xl md:text-8xl bottom-10 -right-4 -rotate-12 pointer-events-none select-none">
                            THE OLD WAY
                        </div>
                    </div>

                    {/* Right Side: The New Way (PU Digital Library UI) */}
                    <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 dark:from-emerald-500/20 dark:to-blue-600/20 border border-emerald-200/50 dark:border-emerald-800/30 overflow-hidden flex flex-col p-6 shadow-2xl">

                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-400/20 blur-[100px] rounded-full pointer-events-none -z-10"></div>

                        <div className="relative z-10 h-full flex flex-col">
                            {/* Fake App header */}
                            <div className="flex items-center gap-2 mb-6 md:mb-8">
                                <FolderOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                <h3 className="font-bold text-zinc-900 dark:text-white text-lg">Semester 3 / Resources</h3>
                            </div>

                            {/* Organized List */}
                            <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                                {[
                                    { title: "Object Oriented Programming (C++)", year: "2020-2023", items: "4 PDFs" },
                                    { title: "Data Structures & Algorithms", year: "2019-2023", items: "6 PDFs" },
                                    { title: "System Analysis & Design", year: "Official Syllabus", items: "Updated" },
                                    { title: "Computer Organization", year: "Topper Notes", items: "Verified" }
                                ].map((row, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-white/40 dark:border-zinc-700/50 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer group gap-3 sm:gap-0">
                                        <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
                                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                                                <Check className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold text-zinc-900 dark:text-white text-sm truncate">{row.title}</p>
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400">{row.year}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="text-xs font-medium bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md text-zinc-600 dark:text-zinc-300">
                                                {row.items}
                                            </span>
                                            <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 md:mt-auto pt-4 relative">
                                <ClickSpark className="w-full">
                                    <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95">
                                        Open Vault
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </ClickSpark>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}
