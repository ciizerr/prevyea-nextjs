"use client";

import { useEffect, useRef } from "react";
import { incrementViewAction } from "@/actions/curriculum";

export function ViewTracker({ id }: { id: string }) {
    const hasTracked = useRef(false);

    useEffect(() => {
        if (!hasTracked.current) {
            hasTracked.current = true;
            incrementViewAction(id).catch(console.error);
        }
    }, [id]);

    return null;
}
