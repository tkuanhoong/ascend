import { db } from "@/lib/db";

export async function getBackupByUserId(userId: string) {
    try {
        const backups = await db.backup.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return backups;
    } catch (error) {
        console.log("[COURSE_DAL]", error);
        return [];
    }
}