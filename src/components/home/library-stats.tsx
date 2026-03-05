"use client";

import { useEffect, useState, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface AnimatedCounterProps {
    value: number;
    suffix?: string;
    label: string;
}

function AnimatedCounter({ value, suffix = "", label }: AnimatedCounterProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        stiffness: 50,
        damping: 15,
        mass: 1,
    });

    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, motionValue, value]);

    useEffect(() => {
        const unsubscribe = springValue.on("change", (latest) => {
            setDisplayValue(Math.floor(latest));
        });
        return () => unsubscribe();
    }, [springValue]);

    return (
        <div ref={ref} className="flex flex-col items-center justify-center p-6 text-center">
            <div className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 mb-2">
                {displayValue}{suffix}
            </div>
            <div className="text-sm md:text-base font-medium text-zinc-500 tracking-wide uppercase">
                {label}
            </div>
        </div>
    );
}

export default function LibraryStats({ stats }: { stats?: { pyqsCount: number, subjectsCount: number } }) {
    return (
        <section className="w-full py-20 bg-white dark:bg-[#0a0a0a] border-y border-zinc-200/50 dark:border-zinc-800/50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800">
                    <AnimatedCounter value={stats?.pyqsCount || 100} suffix="+" label="PDFs Archived" />
                    <AnimatedCounter value={stats?.subjectsCount || 5} suffix="+" label="Vocational Subjects" />
                    <AnimatedCounter value={0} suffix="" label="Hours Wasted" />
                </div>
            </div>
        </section>
    );
}
