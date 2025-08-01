import { db } from "@/lib/db";
import { Course, Section } from "@prisma/client";

type CourseWithSections = Course & {
    sections: Section[];
}

export const getCourseWithSections = async (id: string): Promise<CourseWithSections | null> => {
    try {
        const course = await db.course.findUnique({
            where: {
                id,
            },
            include: {
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