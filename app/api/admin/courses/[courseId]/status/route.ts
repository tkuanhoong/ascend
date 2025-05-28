
import { isCurrentUserAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminCourseStatusSchema } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
    try {
        const isAdmin = isCurrentUserAdmin();

        if (!isAdmin) {
            return NextResponse.json({ error: "Forbidden Access" }, { status: 403 });
        }

        const { courseId } = await params;
        const jsonBody = await req.json();

        const validatedResult = AdminCourseStatusSchema.safeParse(jsonBody);

        if (!validatedResult.success) {
            return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
        }

        const { status, reason } = validatedResult.data;

        const course = await db.course.findUnique({
            where: {
                id: courseId
            }
        })

        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        const updatedCourse = await db.course.update({
            where: {
                id: course.id
            },
            data: {
                status,
                reason
            }
        })

        return NextResponse.json({ success: "Course Status Updated", updatedCourse });


    } catch (error) {
        console.log("[ADMIN_COURSE_STATUS", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }


}