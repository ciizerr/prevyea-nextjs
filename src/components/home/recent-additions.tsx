import { FileText, ChevronRight } from "lucide-react";
import Link from "next/link";
import ClickSpark from "@/components/reactbits/ClickSpark";

export default function RecentAdditions({ pyqs }: { pyqs?: { id?: string; title: string; type: string; createdAt?: Date | null; }[] }) {
    const defaultData: { id?: string; title: string; type: string; createdAt?: Date | null; }[] = [
        { title: "BCA Semester 3 - Object Oriented Programming (2024)", type: "PYQ", createdAt: null },
        { title: "BCA Semester 1 - Math Syllabus Update", type: "Syllabus", createdAt: null },
        { title: "B.Sc. IT Semester 4 - Database Management Systems", type: "PYQ", createdAt: null },
        { title: "BBA Semester 2 - Business Economics Notes", type: "Notes", createdAt: null },
    ];

    const itemsToRender = pyqs && pyqs.length > 0 ? pyqs : defaultData;

    return (
        <section className="w-full py-20 bg-transparent border-y border-zinc-200/50 dark:border-zinc-800/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Recently Added</h2>
                        <p className="text-zinc-500 mt-1">Fresh study materials uploaded by the community.</p>
                    </div>
                    <ClickSpark className="relative inline-flex">
                        <Link href="/vault" className="hidden sm:flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                            View all <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                    </ClickSpark>
                </div>

                <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                    {itemsToRender.map((item, i) => (
                        <div key={item.id || i} className={`flex items-center justify-between p-5 sm:px-6 ${i !== itemsToRender.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800/60' : ''} hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group`}>
                            <div className="flex items-start sm:items-center gap-4">
                                <div className="mt-0.5 sm:mt-0 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-500">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0 pr-4">
                                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">{item.title}</h4>
                                    <div className="text-xs font-medium text-zinc-500 mt-1 flex gap-2 items-center">
                                        <span className="bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded-md text-zinc-700 dark:text-zinc-300">{item.type}</span>
                                        <span>• {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Added recently'}</span>
                                    </div>
                                </div>
                            </div>
                            {/* Note: In a real app, clicking this triggers a login modal for unauthenticated users */}
                            <ClickSpark className="relative ml-auto shrink-0">
                                <Link
                                    href={item.id ? `/vault?search=${encodeURIComponent(item.title)}` : "/vault"}
                                    className="p-2 sm:px-4 sm:py-2 text-sm font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center transition-colors cursor-pointer w-full h-full"
                                >
                                    <span className="hidden sm:inline mr-2">View</span>
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </ClickSpark>
                        </div>
                    ))}
                </div>
                <ClickSpark className="relative sm:hidden w-full mt-6">
                    <Link href="/vault" className="flex justify-center w-full py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer text-center">
                        View all additions
                    </Link>
                </ClickSpark>
            </div>
        </section>
    );
}
