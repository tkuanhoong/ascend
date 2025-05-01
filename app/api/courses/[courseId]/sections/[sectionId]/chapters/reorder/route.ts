import { getIsCourseOwner } from "@/data/course/course-owner";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { courseId } = await params;
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }
        const { list } = await req.json();

        const isCourseOwner = getIsCourseOwner({ userId: user.id, courseId })

        if (!isCourseOwner) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        for (const item of list) {
            await db.chapter.update({
                where: { id: item.id },
                data: { position: item.position }
            })
        }

        return NextResponse.json({ error: "Chapter reordered" }, { status: 200 });
    } catch (error) {
        console.log("[CHAPTER_REORDER]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}