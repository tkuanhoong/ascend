import { isCurrentUserAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { getIsCourseOwner } from "./course-owner";
import { getPurchaseCourseRecord } from "../purchase";

export const getCourseDetailsContent = async ({ courseId, userId }: { courseId: string, userId: string }) => {
    try {
        const coursePromise = db.course.findUnique({
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
                    select: {
                        chapters: {
                            select: {
                                id: true,
                                title: true,
                                isFree: true,
                            },
                            where: {
                                isPublished: true,
                            },
                            orderBy: {
                                position: "asc",
                            },
                        },
                    },
                },
            },
        });

        const [course, isAdmin, isOwner, purchase] = await Promise.all([
            coursePromise,
            isCurrentUserAdmin(),
            getIsCourseOwner({ courseId, userId }),
            getPurchaseCourseRecord({ courseId, userId })
        ])

        const hasPreviewAccess = isAdmin || isOwner;

        return {
            course,
            isAdmin,
            isOwner,
            hasPreviewAccess,
            purchase
        };

    } catch {
        console.log("[COURSE_DAL]");
        return {
            course: null,
            isAdmin: null,
            isOwner: null,
            hasPreviewAccess: null,
            purchase: null,
        };
    }
}