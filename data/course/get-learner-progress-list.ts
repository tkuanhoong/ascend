import { db } from "@/lib/db";
import { getCourseProgress } from "./get-course-progress";
import { Purchase } from ".prisma/client";

export type PurchasesWithUserWithProgress = Purchase & {
    user: { name: string; email: string, },
    progress: number,
}

export const getLearnerProgressList = async (courseId: string): Promise<PurchasesWithUserWithProgress[]> => {
    try {

        const purchases = await db.purchase.findMany({
            where: {
                courseId
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        }) as PurchasesWithUserWithProgress[];

        for (const purchase of purchases) {
            const { courseId, userId } = purchase;
            const progress = await getCourseProgress({ userId, courseId });
            purchase['progress'] = progress;
        }

        return purchases;

    } catch (error) {
        console.log("[GET_LEARNER_PROGRESS]", error);
        return [];
    }
}