import { ChevronRight } from "lucide-react";
import Link from "next/link";
import ClickSpark from "@/components/reactbits/ClickSpark";

export default function Footer() {
    return (
        <footer className="w-full min-h-[80vh] bg-black text-white flex flex-col items-center justify-between pt-32 pb-8 px-4 relative overflow-hidden selection:bg-zinc-800 selection:text-white">
            {/* Darker Grid Background Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_0%,#000_70%,transparent_110%)] opacity-30 pointer-events-none" />

            {/* Subtle top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-zinc-500 to-transparent opacity-50"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[200px] bg-zinc-500/10 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col items-center justify-center text-center relative z-10 space-y-12">

                <h2 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter leading-[0.9] text-white mix-blend-difference">
                    Stop searching.<br />
                    <span className="text-zinc-600">Start studying.</span>
                </h2>

                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full max-w-lg mx-auto">
                    <ClickSpark className="w-full sm:w-1/2">
                        <Link href="/vault" className="w-full h-16 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-2xl">
                            Explore Archive
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </ClickSpark>

                    <ClickSpark className="w-full sm:w-1/2">
                        <Link href="/vault" className="w-full h-16 bg-zinc-900 text-white border border-zinc-800 font-black text-xs uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95">
                            Contribute
                        </Link>
                    </ClickSpark>
                </div>

                <p className="text-zinc-600 font-black text-[10px] uppercase tracking-[0.4em] max-w-md mx-auto">
                    A community driven legacy for PU students.
                </p>
            </div>

            {/* Minimalist Legal Bottom Strip */}
            <div className="w-full max-w-7xl mx-auto mt-24 pt-8 border-t border-zinc-900/50 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-2 text-zinc-400 font-black text-xs uppercase tracking-widest">
                    PU Library Digital
                </div>

                <div className="flex items-center gap-8 text-[10px] text-zinc-600 font-black uppercase tracking-widest">
                    <Link href="/docs#privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
                    <Link href="/docs#terms" className="hover:text-zinc-300 transition-colors">Terms</Link>
                    <Link href="/docs#disclaimer" className="hover:text-zinc-300 transition-colors">Disclaimer</Link>
                </div>

                <div className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">
                    © {new Date().getFullYear()} Student Led Initiative.
                </div>
            </div>
        </footer>
    );
}
