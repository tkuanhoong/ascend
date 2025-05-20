import { db } from "@/lib/db";

export const getCourseProgress = async ({ userId, courseId }: {
    userId: string,
    courseId: string
}): Promise<number> => {
    try {
        const publishedSections = await db.section.findMany({
            where: {
                courseId,
                isPublished: true,
            },
            select: {
                chapters: {
                    where: {
                        isPublished: true
                    },
                    select: {
                        id: true
                    }
                }
            },
        });

        const publishedChapterIds = publishedSections
            .flatMap(section => section.chapters)
            .map(chapter => chapter.id);

        const validCompletedChapters = await db.userProgress.count({
            where: {
                userId,
                chapterId: {
                    in: publishedChapterIds,
                },
                isCompleted: true,
            },
        });

        const progressPercentage =
            (validCompletedChapters / publishedChapterIds.length) * 100;

        return progressPercentage;
    } catch (error) {
        console.log("[GET_COURSE_PROGRESS]", error);
        return 0;
    }
};