import { db } from "@/lib/db";

export const getSectionById = async (id: string) => {
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