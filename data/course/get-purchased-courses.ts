import { db } from "@/lib/db";
import { getCourseProgress } from "./get-course-progress";
import { Category, Course, CourseStatus, Section } from ".prisma/client";

type SectionWithChapters = Section & {
    chapters: { id: string }[];
};

type CourseWithProgressWithCategory = Course & {
    category: Category;
    sections: SectionWithChapters[];
    progress: number | null;
}

type PurchasedCourses = {
    completedCourses: CourseWithProgressWithCategory[];
    coursesInProgress: CourseWithProgressWithCategory[];
}

export const getPurchasedCourses = async (userId: string): Promise<PurchasedCourses> => {
    try {
        const purchasedCourses = await db.purchase.findMany({
            where: {
                userId,
                course: {
                    status: {
                        not: CourseStatus.REVOKED
                    }
                }
            },
            select: {
                course: {
                    include: {
                        category: true,
                        sections: {
                            where: {
                                isPublished: true
                            },
                            include: {
                                chapters: {
                                    where: {
                                        isPublished: true
                                    },
                                    select: {
                                        id: true
                                    }
                                }
                            }
                        }

                    }
                }
            }
        });

        const courses = purchasedCourses.map((purchase) =>
            purchase.course
        ) as CourseWithProgressWithCategory[];

        for (const course of courses) {
            const progress = await getCourseProgress({ userId, courseId: course.id });
            course['progress'] = progress;
        }

        const completedCourses = courses.filter((course) => course.progress === 100);
        const coursesInProgress = courses.filter((course) => (course.progress ?? 0) < 100);

        return {
            completedCourses,
            coursesInProgress
        }
    } catch (error) {
        console.log("[GET_PURCHASED_COURSES]", error);
        return {
            completedCourses: [],
            coursesInProgress: []
        }
    }
}