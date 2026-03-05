import { DashboardOverview } from "@/components/dashboard/overview";
import { getDashboardData } from "@/actions/dashboard";
import { redirect } from "next/navigation";

export default async function Page() {
    const res = await getDashboardData();

    if (!res.success || !res.data) {
        if (res.error === "Unauthorized") redirect("/login");

        // Provide blank defaults if fetch fails
        return <DashboardOverview
            userName="Student"
            totalDownloads={0}
            totalUploads={0}
            pendingUploads={0}
            userRank="Unranked"
            recentUploads={[]}
        />;
    }

    return <DashboardOverview {...res.data} />;
}
