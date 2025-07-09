import { Chapter } from "@prisma/client";

export type ChapterWithUserProgress = Chapter & {
    userProgress: { isCompleted: boolean }[];
};