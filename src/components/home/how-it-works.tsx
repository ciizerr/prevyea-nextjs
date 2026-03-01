import { Search, UserPlus, UploadCloud } from "lucide-react";
import ScrollFloat from "@/components/reactbits/ScrollFloat";

export default function HowItWorks() {
    return (
        <section className="w-full py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center mb-16">
                    <ScrollFloat
                        animationDuration={1}
                        ease="back.inOut(2)"
                        scrollStart="center bottom+=50%"
                        scrollEnd="bottom bottom-=40%"
                        stagger={0.03}
                        textClassName="!text-3xl md:!text-5xl font-bold tracking-tight text-center"
                    >
                        How It Works
                    </ScrollFloat>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-2">
                            <Search className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold">1. Search & Find</h3>
                        <p className="text-zinc-600 dark:text-zinc-400">Instantly locate verified PYQs, official syllabi, and related study materials.</p>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="h-16 w-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-2">
                            <UserPlus className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold">2. Create a Free Account</h3>
                        <p className="text-zinc-600 dark:text-zinc-400">Log in to unlock full PDF downloads and save files to your personal dashboard.</p>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-2">
                            <UploadCloud className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold">3. Contribute</h3>
                        <p className="text-zinc-600 dark:text-zinc-400">Upload your own PDFs and past papers to help junior batches succeed.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
