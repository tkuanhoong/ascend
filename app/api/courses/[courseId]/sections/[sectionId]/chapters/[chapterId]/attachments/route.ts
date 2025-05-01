import { getIsCourseOwner } from '@/data/course/course-owner';
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { currentUser } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: { courseId: string, chapterId: string } }) {
    try {
        const { courseId, chapterId } = await params;
        const user = await currentUser();
        const { url, name } = await req.json();

        if (!user) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        const { id: userId } = user;

        const isCourseOwner = await getIsCourseOwner({ courseId, userId })

        if (!isCourseOwner) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        const attachment = await db.attachment.create({
            data: {
                url,
                name,
                chapterId,
            }
        });

        return NextResponse.json({ success: "Chapter attachment created", attachment });
    } catch (error) {
        console.log("CHAPTER_ID_ATTACHMENTS", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}