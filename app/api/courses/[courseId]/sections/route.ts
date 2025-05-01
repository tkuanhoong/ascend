import { getIsCourseOwner } from "@/data/course/course-owner";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CreateSectionSchema } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { courseId: string } }) {
    try {
        const { courseId } = await params;
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorised!" }, { status: 401 });
        }
        const { id: userId } = user;

        const courseOwner = await getIsCourseOwner({ userId, courseId });

        if (!courseOwner) {
            return NextResponse.json({ error: "Unauthorised!" }, { status: 401 })
        }

        const jsonData = await req.json();

        const validatedData = CreateSectionSchema.safeParse(jsonData);
        if (!validatedData.success) {
            return NextResponse.json({ error: "Invalid Input!" }, { status: 400 });
        }

        const { title } = validatedData.data;

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        });

        if (!course) {
            return NextResponse.json({ error: "Course not found!" }, { status: 404 });
        }

        const lastSection = await db.section.findFirst({
            where: {
                courseId: course.id
            },
            orderBy: {
                position: "desc"
            }
        })

        const newPosition = lastSection ? lastSection.position + 1 : 1;

        const section = await db.section.create({
            data: {
                title,
                position: newPosition,
                courseId: course.id
            }
        });

        return NextResponse.json({ success: "Section created successfully!", section });
    } catch (error) {
        console.log("[SECTIONS]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}