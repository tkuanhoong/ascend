import { Chapter, Section } from "@prisma/client";
import { ChapterWithUserProgress } from "./chapter";

export type SectionWithChapters = Section & {
    chapters: Chapter[]
}

export type SectionWithChaptersWithProgress = Section & {
    chapters: ChapterWithUserProgress[];
};
