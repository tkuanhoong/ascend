import { currentUserId } from '@/lib/auth';
import { db } from '@/lib/db';
import { AICourseImportSchema } from '@/lib/zod';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const userId = await currentUserId();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        const parsedBody = await req.json();

        const validatedResult = AICourseImportSchema.safeParse(parsedBody);

        if (!validatedResult.success) {
            return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
        }

        const courseData = validatedResult.data;

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
            // Include the created sections and chapters in the response if needed
            include: {
                sections: {
                    include: {
                        chapters: true
                    }
                }
            }
        });

        return NextResponse.json({
            success: "Course generated successfully",
            course
        });
    } catch (error) {
        console.log("[COURSE_AI_CREATE]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 }
        );
    }

}