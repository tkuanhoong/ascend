import { getIsCourseOwner } from "@/data/course/course-owner";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CourseStatus } from ".prisma/client";
import { NextResponse } from "next/server";
import { getCourseSectionWithChapters } from "@/data/section/get-course-sections";

export async function PATCH(req: Request, { params }: { params: Promise<{ courseId: string, sectionId: string }> }) {
    const { courseId, sectionId } = await params;
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
        }

        const { id: userId } = user;

        const isCourseOwner = await getIsCourseOwner({ courseId, userId });

        if (!isCourseOwner) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
        }

        const section = await getCourseSectionWithChapters({ sectionId, courseId });

        if (!section) {
            return NextResponse.json({ error: "Section Not Found" }, { status: 404 })
        }

        const publishedSectionsCount = await db.section.count({
            where: {
                courseId,
                isPublished: true
            }
        });

        const { status } = isCourseOwner;
        const approvedCourse = status === CourseStatus.PUBLISHED || status === CourseStatus.UNPUBLISHED;
        const prohibitedAction = approvedCourse && publishedSectionsCount === 1
        if (prohibitedAction) {
            return NextResponse.json({ error: "Prohibited Action Detected" }, { status: 403 });
        }

        const unpublishedSection = await db.section.update({
            where: {
                id: sectionId
            },
            data: {
                isPublished: false
            }
        })

        return NextResponse.json({ success: "Section unpublished", unpublishedSection });
    } catch (error) {
        console.log("[SECTION_ID_UNPUBLISH]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}