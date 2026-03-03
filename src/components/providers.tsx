"use client";

import { SessionProvider } from "next-auth/react";
import OnboardingModal from "@/components/onboarding-modal";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <OnboardingModal />
            {children}
        </SessionProvider>
    );
}
