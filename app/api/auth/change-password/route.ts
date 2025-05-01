import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/hash";
import { ChangePasswordSchema } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorised!" }, { status: 401 })
        }

        const jsonData = await req.json();

        const validatedResult = ChangePasswordSchema.safeParse(jsonData);

        if (!validatedResult.success) {
            return NextResponse.json({ error: "Invalid Inputs!" }, { status: 400 })
        }

        const existingUser = await getUserById(user.id);

        if (!existingUser) {
            return NextResponse.json({ error: "User not found!" }, { status: 404 });
        }

        const currentUserPassword = existingUser.password;

        const { current, confirmPassword } = validatedResult.data;

        const isValidPassword = await verifyPassword(current, currentUserPassword!);

        if (!isValidPassword) {
            return NextResponse.json({ error: "Invalid credentials!" }, { status: 401 });
        }

        const hashedPassword = await hashPassword(confirmPassword);

        await db.user.update({
            where: {
                id: existingUser.id
            },
            data: {
                password: hashedPassword
            }
        });

        return NextResponse.json({ success: "Password Updated Successfully!" });
    } catch (error) {
        console.log('[CHANGE-PASSWORD]', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }


}