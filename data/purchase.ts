import { db } from "@/lib/db";
import { PurchaseAnalyticsData } from "@/types/analytics";

export async function getPurchaseCourseRecord({ userId, courseId }: { userId: string; courseId: string; }) {
    try {
        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });
        return purchase;
    } catch (error) {
        console.log("[PURCHASE_DAL]", error);
        return null;
    }
}

export async function getAllThreeMonthsAgoPurchases(): Promise<PurchaseAnalyticsData | []> {
    try {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3); // Go back 3 months

        const purchasesInLast3Months = await db.purchase.groupBy({
            by: ["createdAt"], // Group by day
            where: {
                createdAt: {
                    gte: threeMonthsAgo, // Greater than or equal to 3 months ago
                    lte: new Date(), // Less than or equal to now
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

        return formattedData;
    } catch (error) {
        console.log("[PURCHASE_DAL]", error);
        return [];
    }

}

export async function getCreatorPurchasesByUserId(userId: string): Promise<PurchaseAnalyticsData | []> {
    try {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3); // Go back 3 months

        const purchasesInLast3Months = await db.purchase.groupBy({
            by: ["createdAt"], // Group by day
            where: {
                createdAt: {
                    gte: threeMonthsAgo, // Greater than or equal to 3 months ago
                    lte: new Date(), // Less than or equal to now
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

        return formattedData;
    } catch (error) {
        console.log("[PURCHASE_DAL]", error);
        return [];
    }

}