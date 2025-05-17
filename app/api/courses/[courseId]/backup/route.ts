import { uploadFile } from '@/actions/uploadthing';
import { getIsCourseOwner } from '@/data/course/course-owner';
import { currentUserId } from "@/lib/auth";
import { db } from '@/lib/db';
import { FileBackupSchema } from '@/lib/zod';
import { NextRequest, NextResponse } from "next/server";

export interface SelectedSection {
    id: string;
    chapterIds: string[];
}

export async function POST(req: NextRequest, { params }: { params: { courseId: string } }) {
    try {
        const { courseId } = await params;
        const userId = await currentUserId();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        const isCourseOwner = await getIsCourseOwner({ courseId, userId });

        if (!isCourseOwner) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        const bodyData = await req.json() as SelectedSection[];

        const validatedResult = FileBackupSchema.safeParse(bodyData);

        if (!validatedResult.success) {
            return NextResponse.json({ error: "Invalid Inputs" }, { status: 400 });
        }

        const { data: { selectedSections } } = validatedResult;

        // 1. First, fetch the course with filtered sections (no chapters yet)
        const course = await db.course.findUnique({
            where: { id: courseId },
            select: {
                id: true,
                title: true,
                description: true,
                price: true,
                categoryId: true,
                sections: {
                    where: { id: { in: selectedSections.map((s) => s.id) } },
                    select: {
                        id: true,
                        title: true,
                        position: true,
                        level: true,
                        estimatedTime: true,
                        isFree: true,
                        isPublished: true,
                    }
                },
            },
        });

        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        // 2. Fetch chapters ONLY for sections that need them
        const sectionsWithChapters = await Promise.all(
            course.sections.map(async (section) => {
                const matchingBodyData = selectedSections.find((s) => s.id === section.id);
                if (!matchingBodyData?.chapterIds?.length) return section; // Skip if no chapters needed

                const chapters = await db.chapter.findMany({
                    where: {
                        id: { in: matchingBodyData.chapterIds },
                        sectionId: section.id, // Ensure chapters belong to this section
                    },
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        position: true,
                        isFree: true,
                        isPublished: true,
                    }
                });

                return { ...section, chapters };
            })
        );

        // 3. Reconstruct the course object with updated sections
        const result = {
            ...course,
            sections: sectionsWithChapters,
        };

        // 4. Convert to JSON and create a Blob
        const jsonData = JSON.stringify(result, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const filename = `course-backup-${courseId}-${Date.now()}.json`;

        // 5. Upload to UploadThing
        const file = new File([blob], filename, { type: 'application/json' });
        const uploadResponse = await uploadFile(file);

        if (!uploadResponse || !uploadResponse.data) {
            return NextResponse.json({ error: "Failed to generate file" }, { status: 500 })
        }

        const backup = await db.backup.create({
            data: {
                fileName: filename,
                fileUrl: uploadResponse.data.ufsUrl,
                userId
            }
        });

        return NextResponse.json({
            success: "Course backup created and uploaded successfully",
            backup
        });

    } catch (error) {
        console.log('[COURSE_BACKUP]', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }

}