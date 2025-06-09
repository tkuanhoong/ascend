import { db } from "@/lib/db";
import { Attachment, Chapter, Purchase, UserProgress } from ".prisma/client";

interface GetChapterContentProps {
    userId: string;
    courseId: string;
    chapterId: string;
}

interface GetChapterContentResponse {
    course: { price: number | null; } | null;
    chapter: Chapter | null;
    attachments: Attachment[];
    userProgress: UserProgress | null;
    purchase: Purchase | null;

}

export const getChapterContent = async ({ userId, courseId, chapterId }: GetChapterContentProps): Promise<GetChapterContentResponse> => {
    try {
        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        });

        const course = await db.course.findUnique({
            where: {
                id: courseId
            }, select: {
                price: true
            }
        });

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
            },
        });

        if (!chapter || !course) {
            throw new Error("Chapter or course not found");
        }

        const attachments = await db.attachment.findMany({
            where: {
                chapterId
            }
        });


        const userProgress = await db.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId
                }
            }
        });

        return {
            course,
            chapter,
            attachments,
            userProgress,
            purchase,
        }
    } catch (error) {
        console.log("[GET_CHAPTER_CONTENT]", error);
        return {
            chapter: null,
            course: null,
            attachments: [],
            userProgress: null,
            purchase: null,
        }
    }
}