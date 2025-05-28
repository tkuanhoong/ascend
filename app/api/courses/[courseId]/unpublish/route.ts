import { getIsCourseOwner } from "@/data/course/course-owner";
import { getCourseById } from "@/data/course/get-course-by-id";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CourseStatus } from ".prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
        }

        const { id: userId } = user;

        const isCourseOwner = getIsCourseOwner({ courseId, userId });

        if (!isCourseOwner) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
        }

        const course = await getCourseById(courseId);

        if (!course) {
            return NextResponse.json({ error: "Course Not Found" }, { status: 404 })
        }

        const unpublishedCourse = await db.course.update({
            where: {
                id: courseId
            },
            data: {
                status: CourseStatus.DRAFT
            }
        })

        return NextResponse.json({ success: "Course unpublished", unpublishedCourse });
    } catch (error) {
        console.log("[COURSE_ID_UNPUBLISH]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}