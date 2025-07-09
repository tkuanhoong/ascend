import { getIsCourseOwner } from "@/data/course/course-owner";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { courseId } = await params;
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }
        const { list } = await req.json();

        const isCourseOwner = await getIsCourseOwner({ userId: user.id, courseId })

        if (!isCourseOwner) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        for (const item of list) {
            await db.section.update({
                where: { id: item.id },
                data: { position: item.position }
            })
        }

        return NextResponse.json({ error: "Section reordered" }, { status: 200 });
    } catch (error) {
        console.log("[REORDER]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}