import { db } from "@/lib/db";
import { Attachment, Chapter, Video } from "@/generated/prisma";

interface ChapterWithVideoAndAttachments extends Chapter {
    video: Video | null;
    attachments: Attachment[];
}

export const getChapterWithVideoAndAttachments = async (id: string): Promise<ChapterWithVideoAndAttachments | null> => {
    try {
        const chapter = await db.chapter.findUnique({
            where: {
                id
            },
            include: {
                video: true,
                attachments: true,
            }
        });

        return chapter;

    } catch {
        return null;
    }
}