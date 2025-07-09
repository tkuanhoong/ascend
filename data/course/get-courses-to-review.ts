import { db } from "@/lib/db";
import { CourseWithUserEmail } from "@/types/course";

export async function getCoursesToReview(): Promise<CourseWithUserEmail[] | []> {
    try {
        const coursesToReview = await db.course.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: {
                    select: {
                        email: true,
                    },
                },
            },
        })

        return coursesToReview;
    } catch (error) {
        console.log("[COURSE_DAL]", error);
        return [];
    }
}