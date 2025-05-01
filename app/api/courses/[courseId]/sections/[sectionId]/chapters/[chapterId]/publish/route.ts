import { getChapterById } from "@/data/chapter/get-chapter-by-id";
import { getIsCourseOwner } from "@/data/course/course-owner";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { courseId: string, sectionId: string, chapterId: string, } }) {
    const { courseId, chapterId } = await params;
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

        const chapter = await getChapterById(chapterId);

        if (!chapter) {
            return NextResponse.json({ error: "Chapter Not Found" }, { status: 404 })
        }

        const videoData = await db.video.findUnique({
            where: {
                chapterId
            }
        });


        if (!videoData || !chapter.title || !chapter.description || !chapter.videoUrl) {
            return NextResponse.json({ errror: "Missing required fields" }, { status: 400 })
        }

        const publishedChapter = await db.chapter.update({
            where: {
                id: chapterId
            },
            data: {
                isPublished: true
            }
        })

        return NextResponse.json({ success: "Chapter published", publishedChapter });
    } catch (error) {
        console.log("[CHAPTER_ID_PUBLISH]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}