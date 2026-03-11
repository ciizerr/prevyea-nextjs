"use client";

import { useState, useEffect } from "react";
import Plasma from "@/components/reactbits/Plasma";

export default function PlasmaBackground() {
    const [plasmaColor, setPlasmaColor] = useState<string | undefined>(undefined);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const timer = setTimeout(() => {
            const color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
            setPlasmaColor(color);
        }, 0);

        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    // Prevent hydration mismatch by showing a solid color initially
    if (!mounted) {
        return <div className="fixed inset-0 -z-50 bg-zinc-50 dark:bg-zinc-950 transition-opacity duration-500" />;
    }

    // On mobile devices, use a lightweight, static CSS background instead of heavy WebGL
    if (isMobile) {
        return (
            <div className="fixed inset-0 -z-50 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 transition-opacity duration-500" />
        );
    }

    return (
        <div className="fixed inset-0 -z-50 transition-opacity duration-500">
            <Plasma
                color={plasmaColor}
                speed={0.6}
                direction="forward"
                scale={1.1}
                opacity={0.8}
                mouseInteractive={true}
            />
        </div>
    );
}
