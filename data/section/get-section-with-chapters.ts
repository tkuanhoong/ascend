import { db } from "@/lib/db"

export const getSectionWithChapters = async (id: string) => {
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