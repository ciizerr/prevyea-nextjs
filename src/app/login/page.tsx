"use client";

import Link from "next/link";
import { Github, X, Sparkles, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { loginWithGoogle, loginWithGithub } from "@/actions/auth";
import { motion } from "framer-motion";
import ClickSpark from "@/components/reactbits/ClickSpark";

export default function LoginPage() {

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-[#050505] font-sans overflow-hidden">

            {/* Left Side: Branding & Illustration (Hidden on Mobile) */}
            <div className="hidden md:flex flex-col justify-between w-1/2 bg-zinc-50 dark:bg-[#080808] border-r border-zinc-100 dark:border-zinc-900 p-16 lg:p-24 relative overflow-hidden">
                {/* High-End Ambient Glow */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

                {/* Logo Area */}
                <Link href="/" className="relative z-10 flex items-center gap-4 group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500 blur-md opacity-20 dark:opacity-40 group-hover:opacity-60 transition-opacity" />
                        <div className="relative bg-zinc-950 dark:bg-zinc-100 p-2 rounded-2xl transition-transform group-hover:scale-105 duration-500 overflow-hidden">
                            <Image 
                                src="/img-512x512.webp" 
                                alt="PU Library Logo" 
                                width={36} 
                                height={36} 
                                className="object-cover"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-xl tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">PU Library</span>
                        <span className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mt-1">Digital Archive</span>
                    </div>
                </Link>

                {/* Main Copy */}
                <div className="relative z-10 max-w-lg space-y-12">
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-full border border-indigo-100 dark:border-indigo-500/20 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-6">
                                Restricted Access
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter leading-[0.9]">
                                Secure your <br />
                                <span className="text-zinc-400">academic edge.</span>
                            </h1>
                        </motion.div>
                        <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-md">
                            Authentication required to access the full 14,000+ document archive and verified answer keys.
                        </p>
                    </div>

                    {/* Premium Security Badge */}
                    <div className="flex items-center gap-6 p-6 bg-white dark:bg-zinc-900/50 rounded-[2rem] border border-zinc-100 dark:border-zinc-800/80 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] dark:shadow-none">
                        <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl flex items-center justify-center shrink-0">
                            <ShieldCheck className="h-7 w-7 text-emerald-500" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-black text-sm text-zinc-900 dark:text-zinc-50">Instant Verification</p>
                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">End-to-End Encrypted Auth</p>
                        </div>
                    </div>
                </div>

                {/* Footer Quote */}
                <div className="relative z-10 space-y-2 opacity-50">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Trusted by the PUC core</p>
                    <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 italic">
                        &quot;Standardizing the vocational learning experience.&quot;
                    </p>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-24 xl:px-32 relative bg-white dark:bg-[#050505] min-h-[100dvh]">
                {/* Mobile Ambient Glow */}
                <div className="md:hidden absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                    <div className="absolute -top-[10%] -right-[10%] w-64 h-64 bg-indigo-500/5 dark:bg-indigo-600/10 blur-[80px] rounded-full" />
                    <div className="absolute -bottom-[5%] -left-[5%] w-48 h-48 bg-emerald-500/5 blur-[80px] rounded-full" />
                </div>

                {/* Close button - Enhanced for Mobile Tapability */}
                <Link href="/" className="absolute top-6 right-6 p-4 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-2xl transition-all duration-300 z-50 group" title="Back to home">
                    <X className="h-6 w-6 transition-transform group-hover:rotate-90" />
                </Link>

                <div className="w-full max-w-sm mx-auto space-y-10 md:space-y-12 relative z-10">
                    {/* Mobile Header - Refined */}
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden flex flex-col items-center gap-4 mb-12"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
                            <div className="relative bg-zinc-950 dark:bg-zinc-100 p-2.5 rounded-2xl shadow-2xl">
                                <Image src="/img-512x512.webp" alt="Logo" width={44} height={44} className="rounded-xl" />
                            </div>
                        </div>
                        <div className="text-center">
                            <span className="font-black text-2xl tracking-tight text-zinc-900 dark:text-zinc-50 block leading-none">PU Library</span>
                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mt-2 block">Digital Archive</span>
                        </div>
                    </motion.div>

                    <div className="space-y-4 text-center md:text-left">
                        <h2 className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter leading-none">Identity Check.</h2>
                        <p className="text-zinc-400 dark:text-zinc-500 font-bold text-[10px] sm:text-[11px] uppercase tracking-widest">Select your authentication method</p>
                    </div>

                    <div className="space-y-4">
                        <ClickSpark className="w-full">
                            <form action={loginWithGoogle}>
                                <button type="submit" className="group w-full flex justify-center items-center py-5 px-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-[1.5rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-none text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all active:scale-95">
                                    <svg className="h-5 w-5 mr-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Continue with Google
                                </button>
                            </form>
                        </ClickSpark>
                        
                        <ClickSpark className="w-full">
                            <form action={loginWithGithub}>
                                <button type="submit" className="group w-full flex justify-center items-center py-5 px-6 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-[1.5rem] shadow-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95">
                                    <Github className="h-5 w-5 mr-4 transition-transform group-hover:rotate-12" />
                                    Account for GitHub
                                </button>
                            </form>
                        </ClickSpark>
                    </div>

                    <div className="pt-8 md:pt-12 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-900" />
                            <Sparkles className="h-4 w-4 text-zinc-300 dark:text-zinc-700" />
                            <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-900" />
                        </div>
                        
                        <p className="text-center text-[10px] text-zinc-400 font-black uppercase tracking-widest leading-loose sm:leading-relaxed">
                            By verifying your identity, you accept our <br />
                            <Link href="/docs#terms" className="text-zinc-900 dark:text-zinc-100 underline decoration-indigo-500/30 underline-offset-4">Terms Protocol</Link> and <Link href="/docs#privacy" className="text-zinc-900 dark:text-zinc-100 underline decoration-indigo-500/30 underline-offset-4">Data Policy</Link>.
                        </p>
                    </div>
                </div>

                {/* Bottom Branding - Responsive Safe Area */}
                <div className="mt-auto pt-12 pb-6 md:pb-0 md:absolute md:bottom-12 md:left-1/2 md:-translate-x-1/2 text-[10px] font-black text-zinc-300 dark:text-zinc-800 uppercase tracking-[0.6em] pointer-events-none whitespace-nowrap text-center">
                    PU Library Digital
                </div>
            </div>
        </div>
    );
}
