import { ChevronRight, Upload } from "lucide-react";
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

                <h2 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter leading-[0.9] text-white mix-blend-difference drop-shadow-sm">
                    Stop searching.<br />
                    <span className="text-zinc-500">Start studying.</span>
                </h2>

                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full max-w-2xl mx-auto">
                    <ClickSpark className="w-full sm:w-1/2">
                        <Link href="#" className="w-full h-16 bg-white hover:bg-zinc-200 text-black font-bold text-lg rounded-2xl flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-white/10">
                            Enter the Library
                            <ChevronRight className="h-5 w-5" />
                        </Link>
                    </ClickSpark>

                    <ClickSpark className="w-full sm:w-1/2">
                        <Link href="#" className="w-full h-16 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 font-bold text-lg rounded-2xl flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95">
                            <Upload className="h-5 w-5" />
                            Contribute a Paper
                        </Link>
                    </ClickSpark>
                </div>

                <p className="text-zinc-500 font-medium text-sm max-w-md mx-auto">
                    Join hundreds of vocational students sharing resources and saving semesters.
                </p>
            </div>

            {/* Minimalist Legal Bottom Strip */}
            <div className="w-full max-w-7xl mx-auto mt-24 pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-2 text-zinc-400 font-bold text-xl tracking-tight">
                    PU Digital Library
                </div>

                <div className="flex items-center gap-6 text-sm text-zinc-500 font-medium">
                    <Link href="#" className="hover:text-zinc-300 transition-colors">Privacy</Link>
                    <Link href="#" className="hover:text-zinc-300 transition-colors">Terms</Link>
                    <Link href="#" className="hover:text-zinc-300 transition-colors">Disclaimer</Link>
                </div>

                <div className="text-sm font-medium text-zinc-600">
                    © {new Date().getFullYear()} Student Led Initiative.
                </div>
            </div>
        </footer>
    );
}
