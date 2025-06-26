import { db } from "@/lib/db";

export async function getIsCourseOwner({ courseId, userId }: { courseId: string, userId: string }) {
    try {
        const isCourseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        });
        return isCourseOwner;
    } catch {
        return null;
    }
}

export async function getCourseOwnerInfo({ courseId }: { courseId: string }) {
    try {
        const course = await db.course.findUnique({
            where: {
                id: courseId,
            }
        });

        if (!course) {
            return null;
        }

        const ownerInfo = await db.user.findUnique({
            where: {
                id: course.userId,
            },
            select: {
                name: true,
                email: true,
            }
        });

        return ownerInfo;
    } catch {
        return null;
    }
}