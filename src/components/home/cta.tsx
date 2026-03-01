import { Upload } from "lucide-react";
import ClickSpark from "@/components/reactbits/ClickSpark";

export default function CTA() {
    return (
        <section className="w-full py-24 px-4">
            <div className="max-w-4xl mx-auto bg-blue-600 dark:bg-blue-600/20 dark:border dark:border-blue-500/20 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Upload className="w-64 h-64" />
                </div>
                <div className="relative z-10 space-y-6">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white dark:text-blue-50">Have a past paper sitting in your gallery?</h2>
                    <p className="text-blue-100 dark:text-blue-200 text-lg md:text-xl max-w-2xl mx-auto">
                        Join the community. Upload documents, organize your study materials, and access the full customized dashboard.
                    </p>
                    <div className="pt-4 flex justify-center">
                        <ClickSpark
                            sparkColor="#fff"
                            sparkSize={10}
                            sparkRadius={15}
                            sparkCount={8}
                            duration={400}
                        >
                            <button className="bg-white text-blue-600 hover:bg-zinc-100 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-400 font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer">
                                Create Your Account
                            </button>
                        </ClickSpark>
                    </div>
                </div>
            </div>
        </section>
    );
}
