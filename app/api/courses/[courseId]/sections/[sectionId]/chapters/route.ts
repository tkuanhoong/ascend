import { getIsCourseOwner } from "@/data/course/course-owner";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CreateChapterSchema } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ courseId: string, sectionId: string }> }) {
    try {
        const { courseId, sectionId } = await params;
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorised!" }, { status: 401 });
        }
        const { id: userId } = user;

        const courseOwner = await getIsCourseOwner({ userId, courseId });

        if (!courseOwner) {
            return NextResponse.json({ error: "Unauthorised!" }, { status: 401 })
        }

        const jsonData = await req.json();

        const validatedData = CreateChapterSchema.safeParse(jsonData);
        if (!validatedData.success) {
            return NextResponse.json({ error: "Invalid Input!" }, { status: 400 });
        }

        const { title } = validatedData.data;

        const section = await db.section.findUnique({
            where: {
                id: sectionId,
            }
        });

        if (!section) {
            return NextResponse.json({ error: "Section not found!" }, { status: 404 });
        }

        const lastChapter = await db.chapter.findFirst({
            where: {
                sectionId
            },
            orderBy: {
                position: "desc"
            }
        })

        const newPosition = lastChapter ? lastChapter.position + 1 : 1;

        const chapter = await db.chapter.create({
            data: {
                title,
                position: newPosition,
                sectionId
            }
        });

        return NextResponse.json({ success: "Chapter created successfully!", chapter });
    } catch (error) {
        console.log("[CHAPTERS]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}