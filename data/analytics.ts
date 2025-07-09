import { db } from "@/lib/db";
import { AdminAnalyticsData, CreatorAnalyticsData } from "@/types/analytics";
import { CourseStatus } from "@prisma/client";


export const getAdminAnalyticsData = async (): Promise<AdminAnalyticsData> => {
    try {
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

        const { _sum: { amount: totalRevenue } } = totalRevenueResult;

        return {
            totalPurchases,
            totalUserCount,
            totalCoursesPendingReviewCount,
            totalRevenue,
        };
    } catch {
        return {
            totalPurchases: null,
            totalUserCount: null,
            totalCoursesPendingReviewCount: null,
            totalRevenue: null,
        };
    }
}

export const getCreatorAnalyticsData = async (userId: string): Promise<CreatorAnalyticsData> => {
    try {
        const purchasePromise = db.purchase.count({
            where: {
                course: {
                    userId,
                },
            },
        });
        const totalLearnersPromise = db.purchase.findMany({
            where: {
                course: {
                    userId,
                },
            },
            distinct: ['userId'],
            select: {
                userId: true,
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

        const [
            totalPurchases,
            totalLearners,
            totalRevenueResult,
        ] = await Promise.all([
            purchasePromise,
            totalLearnersPromise,
            totalRevenuePromise,
        ]);

        const { _sum: { amount: totalRevenue } } = totalRevenueResult;

        return {
            totalPurchases,
            totalLearnerCount: totalLearners.length,
            totalRevenue,
        };
    } catch {
        return {
            totalPurchases: null,
            totalLearnerCount: null,
            totalRevenue: null,
        };
    }
}