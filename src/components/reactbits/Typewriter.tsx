"use client";

import { useState, useEffect } from "react";

interface TypewriterProps {
    phrases: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    delayBetweenPhrases?: number;
    className?: string;
    cursorChar?: string;
    cursorClassName?: string;
    cursorColor?: string;
}

export default function Typewriter({
    phrases,
    typingSpeed = 50,
    deletingSpeed = 30,
    delayBetweenPhrases = 2000,
    className = "",
    cursorChar = "_",
    cursorClassName = "animate-pulse",
    cursorColor,
}: TypewriterProps) {
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        const type = () => {
            const currentPhrase = phrases[currentPhraseIndex];

            if (isDeleting) {
                // Deleting text
                setCurrentText((prev) => prev.slice(0, -1));

                if (currentText === "") {
                    setIsDeleting(false);
                    setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
                }
            } else {
                // Typing text
                setCurrentText(currentPhrase.slice(0, currentText.length + 1));

                if (currentText === currentPhrase) {
                    timer = setTimeout(() => setIsDeleting(true), delayBetweenPhrases);
                    return;
                }
            }
        };

        const speed = isDeleting ? deletingSpeed : typingSpeed;
        timer = setTimeout(type, speed);

        return () => clearTimeout(timer);
    }, [currentText, isDeleting, currentPhraseIndex, phrases, typingSpeed, deletingSpeed, delayBetweenPhrases]);

    return (
        <span className={className}>
            {currentText}
            <span
                className={cursorClassName}
                style={{ color: cursorColor }}
            >
                {cursorChar}
            </span>
        </span>
    );
}
