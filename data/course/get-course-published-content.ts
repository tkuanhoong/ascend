import { db } from "@/lib/db";
import { CourseWithSectionsWithChaptersWithProgress } from "@/types/course";

export const getCoursePublishedContentWithProgress = async ({ courseId, userId }: { courseId: string, userId: string }): Promise<CourseWithSectionsWithChaptersWithProgress | null> => {
    try {
        const publishedContent = db.course.findUnique({
            where: {
                id: courseId,
            },
            include: {
                sections: {
                    where: {
                        isPublished: true,
                    },
                    orderBy: {
                        position: "asc",
                    },
                    include: {
                        chapters: {
                            where: {
                                isPublished: true,
                            },
                            orderBy: {
                                position: "asc",
                            },
                            include: {
                                userProgress: {
                                    where: {
                                        userId,
                                    },
                                    select: {
                                        isCompleted: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        return publishedContent;
    } catch (error) {
        console.log("[COURSE_DAL]", error);
        return null;
    }
}