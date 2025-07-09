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
            success: "Course generated successfully",
            course
        });
    } catch (error) {
        console.log("[COURSE_AI_CREATE]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 }
        );
    }

}