import { db } from "@/lib/db";
import { Course, Purchase, Section } from "@prisma/client";

type CourseWithSectionsWithPurchases = Course & {
    sections: Section[];
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
                },
            },
        });

        return course;

    } catch {
        return null;
    }
}