import { db } from "@/lib/db";
import { SectionWithChapterCount } from "@/types/section";
import { Course, Purchase } from "@prisma/client";

type CourseWithSectionsWithPurchases = Course & {
    sections: SectionWithChapterCount[];
    purchases: Purchase[];
}

export const getCourseWithSectionsWithPurchases = async (id: string): Promise<CourseWithSectionsWithPurchases | null> => {
    try {
        const course = await db.course.findUnique({
            where: {
                id,
            },
            include: {
                purchases: true,
                sections: {
                    orderBy: {
                        position: "asc",
                    },
                    include: {
                        _count: {
                            select: { chapters: true }
                        }
                    }
                },
            },
        });

        return course;

    } catch {
        return null;
    }
}