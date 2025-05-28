import { getIsCourseOwner } from "@/data/course/course-owner";
import { getSectionWithChapters } from "@/data/section/get-section-with-chapters";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CourseStatus } from ".prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ courseId: string, sectionId: string }> }) {
    const { courseId, sectionId } = await params;
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
        }

        const { id: userId } = user;

        const isCourseOwner = getIsCourseOwner({ courseId, userId });

        if (!isCourseOwner) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
        }

        const section = await getSectionWithChapters(sectionId);

        if (!section) {
            return NextResponse.json({ error: "Section Not Found" }, { status: 404 })
        }

        const unpublishedSection = await db.section.update({
            where: {
                id: sectionId
            },
            data: {
                isPublished: false
            }
        })

        const publishedSectionsInCourse = await db.section.findMany({
            where: {
                courseId,
                isPublished: true
            }
        });

        if (!publishedSectionsInCourse.length) {
            await db.course.update({
                where: {
                    id: courseId
                },
                data: {
                    status: CourseStatus.DRAFT
                }
            });
        }

        return NextResponse.json({ success: "Section unpublished", unpublishedSection });
    } catch (error) {
        console.log("[SECTION_ID_UNPUBLISH]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}