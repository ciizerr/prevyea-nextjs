"use client";

import { useState, useEffect } from "react";
import Plasma from "@/components/reactbits/Plasma";

export default function PlasmaBackground() {
    const [plasmaColor, setPlasmaColor] = useState<string | undefined>(undefined);

    useEffect(() => {
        const timer = setTimeout(() => {
            const color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
            setPlasmaColor(color);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

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
