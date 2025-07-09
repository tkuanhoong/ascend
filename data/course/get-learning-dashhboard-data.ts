import { CourseLearningDashboardData } from "@/types/course";
import { getPurchaseCourseRecord } from "../purchase";
import { getUserById } from "../user";
import { getCourseProgress } from "./get-course-progress";
import { getCoursePublishedContentWithProgress } from "./get-course-published-content";

export const getLearningDashboardData = async ({ userId, courseId }: { userId: string; courseId: string; }): Promise<CourseLearningDashboardData> => {
    try {
        const [user, purchase, course, progress] = await Promise.all([
            getUserById(userId),
            getPurchaseCourseRecord({ userId, courseId }),
            getCoursePublishedContentWithProgress({ userId, courseId }),
            getCourseProgress({ userId, courseId })
        ])

        const isPurchased = !!purchase;

        const courseCompletedDate = purchase?.completedProgressAt;

        return {
            user,
            purchase,
            isPurchased,
            courseCompletedDate,
            course,
            progress
        }
    } catch (error) {
        console.log("[COURSE_DAL]", error);
        return {
            user: null,
            purchase: null,
            courseCompletedDate: null,
            isPurchased: false,
            course: null,
            progress: 0,
        }
    }
}