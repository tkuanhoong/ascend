import { db } from "@/lib/db";
import { CourseBackupSettings } from "@/types/course";

export const getCourseBackupSettings = async (id: string): Promise<CourseBackupSettings | null> => {
    try {
        const courseBackupSettings = await db.course.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                title: true,
                sections: {
                    select: {
                        id: true,
                        title: true,
                        chapters: {
                            select: {
                                id: true,
                                title: true,
                            },
                        },
                    },
                },
            },
        });
        return courseBackupSettings;
    } catch (error) {
        console.log('[COURSE_DAL]', error);
        return null;
    }
}