import { Chapter, Section } from "@prisma/client";
import { ChapterWithUserProgress } from "./chapter";

export type SectionWithChapters = Section & {
    chapters: Chapter[];
}
export type SectionWithChapterCount = Section & {
    _count: {
        chapters: number;
    };
}

export type SectionWithChapterIds = Section & {
    chapters: { id: string }[];
};

export type SectionWithChaptersWithProgress = Section & {
    chapters: ChapterWithUserProgress[];
};
