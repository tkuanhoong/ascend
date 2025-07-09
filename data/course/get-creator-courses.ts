import { db } from "@/lib/db";
import { CourseWithCategory } from "@/types/course";

export async function getCreatorCourses(userId: string): Promise<CourseWithCategory[] | []> {
    try {
        const courses = db.course.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                category: true,
            },
        });
        return courses;

    } catch (error) {
        console.log("[GET_CREATOR_COURSES]", error);
        return [];
    }
}