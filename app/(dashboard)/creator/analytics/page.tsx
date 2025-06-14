import { CreatorSectionCards } from "./_components/creator-section-cards";
import { currentUserId } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";
import { getCreotorAnalyticsData } from "@/data/analytics";
import { getCreatorPurchasesByUserId } from "@/data/purchase";

export default async function DashboardPage() {
  const userId = await currentUserId();
  if (!userId) {
    redirect("/");
  }

  const { totalPurchases, totalLearnerCount, totalRevenue } =
    await getCreotorAnalyticsData(userId);

  const purchasesOverThreeMonths = await getCreatorPurchasesByUserId(userId);
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <CreatorSectionCards
            totalRevenue={totalRevenue ?? 0}
            totalPurchases={totalPurchases ?? 0}
            totalLearnerCount={totalLearnerCount ?? 0}
          />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive data={purchasesOverThreeMonths} />
          </div>
        </div>
      </div>
    </div>
  );
}
