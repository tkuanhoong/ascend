import { db } from "@/lib/db";
import {
  Category,
  Course,
  CourseStatus,
  Section,
} from "@/generated/prisma";
import { getCourseProgress } from "./get-course-progress";
import { currentUserId } from "@/lib/auth";

export type SectionWithChapters = Section & {
  chapters: { id: string }[];
};

export type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  sections: SectionWithChapters[];
  progress: number | null;
};

type GetHomeCourses = {
  title?: string;
  categoryId?: string;
};

export const getHomeCourses = async ({
  title,
  categoryId,
}: GetHomeCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const userId = await currentUserId();
    const courses = await db.course.findMany({
      where: {
        status: CourseStatus.PUBLISHED,
        title: {
          contains: title,
        },
        categoryId,
      },
      include: {
        category: true,
        sections: {
          where: {
            isPublished: true,
          },
          include: {
            chapters: {
              where: {
                isPublished: true,
              },
              select: {
                id: true,
              },
            },
          },
        },
        purchases: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const coursesWithProgress: CourseWithProgressWithCategory[] =
      await Promise.all(
        courses.map(async (course) => {
          if (course.purchases.length === 0) {
            return {
              ...course,
              progress: null,
            };
          }
          let progressPercentage = null;
          if (userId) {
            progressPercentage = await getCourseProgress({
              userId,
              courseId: course.id,
            });
          }
          return {
            ...course,
            progress: progressPercentage,
          };
        })
      );
    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_HOME_COURSES]", error);
    return [];
  }
};
