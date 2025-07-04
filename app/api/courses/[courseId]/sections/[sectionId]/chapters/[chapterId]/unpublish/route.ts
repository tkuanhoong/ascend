import { getChapterById } from "@/data/chapter/get-chapter-by-id";
import { getIsCourseOwner } from "@/data/course/course-owner";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CourseStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ courseId: string, sectionId: string, chapterId: string, }> }) {
    const { courseId, sectionId, chapterId } = await params;
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

        const chapter = await getChapterById(chapterId);

        if (!chapter) {
            return NextResponse.json({ error: "Chapter Not Found" }, { status: 404 })
        }


        const publishedSections = await db.section.findMany({
            where: {
                courseId,
                isPublished: true,
            },
            select: {
                chapters: {
                    where: {
                        isPublished: true,
                    },
                    select: {
                        id: true,
                    },
                }
            }
        });

        const publishedChaptersCount = publishedSections.flatMap(s => s.chapters).map(c => c.id).length;

        const { status } = isCourseOwner;
        const prohibitedAction = status === CourseStatus.PUBLISHED && publishedChaptersCount === 1
        if (prohibitedAction) {
            return NextResponse.json({ error: "Prohibited Action Detected" }, { status: 403 });
        }

        const unpublishedChapter = await db.chapter.update({
            where: {
                id: chapterId
            },
            data: {
                isPublished: false
            }
        })

        const publishedChaptersInSection = await db.chapter.findMany({
            where: {
                sectionId,
                isPublished: true
            }
        });

        if (!publishedChaptersInSection.length) {
            await db.section.update({
                where: {
                    id: sectionId
                },
                data: {
                    isPublished: false
                }
            });
        }

        return NextResponse.json({ success: "Chapter unpublished", unpublishedChapter });
    } catch (error) {
        console.log("[CHAPTER_ID_UNPUBLISH]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}