import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";
import { AdminSectionCards } from "@/app/(dashboard)/admin/analytics/_components/admin-section-cards";
import { getAdminAnalyticsData } from "@/data/analytics";
import { getAllThreeMonthsAgoPurchases } from "@/data/purchase";

export default async function AdminAnalyticsPage() {
  const {
    totalRevenue,
    totalPurchases,
    totalUserCount,
    totalCoursesPendingReviewCount,
  } = await getAdminAnalyticsData();

  const purchasesOverThreeMonths = await getAllThreeMonthsAgoPurchases();

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <AdminSectionCards
          totalRevenue={totalRevenue ?? 0}
          totalPurchases={totalPurchases ?? 0}
          totalUserCount={totalUserCount ?? 0}
          totalCoursesPendingReviewCount={totalCoursesPendingReviewCount ?? 0}
        />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive data={purchasesOverThreeMonths ?? []} />
        </div>
      </div>
    </div>
  );
}
