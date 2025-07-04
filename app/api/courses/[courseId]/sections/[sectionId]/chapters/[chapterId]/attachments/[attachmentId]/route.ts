import { deleteUTFiles } from "@/actions/uploadthing";
import { getIsCourseOwner } from "@/data/course/course-owner";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ courseId: string, chapterId: string, attachmentId: string }> }) {
    try {
        const { courseId, chapterId, attachmentId } = await params;
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }
        const { id: userId } = user;


        const isCourseOwner = await getIsCourseOwner({ courseId, userId });


        if (!isCourseOwner) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        const existingAttachment = await db.attachment.findUnique({
            where: {
                id: attachmentId,
                chapterId
            }
        })

        if (!existingAttachment) {
            return NextResponse.json({ error: "Attachment not found" }, { status: 404 });
        }

        const attachment = await db.attachment.delete({
            where: {
                id: attachmentId,
                chapterId
            }
        });

        if (attachment.url) {
            await deleteUTFiles(attachment.url);
        }

        return NextResponse.json({ success: "Course attachment deleted", attachment });

    } catch (error) {
        console.log("ATTACHMENT_ID", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}