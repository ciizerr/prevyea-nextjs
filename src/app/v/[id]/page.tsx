import { getFileByIdAction } from "@/actions/curriculum";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import PDFViewer from "@/components/pdf-viewer";
import Link from "next/link";
import { ArrowLeft, Download, FileText, Share2, ShieldCheck, User } from "lucide-react";
import dayjs from "dayjs";

interface PaperPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PaperPageProps): Promise<Metadata> {
    const { id } = await params;
    const { success, data: paper } = await getFileByIdAction(id);

    if (!success || !paper) {
        return {
            title: "Paper Not Found | PU Digital Library",
        };
    }

    return {
        title: `${paper.year} ${paper.title} | ${paper.subjectName}`,
        description: `View and download ${paper.type} for ${paper.subjectName} (${paper.courseName}). Uploaded by ${paper.uploaderName || "Community"}.`,
        openGraph: {
            title: `${paper.year} ${paper.title} - ${paper.subjectName}`,
            description: `Academic resource for ${paper.courseName} students.`,
            type: "article",
        },
    };
}

export default async function PaperPage({ params }: PaperPageProps) {
    const { id } = await params;
    const { success, data: paper } = await getFileByIdAction(id);

    if (!success || !paper) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-[#fcfcfd] dark:bg-black selection:bg-indigo-100 dark:selection:bg-indigo-900/40">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-20">
                {/* Navigation Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div className="space-y-4">
                        <Link 
                            href="/vault" 
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-indigo-500 transition-all group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Vault
                        </Link>
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter italic uppercase leading-none">
                                {paper.year} · {paper.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4">
                                <span className="px-3 py-1 bg-indigo-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                                    {paper.type}
                                </span>
                                <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                    {paper.courseName} · {paper.semester}
                                </span>
                                <span className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Verified Resource
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end mr-4">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Contributed by</span>
                            <Link href={`/u/${paper.uploaderUsername}`} className="font-black text-zinc-900 dark:text-zinc-100 hover:text-indigo-500 transition-colors">
                                {paper.uploaderName}
                            </Link>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 shrink-0">
                            <User className="w-6 h-6 text-zinc-400" />
                        </div>
                    </div>
                </div>

                {/* PDF Viewer Container */}
                <div className="relative bg-white dark:bg-zinc-950/40 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden h-[850px] group transition-all duration-500 hover:border-indigo-500/30">
                    <PDFViewer 
                        url={paper.viewLink} 
                        downloadUrl={paper.downloadLink}
                        fileLabel={`${paper.year} - ${paper.title}`}
                    />
                </div>

                {/* Info Footer */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white dark:bg-zinc-900/40 p-10 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800/60 shadow-xl space-y-4">
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight italic uppercase">Subject</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 font-medium">{paper.subjectName}</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900/40 p-10 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800/60 shadow-xl space-y-4">
                        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                            <Download className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight italic uppercase">Activity</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 font-medium">{paper.downloads || 0} Downloads</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900/40 p-10 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800/60 shadow-xl space-y-4">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                            <Share2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight italic uppercase">Shared On</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 font-medium">{dayjs(paper.createdAt).format('MMMM DD, YYYY')}</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Floating Share Branding */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 rounded-[2rem] shadow-2xl border border-white/10 dark:border-black/5 flex items-center gap-6 z-50">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap">PU Digital Library Vault</span>
                </div>
                <div className="w-px h-6 bg-white/20 dark:bg-black/10" />
                <Link href="/" className="text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
                    Join Archive
                </Link>
            </div>
        </div>
    );
}
