import { getIsCourseOwner } from "@/data/course/course-owner";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { mux } from "@/lib/mux";
import { NextRequest, NextResponse } from "next/server";


const { video } = mux;

export async function DELETE(req: NextRequest, { params }: { params: { courseId: string, sectionId: string, chapterId: string } }) {
    try {
        const { courseId, sectionId, chapterId } = await params;

        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        const { id: userId } = user;

        const isCourseOwner = getIsCourseOwner({ courseId, userId });

        if (!isCourseOwner) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        const existingChapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                sectionId
            }
        });

        if (!existingChapter) {
            return NextResponse.json({ error: "Chapter Not Found" }, { status: 404 })
        }

        if (existingChapter.videoUrl) {
            const videoData = await db.video.findFirst({
                where: {
                    chapterId
                }
            });

            if (videoData) {
                await video.assets.delete(videoData.assetId);
                await db.video.delete({
                    where: {
                        id: videoData.id
                    }
                });
            }
        }

        const deletedChapter = await db.chapter.delete({
            where: {
                id: chapterId,
                sectionId
            }
        });

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


        return NextResponse.json({ success: "Chapter deleted", deletedChapter });
    } catch (error) {
        console.log("[CHAPTER_ID]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { courseId: string, sectionId: string, chapterId: string } }) {
    try {
        const user = await currentUser();
        const { courseId, sectionId, chapterId } = await params;

        const values = await req.json();

        if (!user) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        const { id: userId } = user;

        const isCourseOwner = getIsCourseOwner({ courseId, userId });

        if (!isCourseOwner) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        const existingChapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                sectionId
            }
        });

        if (!existingChapter) {
            return NextResponse.json({ error: "Chapter not found!" }, { status: 404 });
        }

        const updatedChapter = await db.chapter.update({
            where: {
                id: existingChapter.id,
                sectionId
            },
            data: {
                ...values,
            }
        });

        if (values.videoUrl) {
            const existingVideoData = await db.video.findFirst({
                where: {
                    chapterId,
                }
            });

            // if user changing the video url, delete the existing video data
            if (existingVideoData) {
                await video.assets.delete(existingVideoData.assetId);
                await db.video.delete({
                    where: {
                        id: existingVideoData.id
                    }
                });
            }

            await video.assets.create({
                inputs: [{ url: values.videoUrl }],
                playback_policies: ["public"],
                test: true,
                meta: {
                    title: existingChapter.title,
                    creator_id: user.id,
                    external_id: chapterId,
                }
            });

        }

        return NextResponse.json({ success: "Chapter updated", updatedChapter });
    } catch (error) {
        console.log("[CHAPTER_ID]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}