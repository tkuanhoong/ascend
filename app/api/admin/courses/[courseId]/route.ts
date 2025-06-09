import { deleteUTFiles } from "@/actions/uploadthing";
import { isCurrentUserAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: Promise<{ courseId: string }> }) {
    try {
        const { courseId } = await params;

        const isAdmin = await isCurrentUserAdmin();

        if (!isAdmin) {
            return NextResponse.json({ error: "Forbidden Access" }, { status: 403 });
        }

        const existingCourse = await db.course.findUnique({
            where: {
                id: courseId,
            }
        });

        if (!existingCourse) {
            return NextResponse.json({ error: "Course not found!" }, { status: 404 });
        }

        const deletedCourse = await db.course.delete({
            where: {
                id: existingCourse.id,
            },
        });

        // TODO: DELETE LEFTOVER FILES

        if (deletedCourse.imageUrl) {
            await deleteUTFiles(deletedCourse.imageUrl);
        }

        return NextResponse.json({ success: "Course deleted" });
    } catch (error) {
        console.log("[ADMIN_COURSE_ID]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}