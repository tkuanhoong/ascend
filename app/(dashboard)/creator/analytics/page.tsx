import { db } from "@/lib/db";
import { CreatorSectionCards } from "./_components/creator-section-cards";
import { currentUserId } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";

export default async function DashboardPage() {
  const userId = await currentUserId();
  if (!userId) {
    redirect("/");
  }

  const purchasePromise = db.purchase.count({
    where: {
      course: {
        userId,
      },
    },
  });
  const totalLearnersPromise = db.purchase.count({
    where: {
      course: {
        userId,
      },
    },
  });
  const totalRevenuePromise = db.purchase.aggregate({
    where: {
      course: {
        userId,
      },
    },
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
      course: {
        userId,
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

  const [totalPurchases, totalLearnerCount, totalRevenueResult] =
    await Promise.all([
      purchasePromise,
      totalLearnersPromise,
      totalRevenuePromise,
    ]);

  const {
    _sum: { amount: totalRevenue },
  } = totalRevenueResult;
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <CreatorSectionCards
            totalRevenue={totalRevenue}
            totalPurchases={totalPurchases}
            totalLearnerCount={totalLearnerCount}
          />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive data={formattedData} />
          </div>
        </div>
      </div>
    </div>
  );
}
