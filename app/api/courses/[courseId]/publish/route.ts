import { getIsCourseOwner } from "@/data/course/course-owner";
import { getCourseWithSections } from "@/data/course/get-course-with-sections";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CourseStatus } from "@/generated/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
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

        const course = await getCourseWithSections(courseId);

        if (!course) {
            return NextResponse.json({ error: "Course Not Found" }, { status: 404 })
        }

        const hasPublishedSection = course.sections.some(section => section.isPublished)

        if (!course.title || !course.description || !course.categoryId || !course.imageUrl || !course.price || !hasPublishedSection) {
            return NextResponse.json({ errror: "Missing required fields" }, { status: 400 })
        }

        const publishedCourse = await db.course.update({
            where: {
                id: courseId
            },
            data: {
                status: CourseStatus.PUBLISHED
            }
        })

        return NextResponse.json({ success: "Course pending admin approval", publishedCourse });
    } catch (error) {
        console.log("[COURSE_ID_PUBLISH]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}