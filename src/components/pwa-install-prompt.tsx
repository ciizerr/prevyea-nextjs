"use client";

import { useState, useEffect, useCallback } from "react";
import { Download, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] =
        useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [showIOSPrompt, setShowIOSPrompt] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        // Don't show if already installed (standalone mode)
        if (window.matchMedia("(display-mode: standalone)").matches) return;

        // Don't show if user dismissed it recently (24h cooldown)
        const dismissed = localStorage.getItem("pwa-prompt-dismissed");
        if (dismissed) {
            const dismissedAt = parseInt(dismissed, 10);
            if (Date.now() - dismissedAt < 24 * 60 * 60 * 1000) return;
        }

        // Check for iOS Safari (no beforeinstallprompt support)
        const isIOS =
            /iPad|iPhone|iPod/.test(navigator.userAgent) &&
            !(window as unknown as { MSStream?: unknown }).MSStream;
        const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

        if (isIOS && isSafari) {
            // Show iOS-specific instructions after a short delay
            const timer = setTimeout(() => setShowIOSPrompt(true), 3000);
            return () => clearTimeout(timer);
        }

        // For Android/Chrome — listen for the native install event
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            // Small delay so it doesn't pop immediately on page load
            setTimeout(() => setShowPrompt(true), 2000);
        };

        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = useCallback(async () => {
        if (!deferredPrompt) return;
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
            setShowPrompt(false);
        }
        setDeferredPrompt(null);
    }, [deferredPrompt]);

    const handleDismiss = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            setShowPrompt(false);
            setShowIOSPrompt(false);
            setIsClosing(false);
            localStorage.setItem("pwa-prompt-dismissed", Date.now().toString());
        }, 300);
    }, []);

    // Android / Chrome install banner
    if (showPrompt) {
        return (
            <div
                className={`fixed bottom-0 inset-x-0 z-[100] p-4 transition-all duration-300 ${isClosing
                    ? "translate-y-full opacity-0"
                    : "translate-y-0 opacity-100"
                    }`}
            >
                <div className="max-w-md mx-auto bg-zinc-900 border border-zinc-700/50 rounded-2xl p-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
                    <div className="flex items-start gap-3">
                        {/* App Icon */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Smartphone className="w-6 h-6 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-white">
                                    Install PU Library
                                </h3>
                                <button
                                    onClick={handleDismiss}
                                    className="p-1 rounded-lg hover:bg-zinc-800 transition-colors"
                                    aria-label="Dismiss install prompt"
                                >
                                    <X className="w-4 h-4 text-zinc-400" />
                                </button>
                            </div>
                            <p className="text-xs text-zinc-400 mt-0.5">
                                Get the full app experience — faster access, no address bar!
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleInstall}
                        className="w-full mt-3 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 active:scale-[0.98]"
                    >
                        <Download className="w-4 h-4" />
                        Install App
                    </button>
                </div>
            </div>
        );
    }

    // iOS Safari instructions
    if (showIOSPrompt) {
        return (
            <div
                className={`fixed bottom-0 inset-x-0 z-[100] p-4 transition-all duration-300 ${isClosing
                    ? "translate-y-full opacity-0"
                    : "translate-y-0 opacity-100"
                    }`}
            >
                <div className="max-w-md mx-auto bg-zinc-900 border border-zinc-700/50 rounded-2xl p-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Smartphone className="w-6 h-6 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-white">
                                    Install PU Library
                                </h3>
                                <button
                                    onClick={handleDismiss}
                                    className="p-1 rounded-lg hover:bg-zinc-800 transition-colors"
                                    aria-label="Dismiss install prompt"
                                >
                                    <X className="w-4 h-4 text-zinc-400" />
                                </button>
                            </div>
                            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                                Tap the{" "}
                                <span className="inline-flex items-center text-blue-400 font-medium">
                                    Share
                                    <svg
                                        className="w-3.5 h-3.5 ml-0.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                        />
                                    </svg>
                                </span>{" "}
                                button, then{" "}
                                <span className="text-white font-medium">
                                    &quot;Add to Home Screen&quot;
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
