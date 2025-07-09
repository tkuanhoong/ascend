import { currentUserId } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CourseImportSchema } from "@/lib/zod";

export async function POST(req: NextRequest) {
    try {
        const userId = await currentUserId();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;
        const isJsonFile = file.type === 'application/json';

        if (!file || !isJsonFile) {
            return NextResponse.json({ error: "Invalid file provided" }, { status: 400 });
        }

        // Read and parse the JSON file
        const fileContents = await file.text();
        const jsonData = JSON.parse(fileContents);


        // Validate the imported data
        const validationResult = CourseImportSchema.safeParse(jsonData);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: "Invalid course structure", details: validationResult.error },
                { status: 400 }
            );
        }

        const courseData = validationResult.data;


        // Create the course, sections and chapters in a transaction
        const course = await db.$transaction(async (query) => {
            const course = await query.course.create({
                data: {
                    title: courseData.title,
                    description: courseData.description,
                    price: courseData.price,
                    categoryId: courseData.categoryId,
                    userId,
                },
            });
            if (courseData.sections && courseData.sections.length > 0) {
                for (const sectionData of courseData.sections) {
                    const { title, position, level, estimatedTime } = sectionData;
                    const section = await query.section.create({
                        data: {
                            title,
                            position,
                            level,
                            estimatedTime,
                            courseId: course.id,
                        },
                    });


                    if (sectionData.chapters && sectionData.chapters.length > 0) {
                        await query.chapter.createMany({
                            data: sectionData.chapters.map(chapter => {
                                const { title, description, position, isFree } = chapter;
                                return {
                                    title,
                                    description,
                                    position,
                                    isFree,
                                    sectionId: section.id,
                                }
                            }),
                        });
                    }
                }
            }
            return course;
        });

        return NextResponse.json({
            success: "Course imported successfully",
            course: course
        });

    } catch (error) {
        console.error("[COURSE_IMPORT]", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}