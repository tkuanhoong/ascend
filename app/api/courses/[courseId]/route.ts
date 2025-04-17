import { deleteUTFiles } from "@/actions/uploadthing";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const { courseId: id } = await params;
        const course = await db.course.findFirst({ where: { id } });
        if (!course) {
            return NextResponse.json({ error: "Course not found!" }, { status: 404 });
        }

        return NextResponse.json(course);

    } catch (error) {
        console.log("[COURSE_ID]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const user = await currentUser();
        const { courseId } = await params;

        const values = await req.json();

        if (!user) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }
        const userId = user.id;

        const existingCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        });

        if (!existingCourse) {
            return NextResponse.json({ error: "Course not found!" }, { status: 404 });
        }

        const updatedCourse = await db.course.update({
            where: {
                id: existingCourse.id,
                userId
            },
            data: {
                ...values,
            }
        });

        if ('imageUrl' in values && existingCourse.imageUrl) {
            await deleteUTFiles(existingCourse.imageUrl);
        }

        return NextResponse.json(updatedCourse);
    } catch (error) {
        console.log("[COURSE_ID]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const user = await currentUser();
        const { courseId } = await params;

        if (!user) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }
        const userId = user.id;

        const existingCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        });

        if (!existingCourse) {
            return NextResponse.json({ error: "Course not found!" }, { status: 404 });
        }

        const deletedCourse = await db.course.delete({
            where: {
                id: existingCourse.id,
                userId
            },
        });

        // TODO: DELETE LEFTOVER FILES

        if (deletedCourse.imageUrl) {
            await deleteUTFiles(deletedCourse.imageUrl);
        }

        return NextResponse.json({ success: "Course deleted" });
    } catch (error) {
        console.log("[COURSE_ID]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}