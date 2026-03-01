"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import ClickSpark from "@/components/reactbits/ClickSpark";

export function ThemeToggle() {
    const { setTheme, theme, systemTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-9 h-9" />;
    }

    const currentTheme = theme === "system" ? systemTheme : theme;

    return (
        <ClickSpark className="relative inline-flex">
            <button
                onClick={() => setTheme(currentTheme === "light" ? "dark" : "light")}
                className="p-2 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition-all text-neutral-800 dark:text-neutral-200 cursor-pointer"
                aria-label="Toggle theme"
            >
                {currentTheme === "light" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </ClickSpark>
    );
}
