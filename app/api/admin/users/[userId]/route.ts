import { getUserById } from "@/data/user";
import { isCurrentUserAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminEditUserFormSchema } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    try {
        const isAdmin = await isCurrentUserAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: "Forbidden Access" }, { status: 403 });
        }
        const { userId } = await params;
        const jsonData = await req.json();

        const validatedResult = AdminEditUserFormSchema.safeParse(jsonData);

        if (!validatedResult.success) {
            return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
        }

        const { data } = validatedResult;

        const existingUser = await getUserById(userId);

        if (!existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const user = await db.user.update({
            omit: {
                password: true,
            },
            where: {
                id: userId,
            },
            data
        })

        return NextResponse.json({ success: "User profile updated", user });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    try {
        const isAdmin = await isCurrentUserAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: "Forbidden Access" }, { status: 403 });
        }
        const { userId } = await params;

        const existingUser = await getUserById(userId);

        if (!existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const user = await db.user.delete({
            where: {
                id: existingUser.id
            }
        })

        return NextResponse.json({ success: "User deleted", user });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}