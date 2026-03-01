import { Search, Sparkles, Terminal } from "lucide-react";
import Typewriter from "@/components/reactbits/Typewriter";
import ClickSpark from "@/components/reactbits/ClickSpark";

interface HeroProps {
    themeColor?: string;
}

export default function Hero({ themeColor }: HeroProps) {
    return (
        <section className="w-full relative overflow-hidden flex flex-col items-center justify-center text-center pt-24 pb-16 md:pt-32 md:pb-32 px-4 selection:bg-zinc-800 selection:text-emerald-400">
            {/* Darker, moodier background glow for the "CLI / Spotlight" feel */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1200px] overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-zinc-400/10 dark:bg-zinc-600/10 blur-[150px] rounded-full mix-blend-screen dark:mix-blend-screen" />

                {/* Subtle Floating Graphics (Mocked with decorative shapes) */}
                <div className="hidden md:block absolute top-[15%] left-[10%] w-32 h-40 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl rotate-12 opacity-50 backdrop-blur-3xl" />
                <div className="hidden md:block absolute top-[30%] right-[10%] w-24 h-32 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl -rotate-12 opacity-40 backdrop-blur-3xl" />
            </div>

            <div className="max-w-4xl mx-auto space-y-12 relative z-10 w-full mt-4 md:mt-10">
                {/* Typewriter Header Sequence */}
                <div className="space-y-4 max-w-3xl mx-auto h-[180px] sm:h-[150px] md:h-[220px] flex flex-col justify-end">
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-zinc-900 dark:text-zinc-100">
                        <Typewriter
                            phrases={[
                                "Looking for 2023 BCA papers?",
                                "Need Operating System notes?",
                                "Lost your syllabus?",
                                "Tired of begging seniors?",
                                "Want B.Sc. IT PYQs fast?"
                            ]}
                            typingSpeed={50}
                            deletingSpeed={30}
                            delayBetweenPhrases={2500}
                            cursorClassName="text-emerald-500 animate-pulse font-normal opacity-80"
                            cursorColor={themeColor}
                        />
                    </h1>
                </div>

                {/* Sleek Command-Line / Spotlight Search */}
                <div className="w-full max-w-2xl mx-auto mt-6 relative group">
                    {/* Glowing under-shadow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-zinc-500/30 to-zinc-400/30 dark:from-zinc-500/20 dark:to-zinc-600/20 rounded-2xl blur-lg transition duration-500 group-focus-within:opacity-100 group-focus-within:from-emerald-500/30 group-focus-within:to-indigo-500/30 opacity-70"></div>

                    <div className="relative flex items-center shadow-xl rounded-2xl bg-white dark:bg-zinc-950/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 p-1 sm:p-2 transition-all overflow-hidden group-focus-within:border-zinc-300 dark:group-focus-within:border-zinc-600">
                        <div className="pl-4 pr-2 flex items-center shrink-0">
                            <Terminal className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Type to search..."
                            className="flex-1 bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400/80 dark:placeholder:text-zinc-600 font-mono text-sm sm:text-base py-3 sm:py-4 min-w-0"
                            autoComplete="off"
                            spellCheck="false"
                        />
                        <div className="hidden sm:flex items-center gap-1 pr-3 opacity-60 pointer-events-none shrink-0">
                            <kbd className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 rounded text-zinc-500 dark:text-zinc-400">Ctrl</kbd>
                            <span className="text-zinc-400 text-xs">+</span>
                            <kbd className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 rounded text-zinc-500 dark:text-zinc-400">K</kbd>
                        </div>
                        <ClickSpark
                            sparkColor="#10b981"
                            sparkSize={8}
                            sparkRadius={15}
                            sparkCount={6}
                            duration={300}
                            className="shrink-0 pl-1"
                        >
                            <button className="flex bg-zinc-100 active:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:active:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-medium px-4 py-3 sm:px-6 sm:py-3 rounded-xl transition-all whitespace-nowrap cursor-pointer items-center justify-center">
                                <Search className="h-4 w-4 sm:hidden" />
                                <span className="hidden sm:inline">Search</span>
                                <Sparkles className="h-3.5 w-3.5 ml-1.5 text-zinc-400 hidden sm:inline" />
                            </button>
                        </ClickSpark>
                    </div>
                </div>

                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-500 mt-4 max-w-xl mx-auto tracking-wide uppercase">
                    Stop searching. Start Studying.
                </p>
            </div>
        </section>
    );
}
