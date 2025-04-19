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