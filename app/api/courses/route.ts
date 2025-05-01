import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CreateCourseSchema } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorised!" }, { status: 401 });
        }

        const jsonData = await req.json();
        const validatedData = CreateCourseSchema.safeParse(jsonData);
        if (!validatedData.success) {
            return NextResponse.json({ error: "Invalid Input!" }, { status: 400 });
        }

        const { title } = validatedData.data;
        const { id: userId } = user;

        const course = await db.course.create({
            data: {
                title,
                userId
            }
        });

        return NextResponse.json({ success: "Course created successfully!", course });
    } catch (error) {
        console.log("[COURSES]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}