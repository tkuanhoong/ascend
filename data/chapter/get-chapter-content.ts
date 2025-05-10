import { db } from "@/lib/db";
import { Attachment, CourseStatus } from "@/prisma/app/generated/prisma/client";

interface GetChapterContentProps {
    userId: string;
    courseId: string;
    chapterId: string;
}

export const getChapterContent = async ({ userId, courseId, chapterId }: GetChapterContentProps) => {
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
                status: CourseStatus.PUBLISHED,
                id: courseId
            }, select: {
                price: true
            }
        });

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                isPublished: true
            },
        });

        if (!chapter || !course) {
            throw new Error("Chapter or course not found");
        }

        let attachments: Attachment[] = [];

        if (purchase) {
            attachments = await db.attachment.findMany({
                where: {
                    chapterId
                }
            });
        }

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