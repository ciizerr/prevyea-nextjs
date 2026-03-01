import { Search } from "lucide-react";
import GradualBlur from "@/components/reactbits/GradualBlur";
import BlurText from "@/components/reactbits/BlurText";
import ClickSpark from "@/components/reactbits/ClickSpark";

export default function Hero() {
    return (
        <section className="w-full py-20 md:py-32 px-4 relative overflow-hidden flex flex-col items-center justify-center text-center">
            {/* Subtle Background Gradients */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/10 dark:bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto space-y-8 relative z-10">
                <BlurText
                    text="The Ultimate Archive for Patna University Vocational PYQs."
                    delay={150}
                    animateBy="words"
                    direction="top"
                    className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-zinc-900 dark:text-white"
                />

                <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                    Skip the hunt for scattered notebooks. Find semester-wise past papers, official syllabi, and notes for BCA, B.Sc. IT, and more.
                </p>

                <div className="w-full max-w-2xl mx-auto mt-10">
                    <div className="relative group flex items-center shadow-lg dark:shadow-none rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
                        <div className="pl-4 pr-2">
                            <Search className="h-5 w-5 text-zinc-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search 'BCA Semester 3 PYQ', 'C++ Notes', 'Patna Science College syllabus'..."
                            className="flex-1 bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400/80 text-base py-3 min-w-0"
                        />
                        <ClickSpark
                            sparkColor="#fff"
                            sparkSize={10}
                            sparkRadius={15}
                            sparkCount={8}
                            duration={400}
                        >
                            <button className="hidden sm:block bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-semibold px-6 py-3 rounded-xl transition-colors whitespace-nowrap ml-2 cursor-pointer">
                                Search Library
                            </button>
                        </ClickSpark>
                    </div>
                    <ClickSpark className="relative sm:hidden w-full mt-3">
                        <button className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold px-6 py-3 rounded-xl cursor-pointer">
                            Search
                        </button>
                    </ClickSpark>
                </div>
            </div>

            {/* Gradual blur transition to next section */}
            <div className="absolute bottom-0 left-0 w-full h-32 z-20 pointer-events-none">
                <GradualBlur
                    position="bottom"
                    height="100%"
                    strength={5}
                    className="w-full"
                />
            </div>
        </section>
    );
}
