import { Category, Course, Purchase, User } from "@prisma/client";
import { SectionWithChaptersWithProgress } from "./section";

export type CourseWithUserEmail = Course & { user: { email: string | null } };

export type CourseWithCategory = Course & { category: Category | null };

export type CourseWithSectionsWithChaptersWithProgress = Course & {
    sections: SectionWithChaptersWithProgress[]
};

export type CourseBackupSettings = {
    id: string;
    title: string;
    sections: {
        id: string;
        title: string;
        chapters: {
            id: string;
            title: string;
        }[]
    }[],
}

export type CourseLearningDashboardData = {
    user: User | null,
    purchase: Purchase | null,
    courseCompletedDate: Date | null | undefined,
    isPurchased: boolean,
    course: CourseWithSectionsWithChaptersWithProgress | null,
    progress: number,
}

export type CourseDetailsContentData = {
    course: Course,
    isAdmin: null,
    isOwner: null,
    hasPreviewAccess: null,
    purchase: null,
};
