import { getIsCourseOwner } from "@/data/course/course-owner";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CourseStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ courseId: string, sectionId: string }> }) {
    try {
        const { courseId, sectionId } = await params;

        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        const { id: userId } = user;

        const isCourseOwner = await getIsCourseOwner({ courseId, userId });

        if (!isCourseOwner) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        const existingSection = await db.section.findUnique({
            where: {
                id: sectionId,
                courseId
            }
        });

        if (!existingSection) {
            return NextResponse.json({ error: "Section Not Found" }, { status: 404 })
        }

        const publishedSectionsCount = await db.section.count({
            where: {
                courseId,
                isPublished: true
            }
        });

        const { status } = isCourseOwner;
        const approvedCourse = status === CourseStatus.PUBLISHED || status === CourseStatus.UNPUBLISHED;
        const prohibitedAction = approvedCourse && publishedSectionsCount === 1
        if (prohibitedAction) {
            return NextResponse.json({ error: "Prohibited Action Detected" }, { status: 403 });
        }

        const deletedSection = await db.section.delete({
            where: {
                id: sectionId,
                courseId
            }
        });

        // TODO: DELETE LEFTOVER FILES

        return NextResponse.json({ success: "Section deleted", deletedSection });
    } catch (error) {
        console.log("[SECTION_ID]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ courseId: string, sectionId: string }> }) {
    try {
        const user = await currentUser();
        const { courseId, sectionId } = await params;

        const values = await req.json();

        if (!user) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        const { id: userId } = user;

        const isCourseOwner = await getIsCourseOwner({ courseId, userId });

        if (!isCourseOwner) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }

        const existingSection = await db.section.findUnique({
            where: {
                id: sectionId,
                courseId
            }
        });

        if (!existingSection) {
            return NextResponse.json({ error: "Section not found!" }, { status: 404 });
        }

        const updatedSection = await db.section.update({
            where: {
                id: existingSection.id,
                courseId
            },
            data: {
                ...values,
            }
        });

        // TODO: Update anything related to media
        // if ('imageUrl' in values && existingCourse.imageUrl) {
        //     await deleteUTFiles(existingCourse.imageUrl);
        // }

        return NextResponse.json({ success: "Section updated", updatedSection });
    } catch (error) {
        console.log("[SECTION_ID]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}