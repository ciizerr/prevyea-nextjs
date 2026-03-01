"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Hero from "@/components/home/hero";
import CourseGrid from "@/components/home/course-grid";
import HowItWorks from "@/components/home/how-it-works";
import RecentAdditions from "@/components/home/recent-additions";
import CTA from "@/components/home/cta";
import Plasma from "@/components/reactbits/Plasma";

export default function Home() {
  const [plasmaColor, setPlasmaColor] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Generate a random hex color uniquely generated on client mount.
    // Wrapped in a tiny timeout to avoid React synchronous setState warnings during paint
    const timer = setTimeout(() => {
      const color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      setPlasmaColor(color);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-transparent text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Landing Page Exclusive Background Layer */}
      <div className="fixed inset-0 -z-50 opacity-40 dark:opacity-20 transition-opacity duration-500">
        <Plasma color={plasmaColor} />
      </div>

      <div className="relative z-0 flex whitespace-normal min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 w-full flex flex-col">
          <Hero />
          <CourseGrid />
          <HowItWorks />
          <RecentAdditions />
          <CTA />
        </main>
        <Footer />
      </div>
    </div>
  );
}
