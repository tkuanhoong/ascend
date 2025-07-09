
export type PurchaseAnalyticsData = {
    date: string;
    amount: number;
}[]

export type AdminAnalyticsData = {
    totalRevenue: number | null;
    totalPurchases: number | null;
    totalUserCount: number | null;
    totalCoursesPendingReviewCount: number | null;
}

export type CreatorAnalyticsData = {
    totalPurchases: number | null;
    totalLearnerCount: number | null;
    totalRevenue: number | null;
}