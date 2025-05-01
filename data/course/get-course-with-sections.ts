import { db } from "@/lib/db";

export const getCourseWithSections = async (id: string) => {
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