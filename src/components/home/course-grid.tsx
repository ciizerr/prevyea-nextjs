import { BookOpen, ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import ClickSpark from "@/components/reactbits/ClickSpark";

export default function CourseGrid() {
    return (
        <section className="w-full py-20 bg-transparent border-y border-zinc-200/50 dark:border-zinc-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight">Select Your Course</h2>
                    <p className="text-zinc-500 mt-2">Browse organized collections of study material.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {/* Highlighted Card */}
                    <ClickSpark className="relative w-full">
                        <Link href="#" className="group relative bg-white dark:bg-zinc-900 rounded-2xl p-8 border-2 border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all text-center flex flex-col items-center justify-center gap-4 h-full">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-[100px] rounded-tr-xl pointer-events-none" />
                            <BookOpen className="h-10 w-10 text-blue-600 dark:text-blue-500" />
                            <h3 className="text-xl font-bold">BCA</h3>
                            <p className="text-sm text-zinc-500 font-medium">(Bachelor of Computer Applications)</p>
                            <div className="mt-2 text-blue-600 dark:text-blue-400 text-sm font-semibold flex items-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                                Browse Papers <ArrowRight className="ml-1 h-4 w-4" />
                            </div>
                        </Link>
                    </ClickSpark>


                    {/* Standard Cards */}
                    <ClickSpark className="relative w-full">
                        <Link href="#" className="group bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg transition-all text-center flex flex-col items-center justify-center gap-4 h-full">
                            <FileText className="h-10 w-10 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
                            <h3 className="text-xl font-bold">BBA / BBM</h3>
                            <p className="text-sm text-zinc-500 font-medium">Business Administration</p>
                        </Link>
                    </ClickSpark>

                    <ClickSpark className="relative w-full">
                        <Link href="#" className="group bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg transition-all text-center flex flex-col items-center justify-center gap-4 h-full">
                            <FileText className="h-10 w-10 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
                            <h3 className="text-xl font-bold">B.Sc. IT / Biotech</h3>
                            <p className="text-sm text-zinc-500 font-medium">Information Tech & Science</p>
                        </Link>
                    </ClickSpark>
                </div>

                <p className="text-center text-sm text-zinc-400 mt-10">
                    Looking for regular courses (B.A/B.Sc/B.Com)? Expansion coming soon.
                </p>
            </div>
        </section>
    );
}
