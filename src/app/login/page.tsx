"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Library, ArrowRight, Github, X } from "lucide-react";
import { loginAction, loginWithGoogle, loginWithGithub } from "@/actions/auth";
import BlurText from "@/components/reactbits/BlurText";
import ClickSpark from "@/components/reactbits/ClickSpark";

export default function LoginPage() {
    const [error, setError] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const onSubmit = async (formData: FormData) => {
        setError("");
        startTransition(async () => {
            const result = await loginAction(formData);
            if (result?.error) {
                setError(result.error);
            }
        });
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-zinc-950 font-sans">

            {/* Left Side: Branding & Illustration (Hidden on Mobile) */}
            <div className="hidden md:flex flex-col justify-between w-1/2 bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-12 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/20 dark:bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

                {/* Logo Area */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-sm">
                        <Library className="h-6 w-6" />
                    </div>
                    <span className="font-extrabold text-2xl tracking-tight text-zinc-900 dark:text-white">PU Library</span>
                </div>

                {/* Main Copy */}
                <div className="relative z-10 max-w-md">
                    <BlurText
                        text="Welcome back to your academic arsenal."
                        delay={50}
                        className="text-4xl lg:text-5xl font-black text-zinc-900 dark:text-white leading-tight mb-6"
                    />
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                        Access thousands of strictly curated PYQs, comprehensive syllabi, and community notes to ace your upcoming examinations.
                    </p>

                    {/* Visual Mockup/Abstract Graphic */}
                    <div className="w-full aspect-video rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 shadow-xl flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
                        <div className="w-1/3 h-4 bg-zinc-100 dark:bg-zinc-900 rounded-md"></div>
                        <div className="w-full h-12 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl mt-2"></div>
                        <div className="flex gap-3">
                            <div className="w-1/2 h-20 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl"></div>
                            <div className="w-1/2 h-20 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl"></div>
                        </div>
                    </div>
                </div>

                {/* Testimonial / Footer */}
                <div className="relative z-10 text-sm font-medium text-zinc-500 dark:text-zinc-400 animate-in fade-in duration-1000 delay-700">
                    &quot;This platform saved me during mid-terms. The UI is just the cherry on top.&quot; <br />
                    — <span className="text-zinc-900 dark:text-zinc-300 font-bold">Aman K.</span>, BCA 6th Sem
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24 xl:px-32 relative bg-white dark:bg-zinc-950">
                {/* Close button */}
                <Link href="/" className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors z-10" title="Back to home">
                    <X className="h-5 w-5" />
                </Link>
                {/* Mobile Logo Header */}
                <div className="md:hidden flex items-center justify-center gap-2.5 mb-12">
                    <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-sm">
                        <Library className="h-5 w-5" />
                    </div>
                    <span className="font-extrabold text-xl tracking-tight text-zinc-900 dark:text-white">PU Library</span>
                </div>

                <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                        <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Sign in to your account</h2>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                                Create one now <ArrowRight className="inline-block h-3 w-3 ml-0.5" />
                            </Link>
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Social Login Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <form action={loginWithGoogle}>
                                <button type="submit" className="w-full flex justify-center items-center py-2.5 px-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Google
                                </button>
                            </form>
                            <form action={loginWithGithub}>
                                <button type="submit" className="w-full flex justify-center items-center py-2.5 px-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border border-transparent rounded-xl shadow-sm text-sm font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors">
                                    <Github className="h-5 w-5 mr-2" />
                                    GitHub
                                </button>
                            </form>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-3 bg-white dark:bg-zinc-950 text-zinc-500 font-medium">Or continue with email</span>
                            </div>
                        </div>

                        {/* Traditional Form */}
                        <form action={onSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-red-600 dark:bg-red-500 rounded-full animate-pulse" />
                                    <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
                                </div>
                            )}
                            <div>
                                <label htmlFor="identifier" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                    Email address or Username
                                </label>
                                <input
                                    id="identifier"
                                    name="identifier"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    className="appearance-none block w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium sm:text-sm"
                                    placeholder="aman@example.com or @aman_bca"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label htmlFor="password" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                        Password
                                    </label>
                                    <div className="text-sm">
                                        <Link href="#" className="font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                                            Forgot password?
                                        </Link>
                                    </div>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none block w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>

                            <ClickSpark className="w-full pt-2">
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-zinc-950 transition-all active:scale-[0.98]"
                                >
                                    {isPending ? "Signing partially..." : "Sign In"}
                                </button>
                            </ClickSpark>
                        </form>
                    </div>

                    <p className="text-center text-xs text-zinc-500 font-medium pt-8">
                        By continuing, you agree to PU Library&apos;s <br className="sm:hidden" />
                        <Link href="#" className="underline hover:text-zinc-900 dark:hover:text-white transition-colors">Terms of Service</Link> and <Link href="#" className="underline hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy Policy</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
