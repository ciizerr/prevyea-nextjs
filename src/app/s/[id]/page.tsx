import { getSubjectByIdAction, getFilesAction } from "@/actions/curriculum";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import PDFViewer from "@/components/pdf-viewer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Link from "next/link";
import { ArrowLeft, BookOpen, Download, Sparkles } from "lucide-react";
import MarkdownExportButton from "@/components/markdown-export-button";

interface SyllabusPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: SyllabusPageProps): Promise<Metadata> {
    const { id } = await params;
    const { success, data: subject } = await getSubjectByIdAction(id);

    if (!success || !subject) {
        return {
            title: "Syllabus Not Found | PU Digital Library",
        };
    }

    return {
        title: `Syllabus: ${subject.name} | ${subject.courseName}`,
        description: `Official syllabus for ${subject.name} - ${subject.semester} of ${subject.courseName} at Patna University.`,
        openGraph: {
            title: `Syllabus: ${subject.name}`,
            description: `Curriculum and course details for ${subject.courseName} students.`,
            type: "article",
        },
    };
}

export default async function SharedSyllabusPage({ params }: SyllabusPageProps) {
    const { id: subjectId } = await params;
    const { success: subjectSuccess, data: subject } = await getSubjectByIdAction(subjectId);

    if (!subjectSuccess || !subject) {
        return notFound();
    }

    // Fetch the syllabus file
    const { success: fileSuccess, data: files } = await getFilesAction(subjectId, ["Syllabus"]);
    const syllabusFile = fileSuccess && files && files.length > 0 ? files[0] : null;

    // Check if it's markdown
    const isMarkdown = syllabusFile?.viewLink.endsWith(".md") || syllabusFile?.downloadLink.endsWith(".md");
    let markdownContent = null;

    if (syllabusFile && isMarkdown) {
        try {
            const url = syllabusFile.downloadLink || syllabusFile.viewLink;
            const res = await fetch(url);
            if (res.ok) {
                markdownContent = await res.text();
            }
        } catch (error) {
            console.error("Markdown fetch error:", error);
        }
    }

    return (
        <div className="min-h-screen bg-[#fcfcfd] dark:bg-black selection:bg-blue-100 dark:selection:bg-blue-900/40">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 blur-[120px] rounded-full" />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div className="space-y-4">
                        <Link 
                            href="/syllabus" 
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-blue-500 transition-all group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Syllabus
                        </Link>
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter italic uppercase leading-none">
                                {subject.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4">
                                <span className="px-3 py-1 bg-blue-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                                    Official Syllabus
                                </span>
                                <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                    {subject.courseName} · {subject.semester}
                                </span>
                                <span className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Verified Curriculum
                                </span>
                            </div>
                        </div>
                    </div>

                    {syllabusFile && (
                        <div className="flex items-center gap-4">
                            {isMarkdown ? (
                                <MarkdownExportButton 
                                    elementId="markdown-content"
                                    fileName={`${subject.name} - Syllabus`}
                                    headerData={{
                                        title: subject.name,
                                        course: subject.courseName || undefined,
                                        semester: subject.semester || undefined
                                    }}
                                />
                            ) : (
                                <a
                                    href={syllabusFile.downloadLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-10 py-5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all active:scale-95 shrink-0"
                                >
                                    <Download className="w-4 h-4" />
                                    Download PDF
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="relative">
                    {!syllabusFile ? (
                        <div className="flex flex-col items-center justify-center py-40 text-center space-y-8 bg-white dark:bg-zinc-950/20 border-2 border-dashed border-zinc-100 dark:border-zinc-800/40 rounded-[4rem]">
                            <BookOpen className="h-20 w-20 text-zinc-200 dark:text-zinc-800" />
                            <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 uppercase italic tracking-tighter">Syllabus Missing</h3>
                            <p className="text-zinc-400 max-w-xs mx-auto">This syllabus hasn&apos;t been added to our digital vault yet.</p>
                            <Link href="/vault" className="text-[11px] font-black uppercase tracking-widest text-blue-500">Request Integration</Link>
                        </div>
                    ) : isMarkdown ? (
                        <div id="markdown-content" className="w-full bg-white dark:bg-zinc-950/40 p-8 md:p-16 rounded-[3rem] border border-zinc-200 dark:border-zinc-800/60 prose prose-zinc dark:prose-invert max-w-none shadow-2xl overflow-x-auto selection:bg-blue-100 dark:selection:bg-blue-900/40">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{markdownContent || ""}</ReactMarkdown>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-zinc-950/40 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden h-[850px]">
                            <PDFViewer 
                                url={syllabusFile.viewLink} 
                                downloadUrl={syllabusFile.downloadLink}
                                fileLabel={`${subject.name} - Syllabus`}
                            />
                        </div>
                    )}
                </div>

                {/* Footer Branding */}
                <div className="mt-20 flex flex-col items-center gap-6">
                    <div className="px-6 py-3 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-2xl shadow-xl flex items-center gap-4">
                        <div className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center">
                            <BookOpen className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Patna University Digital Library</span>
                    </div>
                </div>
            </main>
        </div>
    );
}
