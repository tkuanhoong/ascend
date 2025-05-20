import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";
import { AdminSectionCards } from "@/app/(dashboard)/admin/analytics/_components/admin-section-cards";
import { db } from "@/lib/db";
import { CourseStatus } from "@/generated/prisma";

export default async function AdminAnalyticsPage() {
  const purchasePromise = db.purchase.count();
  const totalUsersPromise = db.user.count();
  const totalCoursesPendingReviewPromise = db.course.count({
    where: {
      status: CourseStatus.PENDING,
    },
  });
  const totalRevenuePromise = db.purchase.aggregate({
    _sum: {
      amount: true,
    },
  });

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3); // Go back 3 months

  const purchasesInLast3Months = await db.purchase.groupBy({
    by: ["createdAt"], // Group by day
    where: {
      createdAt: {
        gte: threeMonthsAgo, // Greater than or equal to 3 months ago
        lte: new Date(), // Less than or equal to now (optional)
      },
    },
    _sum: {
      amount: true, // Sum the 'amount' field
    },
  });

  // Format the result
  const formattedData = purchasesInLast3Months.map((item) => ({
    date: item.createdAt.toISOString().split("T")[0], // Extract YYYY-MM-DD
    amount: item._sum.amount || 0, // Handle null cases
  }));

  const [
    totalPurchases,
    totalUserCount,
    totalCoursesPendingReviewCount,
    totalRevenueResult,
  ] = await Promise.all([
    purchasePromise,
    totalUsersPromise,
    totalCoursesPendingReviewPromise,
    totalRevenuePromise,
  ]);

  const {
    _sum: { amount: totalRevenue },
  } = totalRevenueResult;

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <AdminSectionCards
            totalRevenue={totalRevenue}
            totalPurchases={totalPurchases}
            totalUserCount={totalUserCount}
            totalCoursesPendingReviewCount={totalCoursesPendingReviewCount}
          />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive data={formattedData} />
          </div>
        </div>
      </div>
    </div>
  );
}
