import { db } from "@/lib/db";

export const getCourseSection = async ({ sectionId, courseId }: { sectionId: string, courseId: string }) => {
  try {
    const section = await db.section.findUnique({
      where: {
        id: sectionId,
        courseId,
      },
    });
    return section;
  } catch (error) {
    console.log("[SECTION_DAL]", error);
    return null;
  }
}

export const getCourseSectionWithChapters = async ({ sectionId, courseId }: { sectionId: string, courseId: string }) => {
  try {
    const section = await db.section.findUnique({
      where: {
        id: sectionId,
        courseId,
      },
      include: {
        chapters: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });
    return section;
  } catch (error) {
    console.log("[SECTION_DAL]", error);
    return null;
  }
}