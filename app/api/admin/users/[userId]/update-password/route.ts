import { getUserById } from "@/data/user";
import { isCurrentUserAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/hash";
import { ResetPasswordSchema } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        const isAdmin = await isCurrentUserAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: "Forbidden Access" }, { status: 403 });
        }
        const { userId } = await params;
        const jsonData = await req.json();

        const validatedResult = ResetPasswordSchema.safeParse(jsonData);

        if (!validatedResult.success) {
            return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
        }

        const { data } = validatedResult;

        const existingUser = await getUserById(userId);

        if (!existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const hashedPassword = await hashPassword(data.confirmPassword);

        const user = await db.user.update({
            omit: {
                password: true,
            },
            where: {
                id: userId,
            },
            data: {
                password: hashedPassword
            }
        })

        return NextResponse.json({ success: "User password updated", user });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}