import { db } from "@/lib/db";

export async function getAllCategories() {
    try {
        const categories = await db.category.findMany({
            orderBy: {
                name: "asc",
            },
        });
        return categories;
    } catch (error) {
        console.log("[CATEGORY_DAL]", error);
        return [];
    }
}