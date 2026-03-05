import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Hero from "@/components/home/hero";
import CourseGrid from "@/components/home/course-grid";
import StruggleVsSolution from "@/components/home/struggle-vs-solution";
import SneakPeek from "@/components/home/sneak-peek";
import LibraryStats from "@/components/home/library-stats";
import WallOfFame from "@/components/home/wall-of-fame";
import RecentAdditions from "@/components/home/recent-additions";
import PlasmaBackground from "@/components/home/plasma-background";

import { getLandingStats, getRecentPyqs } from "@/actions/public";

export default async function Home() {
  const stats = await getLandingStats();
  const recent = await getRecentPyqs();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-transparent text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <PlasmaBackground />

      <div className="relative z-0 flex flex-col w-full">
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 w-full flex flex-col">
          <Hero />
          <StruggleVsSolution />
          <CourseGrid />
          <SneakPeek />
          <LibraryStats stats={stats} />
          <WallOfFame />
          <RecentAdditions pyqs={recent} />
        </main>

        <Footer />
      </div>
    </div>
  );
}
