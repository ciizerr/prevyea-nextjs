"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Hero from "@/components/home/hero";
import CourseGrid from "@/components/home/course-grid";
import StruggleVsSolution from "@/components/home/struggle-vs-solution";
import SneakPeek from "@/components/home/sneak-peek";
import LibraryStats from "@/components/home/library-stats";
import WallOfFame from "@/components/home/wall-of-fame";
import RecentAdditions from "@/components/home/recent-additions";
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

      <div className="relative z-0 flex flex-col w-full">
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 w-full flex flex-col">
          <Hero themeColor={plasmaColor} />
          <StruggleVsSolution />
          <CourseGrid />
          <SneakPeek />
          <LibraryStats />
          <WallOfFame />
          <RecentAdditions />
        </main>

        <Footer />
      </div>
    </div>
  );
}
