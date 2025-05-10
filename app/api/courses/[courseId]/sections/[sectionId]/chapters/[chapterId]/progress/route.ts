import { currentUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { chapterId: string } }) {
    const { chapterId } = await params;
    try {
        const userId = await currentUserId();
        const { isCompleted } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
        }

        const userProgress = await db.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId
                }
            }, update: {
                isCompleted
            }, create: {
                userId,
                chapterId,
                isCompleted
            }
        });

        return NextResponse.json(userProgress);


    } catch (error) {
        console.log("[CHAPTER_ID_PROGRESS]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 })
    }
}