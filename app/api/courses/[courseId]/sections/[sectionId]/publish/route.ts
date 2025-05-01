import { getIsCourseOwner } from "@/data/course/course-owner";
import { getSectionWithChapters } from "@/data/section/get-section-with-chapters";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { courseId: string, sectionId: string } }) {
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

        const hasPublishedChapter = section.chapters.some(chapter => chapter.isPublished)

        if (!section.title || !section.level || !section.estimatedTime || !hasPublishedChapter) {
            return NextResponse.json({ errror: "Missing required fields" }, { status: 400 })
        }

        const publishedSection = await db.section.update({
            where: {
                id: sectionId
            },
            data: {
                isPublished: true
            }
        })

        return NextResponse.json({ success: "Section published", publishedSection });
    } catch (error) {
        console.log("[SECTION_ID_PUBLISH]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}