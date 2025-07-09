import { db } from "@/lib/db";
import { SectionWithChapters } from "@/types/section";
import { Section } from "@prisma/client";

export const getSectionById = async (id: string): Promise<Section | null> => {
    try {
        const section = await db.section.findUnique({
            where: {
                id
            },
        });

        return section;

    } catch {
        return null;
    }
}

export const getSectionByIdWithChapters = async (id: string): Promise<SectionWithChapters | null> => {
    try {
        const section = await db.section.findUnique({
            where: {
                id
            },
            include: {
                chapters: true
            }
        });

        return section;

    } catch {
        return null;
    }
}

export const getSectionByIdWithChaptersWithVideo = async (id: string) => {
    try {
        const section = await db.section.findUnique({
            where: {
                id,
            },
            include: {
                chapters: {
                    include: {
                        video: true
                    }
                }
            }
        })

        return section;
    } catch {
        return null;
    }
}