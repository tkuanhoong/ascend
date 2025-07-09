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


        // Create the course, sections and chapters
        const course = await db.course.create({
            data: {
                title: courseData.title,
                description: courseData.description,
                price: courseData.price,
                categoryId: courseData.categoryId,
                userId,
                // Nest the creation of related sections
                sections: {
                    create: courseData.sections?.map(sectionData => ({
                        title: sectionData.title,
                        position: sectionData.position,
                        level: sectionData.level,
                        estimatedTime: sectionData.estimatedTime,
                        // Nest the creation of related chapters within each section
                        chapters: {
                            create: sectionData.chapters?.map(chapterData => ({
                                title: chapterData.title,
                                description: chapterData.description,
                                position: chapterData.position,
                                isFree: chapterData.isFree,
                            }))
                        }
                    }))
                }
            },
            // Include the created sections and chapters
            include: {
                sections: {
                    include: {
                        chapters: true
                    }
                }
            }
        });

        return NextResponse.json({
            success: "Course imported successfully",
            course
        });

    } catch (error) {
        console.error("[COURSE_IMPORT]", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}